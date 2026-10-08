alter table public.transactions
  drop constraint if exists transactions_split_amounts_check;

alter table public.transactions
  add constraint transactions_split_amounts_check
  check (
    (
      split_bill_id is null
      and payment_request_id is null
      and report_amount is null
      and cash_amount is null
    )
    or
    (
      split_bill_id is not null
      and payment_request_id is null
      and report_amount is not null
      and cash_amount is not null
    )
    or
    (
      split_bill_id is null
      and payment_request_id is not null
      and report_amount is not null
      and cash_amount is not null
    )
  );
