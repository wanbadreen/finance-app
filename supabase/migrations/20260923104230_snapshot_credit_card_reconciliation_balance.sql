alter table public.credit_card_reconciliations
    add column if not exists kira_outstanding numeric(14,2);

alter table public.credit_card_reconciliations
    drop constraint if exists credit_card_reconciliations_kira_outstanding_nonnegative;

alter table public.credit_card_reconciliations
    add constraint credit_card_reconciliations_kira_outstanding_nonnegative
    check (kira_outstanding is null or kira_outstanding >= 0);
