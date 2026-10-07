alter table public.recurring_transactions
  add column if not exists schedule_mode text not null default 'ongoing';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'recurring_transactions_schedule_mode_check'
      and conrelid = 'public.recurring_transactions'::regclass
  ) then
    alter table public.recurring_transactions
      add constraint recurring_transactions_schedule_mode_check
      check (schedule_mode in ('ongoing','finite'));
  end if;
end
$$;

alter table public.recurring_occurrence_statuses
  add column if not exists amount numeric null,
  add column if not exists sequence_number integer null,
  add column if not exists sequence_total integer null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'recurring_occurrence_statuses_amount_check'
      and conrelid = 'public.recurring_occurrence_statuses'::regclass
  ) then
    alter table public.recurring_occurrence_statuses
      add constraint recurring_occurrence_statuses_amount_check
      check (amount is null or amount > 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'recurring_occurrence_statuses_sequence_number_check'
      and conrelid = 'public.recurring_occurrence_statuses'::regclass
  ) then
    alter table public.recurring_occurrence_statuses
      add constraint recurring_occurrence_statuses_sequence_number_check
      check (sequence_number is null or sequence_number > 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'recurring_occurrence_statuses_sequence_total_check'
      and conrelid = 'public.recurring_occurrence_statuses'::regclass
  ) then
    alter table public.recurring_occurrence_statuses
      add constraint recurring_occurrence_statuses_sequence_total_check
      check (sequence_total is null or sequence_total > 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'recurring_occurrence_statuses_sequence_order_check'
      and conrelid = 'public.recurring_occurrence_statuses'::regclass
  ) then
    alter table public.recurring_occurrence_statuses
      add constraint recurring_occurrence_statuses_sequence_order_check
      check (
        sequence_number is null
        or sequence_total is null
        or sequence_number <= sequence_total
      );
  end if;
end
$$;

comment on column public.recurring_transactions.schedule_mode is
  'ongoing = normal recurring/subscription schedule; finite = fixed installment schedule backed by recurring_occurrence_statuses rows.';

comment on column public.recurring_occurrence_statuses.amount is
  'Optional exact amount for a scheduled finite occurrence.';

comment on column public.recurring_occurrence_statuses.sequence_number is
  'Optional installment number, for example 2 in 2/3.';

comment on column public.recurring_occurrence_statuses.sequence_total is
  'Optional total installment count, for example 3 in 2/3.';
