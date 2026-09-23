# Account Transfers

This branch adds the first version of Kira account-to-account transfers.

## Data model

Transfers live in `public.account_transfers`, not in `public.transactions`.

One row represents one movement of money:

- `from_account_id`: account money leaves
- `to_account_id`: account money enters
- `amount`: positive amount
- `transfer_date`
- `description`
- optional `notes`
- `deleted_at` for the same short undo pattern used by transactions

Both account foreign keys include `user_id`, so a transfer cannot point at another user's account. RLS also restricts every operation to `auth.uid() = user_id`.

## Financial behaviour

A transfer is neither income nor expense.

For an account balance:

```
opening balance
+ income
- expense
+ incoming transfers
- outgoing transfers
```

Because each transfer adds to one account and subtracts from another, Kira's overall balance does not change.

Transfers remain outside:

- income totals
- expense totals
- budgets
- spending analytics
- savings-rate calculations
- unusual-spending insights
- recurring expense analytics

The main activity list can still show and filter transfers.

## UI

The existing transaction form gains a third type: **Transfer**.

Transfer mode shows:

- description
- From Account
- To Account
- amount
- date
- notes

Category, income source, tags and receipt fields are hidden because they do not apply to account-to-account movement.

## Delete / undo

Deleting a transfer first sets `deleted_at`. The existing 5-second Undo snackbar can restore it. After the undo window, the row is permanently removed. Any stale soft-deleted transfer is cleaned up on the next authenticated load.

## Migration / rollout

The migration is additive. It does not rewrite existing accounts or transactions and requires no data backfill.

Recommended rollout order:

1. apply `20260923_account_transfers.sql`
2. merge/deploy the web code
3. test with the dedicated QA account
4. run full report/budget/account-balance regression
5. include the feature in the next signed Android release batch

Do not publish a new Android version solely for this branch while the other planned v1.2.0 features are still being developed.
