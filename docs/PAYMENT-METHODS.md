# Feature 2 — Payment Methods

Branch: `feature/payment-methods`
Base: `cf6b391` (`feature/account-transfers`)

## Scope

Payment Method is separate from Account. Transactions and recurring items may optionally reference a payment method. Account transfers remain separate and do not receive payment methods.

Default methods:
- Cash
- Debit Card
- Credit Card
- Bank Transfer
- E-Wallet
- Online Banking
- Other

## Data model

`payment_methods` is user-owned and protected by RLS. `transactions.payment_method_id` and `recurring_transactions.payment_method_id` are nullable ownership-safe foreign keys.

The nullable design preserves existing rows and allows old app versions to continue inserting transactions without a payment method.

## Credit-card preparation

`method_type = 'credit_card'` is intentionally generic. Feature 3 can create concrete credit-card payment methods and link them from a dedicated `credit_cards` table without adding another card foreign key to transactions.

No credit-card account type is introduced in Feature 2.

## Behaviour

- Transaction form: optional Payment Method.
- Transfer mode: Payment Method hidden and ignored.
- Recurring form: optional Payment Method.
- Logging a recurring item copies its payment method into the generated transaction.
- Quick Fill copies Payment Method.
- Transaction search/filter supports Payment Method and Not Specified.
- Report transaction detail and CSV include Payment Method.
- Scheduled email/Excel reports resolve Payment Method.
- Income, expense, budget and account-balance calculations remain unchanged.

## Deployment rule

Do not merge to master, deploy Vercel, bump Android version, or apply the migration to production until local build/tests and QA are completed.
