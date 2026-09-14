-- Kira Phase 13 — Notifications & Proactive Alerts
-- Safe to run once on the Kira Supabase project.

create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.notification_preferences (
    user_id uuid primary key references auth.users(id) on delete cascade,
    recurring_enabled boolean not null default true,
    budget_enabled boolean not null default true,
    goal_enabled boolean not null default true,
    cashflow_enabled boolean not null default true,
    push_enabled boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    kind text not null check (kind in ('recurring','budget','goal','cashflow','system')),
    severity text not null default 'info' check (severity in ('info','warning','critical','success')),
    title text not null,
    message text not null,
    target_page text,
    target_hash text,
    dedupe_key text not null,
    read_at timestamptz,
    dismissed_at timestamptz,
    push_sent_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz not null default now(),
    unique (user_id, dedupe_key)
);

create table if not exists public.push_subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    endpoint text not null,
    p256dh text not null,
    auth text not null,
    user_agent text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (user_id, endpoint)
);

create index if not exists notifications_user_created_idx
    on public.notifications (user_id, created_at desc);

create index if not exists notifications_unread_idx
    on public.notifications (user_id, read_at, dismissed_at);

create index if not exists notifications_push_idx
    on public.notifications (user_id, push_sent_at)
    where dismissed_at is null;

create index if not exists push_subscriptions_user_active_idx
    on public.push_subscriptions (user_id, is_active);

-- Reuse the existing timestamp helper if it exists in the Kira database.
do $$
begin
    if exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname = 'set_updated_at'
    ) then
        drop trigger if exists notification_preferences_set_updated_at on public.notification_preferences;
        create trigger notification_preferences_set_updated_at
            before update on public.notification_preferences
            for each row execute function public.set_updated_at();

        drop trigger if exists push_subscriptions_set_updated_at on public.push_subscriptions;
        create trigger push_subscriptions_set_updated_at
            before update on public.push_subscriptions
            for each row execute function public.set_updated_at();
    end if;
end $$;

alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;

-- Explicit grants: anon remains blocked, authenticated users get table access but RLS keeps rows private.
revoke all on public.notification_preferences from anon;
revoke all on public.notifications from anon;
revoke all on public.push_subscriptions from anon;

grant select, insert, update, delete on public.notification_preferences to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.push_subscriptions to authenticated;

drop policy if exists notification_preferences_select_own on public.notification_preferences;
create policy notification_preferences_select_own
    on public.notification_preferences for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists notification_preferences_insert_own on public.notification_preferences;
create policy notification_preferences_insert_own
    on public.notification_preferences for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists notification_preferences_update_own on public.notification_preferences;
create policy notification_preferences_update_own
    on public.notification_preferences for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists notification_preferences_delete_own on public.notification_preferences;
create policy notification_preferences_delete_own
    on public.notification_preferences for delete to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists notifications_select_own on public.notifications;
create policy notifications_select_own
    on public.notifications for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists notifications_insert_own on public.notifications;
create policy notifications_insert_own
    on public.notifications for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own
    on public.notifications for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists notifications_delete_own on public.notifications;
create policy notifications_delete_own
    on public.notifications for delete to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists push_subscriptions_select_own on public.push_subscriptions;
create policy push_subscriptions_select_own
    on public.push_subscriptions for select to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists push_subscriptions_insert_own on public.push_subscriptions;
create policy push_subscriptions_insert_own
    on public.push_subscriptions for insert to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists push_subscriptions_update_own on public.push_subscriptions;
create policy push_subscriptions_update_own
    on public.push_subscriptions for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists push_subscriptions_delete_own on public.push_subscriptions;
create policy push_subscriptions_delete_own
    on public.push_subscriptions for delete to authenticated
    using ((select auth.uid()) = user_id);

-- Clean old dismissed/read notifications so this table stays small.
-- Keeps unread notifications and the last 90 days of history.
select cron.unschedule(jobid)
from cron.job
where jobname = 'kira-notification-cleanup';

select cron.schedule(
    'kira-notification-cleanup',
    '17 3 * * *',
    $$
    delete from public.notifications
    where created_at < now() - interval '90 days'
      and (read_at is not null or dismissed_at is not null);
    $$
);

-- Server-side alert generation + push dispatch every 15 minutes.
-- Reuses the secret already stored in report_scheduler_config, so no secret is embedded in this migration.
select cron.unschedule(jobid)
from cron.job
where jobname = 'kira-notification-dispatch';

select cron.schedule(
    'kira-notification-dispatch',
    '*/15 * * * *',
    $$
    select net.http_post(
        url := 'https://zuueyhjzlcmegpklpdcb.supabase.co/functions/v1/notification-dispatch',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-cron-secret', (
                select secret
                from public.report_scheduler_config
                where id = true
            )
        ),
        body := '{"mode":"cron"}'::jsonb
    );
    $$
);
