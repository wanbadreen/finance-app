-- Dedicated Savings movements: reserve cash without spending it, or move it to a Savings account.
-- Savings movements are immutable from the client; writes go through record_savings_movement()
-- so goal progress and account transfers stay consistent.

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conrelid = 'public.savings_goals'::regclass
          and conname = 'savings_goals_id_user_id_key'
    ) then
        alter table public.savings_goals
            add constraint savings_goals_id_user_id_key
            unique (id, user_id);
    end if;
end;
$$;

create table if not exists public.savings_movements (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    goal_id uuid not null,
    direction text not null check (direction in ('add', 'withdraw')),
    method text not null check (method in ('reserve', 'transfer')),
    amount numeric not null check (amount > 0 and amount = round(amount, 2)),
    account_id uuid null,
    from_account_id uuid null,
    to_account_id uuid null,
    account_transfer_id uuid null unique references public.account_transfers(id) on delete restrict,
    movement_date date not null default current_date,
    notes text null,
    created_at timestamptz not null default now(),
    constraint savings_movements_goal_owner_fk
        foreign key (goal_id, user_id)
        references public.savings_goals(id, user_id)
        on delete restrict,
    constraint savings_movements_account_owner_fk
        foreign key (account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict,
    constraint savings_movements_from_account_owner_fk
        foreign key (from_account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict,
    constraint savings_movements_to_account_owner_fk
        foreign key (to_account_id, user_id)
        references public.accounts(id, user_id)
        on delete restrict,
    constraint savings_movements_shape_check check (
        (
            method = 'reserve'
            and account_id is not null
            and from_account_id is null
            and to_account_id is null
            and account_transfer_id is null
        )
        or
        (
            method = 'transfer'
            and account_id is null
            and from_account_id is not null
            and to_account_id is not null
            and account_transfer_id is not null
        )
    )
);

create index if not exists savings_movements_user_date_idx
    on public.savings_movements(user_id, movement_date desc, created_at desc);

create index if not exists savings_movements_goal_idx
    on public.savings_movements(goal_id, movement_date desc, created_at desc);

create index if not exists savings_movements_reserve_account_idx
    on public.savings_movements(user_id, account_id)
    where method = 'reserve';

create index if not exists savings_movements_transfer_accounts_idx
    on public.savings_movements(user_id, from_account_id, to_account_id)
    where method = 'transfer';

-- Preserve existing manually entered goal balances as reserved money when the
-- old goal already pointed at a spendable account. This keeps the migration
-- backward compatible without creating a fake expense or bank transfer.
insert into public.savings_movements (
    user_id,
    goal_id,
    direction,
    method,
    amount,
    account_id,
    movement_date,
    notes
)
select
    g.user_id,
    g.id,
    'add',
    'reserve',
    round(g.current_amount, 2),
    g.account_id,
    coalesce(g.created_at::date, current_date),
    'Opening savings balance migrated from the previous Savings Goal.'
from public.savings_goals g
join public.accounts a
  on a.id = g.account_id
 and a.user_id = g.user_id
where g.current_amount > 0
  and a.account_type not in ('savings', 'credit_card')
  and not exists (
      select 1
      from public.savings_movements sm
      where sm.goal_id = g.id
  );

alter table public.savings_movements enable row level security;

drop policy if exists savings_movements_select_own on public.savings_movements;
create policy savings_movements_select_own
    on public.savings_movements
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

revoke insert, update, delete on public.savings_movements from anon, authenticated;
grant select on public.savings_movements to authenticated;

create or replace function public.record_savings_movement(
    p_goal_id uuid,
    p_direction text,
    p_method text,
    p_amount numeric,
    p_account_id uuid default null,
    p_from_account_id uuid default null,
    p_to_account_id uuid default null,
    p_movement_date date default current_date,
    p_notes text default null
)
returns public.savings_movements
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
    v_user_id uuid := auth.uid();
    v_goal public.savings_goals%rowtype;
    v_account public.accounts%rowtype;
    v_from public.accounts%rowtype;
    v_to public.accounts%rowtype;
    v_amount numeric;
    v_new_current numeric;
    v_reserved_balance numeric := 0;
    v_tracked_transfer_balance numeric := 0;
    v_source_balance numeric := 0;
    v_source_reserved numeric := 0;
    v_source_available numeric := 0;
    v_transfer_id uuid := null;
    v_movement public.savings_movements%rowtype;
begin
    if v_user_id is null then
        raise exception 'Authentication required.' using errcode = '42501';
    end if;

    if p_direction not in ('add', 'withdraw') then
        raise exception 'Savings direction must be add or withdraw.' using errcode = '22023';
    end if;

    if p_method not in ('reserve', 'transfer') then
        raise exception 'Savings method must be reserve or transfer.' using errcode = '22023';
    end if;

    v_amount := round(coalesce(p_amount, 0), 2);

    if v_amount <= 0 or p_amount <> v_amount then
        raise exception 'Savings amount must be greater than zero with no more than two decimal places.' using errcode = '22023';
    end if;

    if p_movement_date is null then
        raise exception 'Choose a savings date.' using errcode = '22023';
    end if;

    select *
      into v_goal
      from public.savings_goals
     where id = p_goal_id
       and user_id = v_user_id
     for update;

    if not found then
        raise exception 'Savings goal not found.' using errcode = 'P0002';
    end if;

    if p_direction = 'add' then
        if v_amount > greatest(0, v_goal.target_amount - v_goal.current_amount) then
            raise exception 'This amount is higher than the remaining savings target.' using errcode = '22023';
        end if;
        v_new_current := v_goal.current_amount + v_amount;
    else
        if v_amount > v_goal.current_amount then
            raise exception 'You cannot withdraw more than the amount currently saved in this goal.' using errcode = '22023';
        end if;
        v_new_current := v_goal.current_amount - v_amount;
    end if;

    if p_method = 'reserve' then
        if p_account_id is null or p_from_account_id is not null or p_to_account_id is not null then
            raise exception 'Choose one account for reserved savings.' using errcode = '22023';
        end if;

        select *
          into v_account
          from public.accounts
         where id = p_account_id
           and user_id = v_user_id
           and is_active = true;

        if not found then
            raise exception 'The selected account is not available.' using errcode = 'P0002';
        end if;

        if v_account.account_type in ('savings', 'credit_card') then
            raise exception 'Reserved savings must stay in a spendable cash, bank or e-wallet account.' using errcode = '22023';
        end if;

        if p_direction = 'withdraw' then
            select coalesce(sum(case when direction = 'add' then amount else -amount end), 0)
              into v_reserved_balance
              from public.savings_movements
             where user_id = v_user_id
               and goal_id = p_goal_id
               and method = 'reserve'
               and account_id = p_account_id;

            if v_amount > v_reserved_balance then
                raise exception 'There is not enough tracked reserved savings in this account to release that amount.' using errcode = '22023';
            end if;
        else
            select
                v_account.opening_balance
                + coalesce((
                    select sum(
                        case
                            when t.type = 'income' then coalesce(t.cash_amount, t.amount)
                            else -coalesce(t.cash_amount, t.amount)
                        end
                    )
                    from public.transactions t
                    where t.user_id = v_user_id
                      and t.account_id = v_account.id
                      and t.deleted_at is null
                ), 0)
                + coalesce((
                    select sum(
                        case
                            when tr.to_account_id = v_account.id then tr.amount
                            when tr.from_account_id = v_account.id then -tr.amount
                            else 0
                        end
                    )
                    from public.account_transfers tr
                    where tr.user_id = v_user_id
                      and tr.deleted_at is null
                      and (tr.to_account_id = v_account.id or tr.from_account_id = v_account.id)
                ), 0)
              into v_source_balance;

            select coalesce(sum(case when direction = 'add' then amount else -amount end), 0)
              into v_source_reserved
              from public.savings_movements
             where user_id = v_user_id
               and method = 'reserve'
               and account_id = v_account.id;

            v_source_available := v_source_balance - v_source_reserved;

            if v_amount > v_source_available then
                raise exception 'This account does not have enough available cash after existing reserved savings.' using errcode = '22023';
            end if;
        end if;
    else
        if p_account_id is not null or p_from_account_id is null or p_to_account_id is null then
            raise exception 'Choose both the source and destination accounts for a savings transfer.' using errcode = '22023';
        end if;

        if p_from_account_id = p_to_account_id then
            raise exception 'Source and destination accounts must be different.' using errcode = '22023';
        end if;

        select *
          into v_from
          from public.accounts
         where id = p_from_account_id
           and user_id = v_user_id
           and is_active = true;

        if not found then
            raise exception 'The source account is not available.' using errcode = 'P0002';
        end if;

        select *
          into v_to
          from public.accounts
         where id = p_to_account_id
           and user_id = v_user_id
           and is_active = true;

        if not found then
            raise exception 'The destination account is not available.' using errcode = 'P0002';
        end if;

        if p_direction = 'add' then
            if v_from.account_type in ('savings', 'credit_card') then
                raise exception 'Choose a spendable account as the source.' using errcode = '22023';
            end if;

            if v_to.account_type <> 'savings' then
                raise exception 'Savings transfers must go to an account with type Savings.' using errcode = '22023';
            end if;

            select
                v_from.opening_balance
                + coalesce((
                    select sum(
                        case
                            when t.type = 'income' then coalesce(t.cash_amount, t.amount)
                            else -coalesce(t.cash_amount, t.amount)
                        end
                    )
                    from public.transactions t
                    where t.user_id = v_user_id
                      and t.account_id = v_from.id
                      and t.deleted_at is null
                ), 0)
                + coalesce((
                    select sum(
                        case
                            when tr.to_account_id = v_from.id then tr.amount
                            when tr.from_account_id = v_from.id then -tr.amount
                            else 0
                        end
                    )
                    from public.account_transfers tr
                    where tr.user_id = v_user_id
                      and tr.deleted_at is null
                      and (tr.to_account_id = v_from.id or tr.from_account_id = v_from.id)
                ), 0)
              into v_source_balance;

            select coalesce(sum(case when direction = 'add' then amount else -amount end), 0)
              into v_source_reserved
              from public.savings_movements
             where user_id = v_user_id
               and method = 'reserve'
               and account_id = v_from.id;

            v_source_available := v_source_balance - v_source_reserved;

            if v_amount > v_source_available then
                raise exception 'The source account does not have enough available cash.' using errcode = '22023';
            end if;
        else
            if v_from.account_type <> 'savings' then
                raise exception 'Choose a Savings account to withdraw from.' using errcode = '22023';
            end if;

            if v_to.account_type in ('savings', 'credit_card') then
                raise exception 'Choose a spendable account to receive the withdrawal.' using errcode = '22023';
            end if;

            select coalesce(sum(
                case
                    when direction = 'add' and to_account_id = p_from_account_id then amount
                    when direction = 'withdraw' and from_account_id = p_from_account_id then -amount
                    else 0
                end
            ), 0)
              into v_tracked_transfer_balance
              from public.savings_movements
             where user_id = v_user_id
               and goal_id = p_goal_id
               and method = 'transfer';

            if v_amount > v_tracked_transfer_balance then
                raise exception 'There is not enough tracked savings for this goal in that Savings account.' using errcode = '22023';
            end if;

            select
                v_from.opening_balance
                + coalesce((
                    select sum(
                        case
                            when t.type = 'income' then coalesce(t.cash_amount, t.amount)
                            else -coalesce(t.cash_amount, t.amount)
                        end
                    )
                    from public.transactions t
                    where t.user_id = v_user_id
                      and t.account_id = v_from.id
                      and t.deleted_at is null
                ), 0)
                + coalesce((
                    select sum(
                        case
                            when tr.to_account_id = v_from.id then tr.amount
                            when tr.from_account_id = v_from.id then -tr.amount
                            else 0
                        end
                    )
                    from public.account_transfers tr
                    where tr.user_id = v_user_id
                      and tr.deleted_at is null
                      and (tr.to_account_id = v_from.id or tr.from_account_id = v_from.id)
                ), 0)
              into v_source_balance;

            if v_amount > v_source_balance then
                raise exception 'The Savings account balance is lower than this withdrawal.' using errcode = '22023';
            end if;
        end if;

        insert into public.account_transfers (
            user_id,
            from_account_id,
            to_account_id,
            amount,
            transfer_date,
            description,
            notes,
            fee_percent
        )
        values (
            v_user_id,
            p_from_account_id,
            p_to_account_id,
            v_amount,
            p_movement_date,
            case
                when p_direction = 'add' then 'Savings — ' || v_goal.name
                else 'Savings withdrawal — ' || v_goal.name
            end,
            nullif(trim(coalesce(p_notes, '')), ''),
            0
        )
        returning id into v_transfer_id;
    end if;

    insert into public.savings_movements (
        user_id,
        goal_id,
        direction,
        method,
        amount,
        account_id,
        from_account_id,
        to_account_id,
        account_transfer_id,
        movement_date,
        notes
    )
    values (
        v_user_id,
        p_goal_id,
        p_direction,
        p_method,
        v_amount,
        case when p_method = 'reserve' then p_account_id else null end,
        case when p_method = 'transfer' then p_from_account_id else null end,
        case when p_method = 'transfer' then p_to_account_id else null end,
        v_transfer_id,
        p_movement_date,
        nullif(trim(coalesce(p_notes, '')), '')
    )
    returning * into v_movement;

    update public.savings_goals
       set current_amount = v_new_current,
           status = case
               when v_new_current >= target_amount then 'completed'
               when status = 'paused' then 'paused'
               else 'active'
           end,
           updated_at = now()
     where id = p_goal_id
       and user_id = v_user_id;

    return v_movement;
end;
$$;

revoke all on function public.record_savings_movement(
    uuid, text, text, numeric, uuid, uuid, uuid, date, text
) from public, anon;
grant execute on function public.record_savings_movement(
    uuid, text, text, numeric, uuid, uuid, uuid, date, text
) to authenticated;

create or replace function public.prevent_savings_transfer_mutation()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
    if exists (
        select 1
        from public.savings_movements sm
        where sm.account_transfer_id = old.id
    ) then
        raise exception 'Savings-linked transfers are managed from Savings and cannot be edited or deleted directly.'
            using errcode = '55000';
    end if;

    if tg_op = 'DELETE' then
        return old;
    end if;

    return new;
end;
$$;

drop trigger if exists protect_savings_linked_transfers on public.account_transfers;
create trigger protect_savings_linked_transfers
before update or delete on public.account_transfers
for each row
execute function public.prevent_savings_transfer_mutation();
