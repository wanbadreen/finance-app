-- Draft schema for Feature 3: Credit Card Management
-- Convert this draft into a timestamped Supabase migration after local build/tests pass.

alter table public.accounts
    drop constraint if exists accounts_account_type_check;

alter table public.accounts
    add constraint accounts_account_type_check
    check (
        account_type in (
            'bank',
            'cash',
            'e_wallet',
            'savings',
            'credit_card',
            'other'
        )
    );

create table if not exists public.credit_cards (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    account_id uuid not null,
    payment_method_id uuid not null,
    settlement_account_id uuid,
    card_name text not null check (char_length(trim(card_name)) > 0),
    issuer text,
    last_four text check (
        last_four is null or last_four ~ '^[0-9]{4}$'
    ),
    credit_limit numeric not null default 0
        check (credit_limit >= 0),
    purchase_apr numeric not null default 0
        check (purchase_apr >= 0 and purchase_apr <= 100),
    cash_advance_apr numeric not null default 0
        check (cash_advance_apr >= 0 and cash_advance_apr <= 100),
    minimum_payment_percent numeric not null default 5
        check (
            minimum_payment_percent >= 0
            and minimum_payment_percent <= 100
        ),
    minimum_payment_floor numeric not null default 50
        check (minimum_payment_floor >= 0),
    late_fee_percent numeric not null default 1
        check (late_fee_percent >= 0 and late_fee_percent <= 100),
    late_fee_min numeric not null default 10
        check (late_fee_min >= 0),
    late_fee_max numeric not null default 100
        check (
            late_fee_max >= 0
            and late_fee_max >= late_fee_min
        ),
    interest_free_days smallint not null default 20
        check (interest_free_days between 0 and 90),
    statement_day smallint
        check (statement_day is null or statement_day between 1 and 31),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint credit_cards_id_user_unique
        unique (id, user_id),

    constraint credit_cards_account_unique
        unique (account_id),

    constraint credit_cards_payment_method_unique
        unique (payment_method_id),

    constraint credit_cards_account_owner_fk
        foreign key (account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict,

    constraint credit_cards_payment_method_owner_fk
        foreign key (payment_method_id, user_id)
        references public.payment_methods(id, user_id)
        on delete restrict,

    constraint credit_cards_settlement_account_owner_fk
        foreign key (settlement_account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict,

    constraint credit_cards_settlement_not_card
        check (
            settlement_account_id is null
            or settlement_account_id <> account_id
        )
);

create table if not exists public.credit_card_statements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    credit_card_id uuid not null,
    statement_date date not null,
    due_date date not null,
    statement_balance numeric not null
        check (statement_balance >= 0),
    amount_due numeric
        check (amount_due is null or amount_due >= 0),
    minimum_payment numeric not null default 0
        check (minimum_payment >= 0),
    finance_charge numeric not null default 0
        check (finance_charge >= 0),
    instalment_due numeric not null default 0
        check (instalment_due >= 0),
    past_due_amount numeric not null default 0
        check (past_due_amount >= 0),
    over_limit_amount numeric not null default 0
        check (over_limit_amount >= 0),
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint credit_card_statements_card_date_unique
        unique (credit_card_id, statement_date),

    constraint credit_card_statements_card_owner_fk
        foreign key (credit_card_id, user_id)
        references public.credit_cards(id, user_id)
        on delete cascade
);

create table if not exists public.credit_card_reconciliations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    credit_card_id uuid not null,
    as_of_date date not null,
    bank_outstanding numeric not null
        check (bank_outstanding >= 0),
    notes text,
    created_at timestamptz not null default now(),

    constraint credit_card_reconciliations_card_owner_fk
        foreign key (credit_card_id, user_id)
        references public.credit_cards(id, user_id)
        on delete cascade
);

create index if not exists credit_cards_account_owner_fk_idx
    on public.credit_cards (account_id, user_id);

create index if not exists credit_cards_payment_method_owner_fk_idx
    on public.credit_cards (payment_method_id, user_id);

create index if not exists credit_cards_settlement_account_owner_fk_idx
    on public.credit_cards (settlement_account_id, user_id)
    where settlement_account_id is not null;

create index if not exists credit_card_statements_card_owner_fk_idx
    on public.credit_card_statements (credit_card_id, user_id);

create index if not exists credit_card_statements_user_date_idx
    on public.credit_card_statements (user_id, statement_date desc);

create index if not exists credit_card_reconciliations_card_owner_fk_idx
    on public.credit_card_reconciliations (credit_card_id, user_id);

create index if not exists credit_card_reconciliations_user_date_idx
    on public.credit_card_reconciliations (user_id, as_of_date desc);

do $$
begin
    if exists (
        select 1
        from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public'
          and p.proname = 'set_updated_at'
    ) then
        drop trigger if exists credit_cards_set_updated_at
            on public.credit_cards;

        create trigger credit_cards_set_updated_at
            before update on public.credit_cards
            for each row execute function public.set_updated_at();

        drop trigger if exists credit_card_statements_set_updated_at
            on public.credit_card_statements;

        create trigger credit_card_statements_set_updated_at
            before update on public.credit_card_statements
            for each row execute function public.set_updated_at();
    end if;
end $$;

alter table public.credit_cards enable row level security;
alter table public.credit_card_statements enable row level security;
alter table public.credit_card_reconciliations enable row level security;

revoke all on public.credit_cards from anon;
revoke all on public.credit_card_statements from anon;
revoke all on public.credit_card_reconciliations from anon;

grant select, insert, update, delete
    on public.credit_cards to authenticated;

grant select, insert, update, delete
    on public.credit_card_statements to authenticated;

grant select, insert, update, delete
    on public.credit_card_reconciliations to authenticated;

grant select, insert, update, delete
    on public.credit_cards to service_role;

grant select, insert, update, delete
    on public.credit_card_statements to service_role;

grant select, insert, update, delete
    on public.credit_card_reconciliations to service_role;

drop policy if exists credit_cards_select_own
    on public.credit_cards;
create policy credit_cards_select_own
on public.credit_cards
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists credit_cards_insert_own
    on public.credit_cards;
create policy credit_cards_insert_own
on public.credit_cards
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists credit_cards_update_own
    on public.credit_cards;
create policy credit_cards_update_own
on public.credit_cards
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists credit_cards_delete_own
    on public.credit_cards;
create policy credit_cards_delete_own
on public.credit_cards
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists credit_card_statements_select_own
    on public.credit_card_statements;
create policy credit_card_statements_select_own
on public.credit_card_statements
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists credit_card_statements_insert_own
    on public.credit_card_statements;
create policy credit_card_statements_insert_own
on public.credit_card_statements
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists credit_card_statements_update_own
    on public.credit_card_statements;
create policy credit_card_statements_update_own
on public.credit_card_statements
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists credit_card_statements_delete_own
    on public.credit_card_statements;
create policy credit_card_statements_delete_own
on public.credit_card_statements
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists credit_card_reconciliations_select_own
    on public.credit_card_reconciliations;
create policy credit_card_reconciliations_select_own
on public.credit_card_reconciliations
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists credit_card_reconciliations_insert_own
    on public.credit_card_reconciliations;
create policy credit_card_reconciliations_insert_own
on public.credit_card_reconciliations
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists credit_card_reconciliations_update_own
    on public.credit_card_reconciliations;
create policy credit_card_reconciliations_update_own
on public.credit_card_reconciliations
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists credit_card_reconciliations_delete_own
    on public.credit_card_reconciliations;
create policy credit_card_reconciliations_delete_own
on public.credit_card_reconciliations
for delete to authenticated
using ((select auth.uid()) = user_id);
