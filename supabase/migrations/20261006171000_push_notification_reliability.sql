-- Push notification reliability improvements.
-- Keeps in-app notifications independent from push delivery, adds delivery claiming,
-- device identity/health metadata, and immediate push dispatch for newly-created alerts.

alter table public.push_subscriptions
    add column if not exists device_id text,
    add column if not exists last_seen_at timestamptz,
    add column if not exists last_success_at timestamptz,
    add column if not exists last_failure_at timestamptz,
    add column if not exists failure_count integer not null default 0;

update public.push_subscriptions
set last_seen_at = coalesce(last_seen_at, updated_at, created_at, now())
where last_seen_at is null;

alter table public.notifications
    add column if not exists push_claimed_at timestamptz,
    add column if not exists push_attempts integer not null default 0,
    add column if not exists push_last_error text;

create index if not exists push_subscriptions_active_seen_idx
    on public.push_subscriptions (user_id, is_active, last_seen_at desc);

create index if not exists notifications_push_claim_idx
    on public.notifications (user_id, push_sent_at, push_claimed_at, created_at)
    where dismissed_at is null;

create or replace function public.register_push_subscription(
    p_endpoint text,
    p_p256dh text,
    p_auth text,
    p_user_agent text,
    p_device_id text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_existing_user uuid;
    v_existing_p256dh text;
    v_existing_auth text;
    v_id uuid;
begin
    if v_uid is null then
        raise exception 'Authentication required';
    end if;

    if coalesce(length(p_endpoint), 0) < 20
       or coalesce(length(p_p256dh), 0) < 10
       or coalesce(length(p_auth), 0) < 5 then
        raise exception 'Invalid push subscription';
    end if;

    if p_device_id is not null and length(p_device_id) > 100 then
        raise exception 'Invalid device id';
    end if;

    select user_id, p256dh, auth
      into v_existing_user, v_existing_p256dh, v_existing_auth
    from public.push_subscriptions
    where endpoint = p_endpoint
      and user_id <> v_uid
    limit 1;

    if v_existing_user is not null then
        -- Reassigning the exact browser subscription is allowed only when the
        -- caller proves possession of its matching Web Push keys.
        if v_existing_p256dh <> p_p256dh or v_existing_auth <> p_auth then
            raise exception 'Push endpoint is already registered elsewhere';
        end if;
        delete from public.push_subscriptions
        where endpoint = p_endpoint
          and user_id = v_existing_user;
    end if;

    if nullif(trim(p_device_id), '') is not null then
        update public.push_subscriptions
        set is_active = false,
            updated_at = now()
        where user_id = v_uid
          and device_id = p_device_id
          and endpoint <> p_endpoint
          and is_active = true;
    end if;

    insert into public.push_subscriptions (
        user_id, endpoint, p256dh, auth, user_agent, device_id,
        is_active, last_seen_at, failure_count, updated_at
    )
    values (
        v_uid, p_endpoint, p_p256dh, p_auth, nullif(p_user_agent, ''),
        nullif(trim(p_device_id), ''), true, now(), 0, now()
    )
    on conflict (user_id, endpoint)
    do update set
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_agent = excluded.user_agent,
        device_id = excluded.device_id,
        is_active = true,
        last_seen_at = now(),
        failure_count = 0,
        updated_at = now()
    returning id into v_id;

    return v_id;
end;
$$;

revoke all on function public.register_push_subscription(text,text,text,text,text) from public, anon;
grant execute on function public.register_push_subscription(text,text,text,text,text) to authenticated;

create or replace function public.deactivate_push_subscription(p_endpoint text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_uid uuid := auth.uid();
    v_count integer;
begin
    if v_uid is null then
        raise exception 'Authentication required';
    end if;

    update public.push_subscriptions
    set is_active = false,
        updated_at = now()
    where user_id = v_uid
      and endpoint = p_endpoint
      and is_active = true;

    get diagnostics v_count = row_count;
    return v_count > 0;
end;
$$;

revoke all on function public.deactivate_push_subscription(text) from public, anon;
grant execute on function public.deactivate_push_subscription(text) to authenticated;

create or replace function public.claim_notification_pushes(
    p_user_id uuid,
    p_limit integer default 10
)
returns setof public.notifications
language plpgsql
security definer
set search_path = public
as $$
begin
    return query
    with picked as (
        select n.id
        from public.notifications n
        where n.user_id = p_user_id
          and n.dismissed_at is null
          and n.push_sent_at is null
          and n.created_at >= now() - interval '24 hours'
          and (
              n.push_claimed_at is null
              or n.push_claimed_at < now() - interval '5 minutes'
          )
        order by n.created_at asc
        limit least(greatest(coalesce(p_limit, 10), 1), 50)
        for update skip locked
    )
    update public.notifications n
    set push_claimed_at = now(),
        push_attempts = coalesce(n.push_attempts, 0) + 1
    from picked
    where n.id = picked.id
    returning n.*;
end;
$$;

revoke all on function public.claim_notification_pushes(uuid,integer) from public, anon, authenticated;
grant execute on function public.claim_notification_pushes(uuid,integer) to service_role;

create or replace function public.enqueue_notification_push()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    v_secret text;
begin
    select secret into v_secret
    from public.report_scheduler_config
    where id = true;

    if coalesce(v_secret, '') <> '' then
        perform net.http_post(
            url := 'https://zuueyhjzlcmegpklpdcb.supabase.co/functions/v1/notification-dispatch',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'x-cron-secret', v_secret
            ),
            body := jsonb_build_object(
                'mode', 'push',
                'user_id', new.user_id
            )
        );
    end if;

    return new;
exception
    when others then
        -- Creating an in-app notification must never fail because push dispatch failed.
        raise warning 'Unable to enqueue push notification: %', sqlerrm;
        return new;
end;
$$;

drop trigger if exists notifications_enqueue_push on public.notifications;
create trigger notifications_enqueue_push
    after insert on public.notifications
    for each row
    execute function public.enqueue_notification_push();
