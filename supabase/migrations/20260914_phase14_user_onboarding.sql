-- Kira Phase 14A — First-time onboarding state
create table if not exists public.user_onboarding (
    user_id uuid primary key references auth.users(id) on delete cascade,
    status text not null default 'not_started'
        check (status in ('not_started','in_progress','completed','skipped')),
    current_step integer not null default 1
        check (current_step between 1 and 6),
    version integer not null default 1
        check (version >= 1),
    account_completed boolean not null default false,
    categories_completed boolean not null default false,
    income_source_completed boolean not null default false,
    budget_completed boolean not null default false,
    goal_completed boolean not null default false,
    first_account_id uuid null references public.accounts(id) on delete set null,
    checklist_dismissed_at timestamptz null,
    started_at timestamptz null,
    completed_at timestamptz null,
    skipped_at timestamptz null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists user_onboarding_status_idx
    on public.user_onboarding (status);

-- Reuse the existing timestamp helper when available.
do $$
begin
    if exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname = 'set_updated_at'
    ) then
        drop trigger if exists user_onboarding_set_updated_at
            on public.user_onboarding;

        create trigger user_onboarding_set_updated_at
            before update on public.user_onboarding
            for each row execute function public.set_updated_at();
    end if;
end $$;
alter table public.user_onboarding enable row level security;

revoke all on public.user_onboarding from anon;
grant select, insert, update, delete on public.user_onboarding to authenticated;

drop policy if exists user_onboarding_select_own on public.user_onboarding;
create policy user_onboarding_select_own
on public.user_onboarding
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists user_onboarding_insert_own on public.user_onboarding;
create policy user_onboarding_insert_own
on public.user_onboarding
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists user_onboarding_update_own on public.user_onboarding;
create policy user_onboarding_update_own
on public.user_onboarding
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists user_onboarding_delete_own on public.user_onboarding;
create policy user_onboarding_delete_own
on public.user_onboarding
for delete to authenticated
using ((select auth.uid()) = user_id);
