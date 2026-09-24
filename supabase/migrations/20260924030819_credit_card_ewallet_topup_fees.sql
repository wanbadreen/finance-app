alter table public.account_transfers
    add column if not exists fee_percent numeric(7,4) not null default 0;

alter table public.account_transfers
    drop constraint if exists account_transfers_fee_percent_check;

alter table public.account_transfers
    add constraint account_transfers_fee_percent_check
    check (fee_percent >= 0 and fee_percent <= 100);

alter table public.transactions
    add column if not exists linked_transfer_id uuid;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'account_transfers_id_user_unique'
          and conrelid = 'public.account_transfers'::regclass
    ) then
        alter table public.account_transfers
            add constraint account_transfers_id_user_unique
            unique (id, user_id);
    end if;
end $$;

alter table public.transactions
    drop constraint if exists transaction_linked_transfer_owner_fk;

alter table public.transactions
    add constraint transaction_linked_transfer_owner_fk
    foreign key (linked_transfer_id, user_id)
    references public.account_transfers(id, user_id)
    on delete cascade;

create unique index if not exists transactions_linked_transfer_unique_idx
    on public.transactions (linked_transfer_id)
    where linked_transfer_id is not null;

create index if not exists transactions_linked_transfer_owner_idx
    on public.transactions (linked_transfer_id, user_id)
    where linked_transfer_id is not null;

create or replace function public.sync_account_transfer_fee_transaction()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
    source_type text;
    destination_type text;
    fee_amount numeric(14,2);
    fee_category_id uuid;
    card_payment_method_id uuid;
    existing_fee_id uuid;
begin
    select account_type
      into source_type
      from public.accounts
     where id = new.from_account_id
       and user_id = new.user_id;

    select account_type
      into destination_type
      from public.accounts
     where id = new.to_account_id
       and user_id = new.user_id;

    fee_amount :=
        round(
            (
                new.amount
                * coalesce(new.fee_percent, 0)
                / 100
            )::numeric,
            2
        );

    select id
      into existing_fee_id
      from public.transactions
     where linked_transfer_id = new.id
       and user_id = new.user_id
     limit 1;

    if new.deleted_at is not null then
        if existing_fee_id is not null then
            update public.transactions
               set deleted_at = new.deleted_at,
                   updated_at = now()
             where id = existing_fee_id
               and user_id = new.user_id;
        end if;

        return new;
    end if;

    if source_type = 'credit_card'
       and destination_type = 'e_wallet'
       and fee_amount > 0 then

        select id
          into fee_category_id
          from public.categories
         where user_id = new.user_id
           and lower(trim(name)) in (
               'fees & charges',
               'fees and charges'
           )
           and type in ('expense', 'both')
         order by
             case when type = 'expense' then 0 else 1 end,
             created_at
         limit 1;

        if fee_category_id is null then
            begin
                insert into public.categories (
                    user_id,
                    name,
                    type,
                    is_active
                )
                values (
                    new.user_id,
                    'Fees & Charges',
                    'expense',
                    true
                )
                returning id into fee_category_id;
            exception
                when unique_violation then
                    select id
                      into fee_category_id
                      from public.categories
                     where user_id = new.user_id
                       and name = 'Fees & Charges'
                       and type = 'expense'
                     limit 1;
            end;
        else
            update public.categories
               set is_active = true,
                   updated_at = now()
             where id = fee_category_id
               and user_id = new.user_id
               and is_active = false;
        end if;

        select payment_method_id
          into card_payment_method_id
          from public.credit_cards
         where user_id = new.user_id
           and account_id = new.from_account_id
         limit 1;

        if existing_fee_id is null then
            insert into public.transactions (
                user_id,
                account_id,
                payment_method_id,
                category_id,
                income_source_id,
                description,
                notes,
                amount,
                type,
                transaction_date,
                receipt_path,
                deleted_at,
                recurring_id,
                recurring_due_date,
                recurring_next_due_date,
                linked_transfer_id
            )
            values (
                new.user_id,
                new.from_account_id,
                card_payment_method_id,
                fee_category_id,
                null,
                trim(new.description) || ' fee',
                'Automatically recorded from a credit card to e-wallet top-up transfer.',
                fee_amount,
                'expense',
                new.transfer_date,
                null,
                null,
                null,
                null,
                null,
                new.id
            );
        else
            update public.transactions
               set account_id = new.from_account_id,
                   payment_method_id = card_payment_method_id,
                   category_id = fee_category_id,
                   income_source_id = null,
                   description = trim(new.description) || ' fee',
                   notes = 'Automatically recorded from a credit card to e-wallet top-up transfer.',
                   amount = fee_amount,
                   type = 'expense',
                   transaction_date = new.transfer_date,
                   receipt_path = null,
                   deleted_at = null,
                   recurring_id = null,
                   recurring_due_date = null,
                   recurring_next_due_date = null,
                   updated_at = now()
             where id = existing_fee_id
               and user_id = new.user_id;
        end if;
    else
        if existing_fee_id is not null then
            delete from public.transactions
             where id = existing_fee_id
               and user_id = new.user_id;
        end if;
    end if;

    return new;
end;
$$;

drop trigger if exists account_transfers_sync_fee_transaction
    on public.account_transfers;

create trigger account_transfers_sync_fee_transaction
after insert or update of
    from_account_id,
    to_account_id,
    amount,
    transfer_date,
    description,
    fee_percent,
    deleted_at
on public.account_transfers
for each row
execute function public.sync_account_transfer_fee_transaction();

-- No new public tables are introduced. Existing authenticated grants
-- and user-scoped RLS policies on account_transfers, transactions and
-- categories continue to apply; no anon CRUD grant is added.
