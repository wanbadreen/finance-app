-- Kira — Account-to-account transfers
-- Additive migration: existing transactions and accounts are not rewritten.

create table if not exists public.account_transfers (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    from_account_id uuid not null,
    to_account_id uuid not null,
    amount numeric not null check (amount > 0),
    transfer_date date not null,
    description text not null check (char_length(trim(description)) > 0),
    notes text,
    deleted_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint account_transfers_accounts_different
        check (from_account_id <> to_account_id),

    constraint account_transfers_from_account_owner_fk
        foreign key (from_account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict,

    constraint account_transfers_to_account_owner_fk
        foreign key (to_account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict
);

create index if not exists account_transfers_user_date_idx
    on public.account_transfers (user_id, transfer_date desc, created_at desc);

create index if not exists account_transfers_from_account_idx
    on public.account_transfers (user_id, from_account_id)
    where deleted_at is null;

create index if not exists account_transfers_to_account_idx
    on public.account_transfers (user_id, to_account_id)
    where deleted_at is null;

do $$
begin
    if exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname = 'set_updated_at'
    ) then
        drop trigger if exists account_transfers_set_updated_at
            on public.account_transfers;

        create trigger account_transfers_set_updated_at
            before update on public.account_transfers
            for each row
            execute function public.set_updated_at();
    end if;
end $$;

alter table public.account_transfers
    enable row level security;

revoke all
    on public.account_transfers
    from anon;

grant select, insert, update, delete
    on public.account_transfers
    to authenticated;

drop policy if exists account_transfers_select_own
    on public.account_transfers;

create policy account_transfers_select_own
    on public.account_transfers
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

drop policy if exists account_transfers_insert_own
    on public.account_transfers;

create policy account_transfers_insert_own
    on public.account_transfers
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

drop policy if exists account_transfers_update_own
    on public.account_transfers;

create policy account_transfers_update_own
    on public.account_transfers
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

drop policy if exists account_transfers_delete_own
    on public.account_transfers;

create policy account_transfers_delete_own
    on public.account_transfers
    for delete
    to authenticated
    using ((select auth.uid()) = user_id);
