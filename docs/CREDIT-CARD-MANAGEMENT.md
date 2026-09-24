# Feature 3 — Credit Card Management

Branch: `feature/credit-card-management`
Base: Kira v1.2.0 master

## Product model

A credit card is represented by three linked records:

1. an `accounts` row with `account_type = credit_card`
2. a `payment_methods` row with `method_type = credit_card`
3. a `credit_cards` profile row linking the two

The account balance is a liability:
- an opening outstanding of RM3,011.83 is stored as `-3011.83`
- card purchases are Expenses and make the balance more negative
- card repayments are Account Transfers into the card account
- transfers therefore never double-count spending

## Card detail

The card page uses a Maybank-style information hierarchy:
- credit limit
- available credit
- outstanding balance
- utilisation
- latest statement balance
- statement date
- payment due date
- exact bank minimum payment
- last recorded payment
- statement payment progress
- estimated next finance charge
- estimated next minimum payment
- projected next statement balance

Bank statement values are the source of truth. Kira projections are labelled estimates.

## Calculation rules

Each card stores configurable:
- purchase APR
- cash advance APR
- minimum payment percentage
- minimum payment floor
- late fee percentage/min/max
- interest-free days
- statement day

This avoids hard-coding one bank's rules forever.

## Reconciliation

A reconciliation stores the bank-reported outstanding on a date and compares it with the Kira ledger. It does not silently create an expense or rewrite historical balances.

## Deployment

The SQL under `supabase/drafts/credit-card-management.sql` is intentionally a draft. After local build/tests pass, create the timestamped migration with the Supabase CLI, apply it, run advisors, then perform QA before merging to master.
