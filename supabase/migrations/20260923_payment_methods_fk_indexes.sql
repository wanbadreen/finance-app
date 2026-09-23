-- Kira — Payment Method FK covering indexes
-- Follow-up to the Payment Methods migration.
-- These indexes match the ownership FK column order used by PostgreSQL.

create index if not exists transactions_payment_method_owner_fk_idx
    on public.transactions (payment_method_id, user_id);

create index if not exists recurring_payment_method_owner_fk_idx
    on public.recurring_transactions (payment_method_id, user_id);
