-- Kira — Payment Methods
-- Additive migration. Existing transactions and recurring items remain valid with NULL payment_method_id.

create table if not exists public.payment_methods (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null check (char_length(trim(name)) > 0),
    method_type text not null
        check (method_type in (
            'cash',
            'debit_card',
            'credit_card',
            'bank_transfer',
            'e_wallet',
            'online_banking',
            'other'
        )),
    system_key text,
    is_active boolean not null default true,
    sort_order smallint not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint payment_methods_id_user_unique
        unique (id, user_id),

    constraint payment_methods_user_system_key_unique
        unique (user_id, system_key)
);

create index if not exists payment_methods_user_active_sort_idx
    on public.payment_methods (user_id, is_active, sort_order, name);

do $$
begin
    if exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname = 'set_updated_at'
    ) then
        drop trigger if exists payment_methods_set_updated_at
            on public.payment_methods;

        create trigger payment_methods_set_updated_at
            before update on public.payment_methods
            for each row execute function public.set_updated_at();
    end if;
end $$;

alter table public.payment_methods enable row level security;

revoke all on public.payment_methods from anon;
grant select, insert, update, delete on public.payment_methods to authenticated;
grant select, insert, update, delete on public.payment_methods to service_role;

drop policy if exists payment_methods_select_own on public.payment_methods;
create policy payment_methods_select_own
on public.payment_methods
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists payment_methods_insert_own on public.payment_methods;
create policy payment_methods_insert_own
on public.payment_methods
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists payment_methods_update_own on public.payment_methods;
create policy payment_methods_update_own
on public.payment_methods
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists payment_methods_delete_own on public.payment_methods;
create policy payment_methods_delete_own
on public.payment_methods
for delete to authenticated
using ((select auth.uid()) = user_id);

alter table public.transactions
    add column if not exists payment_method_id uuid;

alter table public.recurring_transactions
    add column if not exists payment_method_id uuid;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'transaction_payment_method_owner_fk'
    ) then
        alter table public.transactions
            add constraint transaction_payment_method_owner_fk
            foreign key (payment_method_id, user_id)
            references public.payment_methods(id, user_id)
            on delete restrict;
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'recurring_payment_method_owner_fk'
    ) then
        alter table public.recurring_transactions
            add constraint recurring_payment_method_owner_fk
            foreign key (payment_method_id, user_id)
            references public.payment_methods(id, user_id)
            on delete restrict;
    end if;
end $$;

create index if not exists transactions_payment_method_idx
    on public.transactions (user_id, payment_method_id)
    where payment_method_id is not null and deleted_at is null;

create index if not exists recurring_payment_method_idx
    on public.recurring_transactions (user_id, payment_method_id)
    where payment_method_id is not null;

insert into public.payment_methods (
    user_id,
    name,
    method_type,
    system_key,
    sort_order
)
select
    users.id,
    defaults.name,
    defaults.method_type,
    defaults.system_key,
    defaults.sort_order
from auth.users as users
cross join (
    values
        ('Cash', 'cash', 'cash', 10),
        ('Debit Card', 'debit_card', 'debit_card', 20),
        ('Credit Card', 'credit_card', 'credit_card', 30),
        ('Bank Transfer', 'bank_transfer', 'bank_transfer', 40),
        ('E-Wallet', 'e_wallet', 'e_wallet', 50),
        ('Online Banking', 'online_banking', 'online_banking', 60),
        ('Other', 'other', 'other', 70)
) as defaults(name, method_type, system_key, sort_order)
on conflict (user_id, system_key) do nothing;
