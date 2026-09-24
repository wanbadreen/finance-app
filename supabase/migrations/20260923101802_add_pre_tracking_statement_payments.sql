alter table public.credit_card_statements
    add column if not exists pre_tracking_paid_since_statement numeric(14,2) not null default 0;

alter table public.credit_card_statements
    drop constraint if exists credit_card_statements_pre_tracking_paid_nonnegative;

alter table public.credit_card_statements
    add constraint credit_card_statements_pre_tracking_paid_nonnegative
    check (pre_tracking_paid_since_statement >= 0);
