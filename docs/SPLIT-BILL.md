# Split Bill

Open **Transactions → Split Bills** or **+ Split Bill**. An ordinary expense also has a **Split** action. The mobile **Add** button offers both ordinary transactions and split bills.

Create an equal, own-items or mixed bill; add names without requiring accounts; assign each item; enter whole-bill discount and tax/service charges; record all payments to the shop. Prices and payments use MYR with integer sen internally. Rounding uses largest remainders so allocations always match the total. An item-specific discount can be reflected in that item's entered price. Shop payments must cover the bill exactly.

Kira suggests repayment routes. The creator can edit the plan before any pending or confirmed repayments, provided every participant's net balance still matches. Exact matching balances are paired first; the suggestion does not promise the mathematically minimum number of transfers.

Each participant can receive a private capability link. Tokens contain 256 random bits, are stored only as SHA-256 hashes, and are placed in the URL fragment. Replacing a link invalidates the old one. The portal shows only the participant's own item shares, related repayment routes and payment history. Possession of the link authorizes acting as that participant; it is not identity verification. Share it only with that person. A recipient may enter bank/e-wallet instructions; automatic bank payments and bank verification are not provided.

Participants report partial or full payments and may attach JPG, PNG, WebP or PDF proof up to 5 MB. Proof is stored privately and signed URLs expire after five minutes. Only the recipient's link or the authenticated bill creator can confirm/reject a report. Creator confirmations explicitly record that the creator acted on the recipient's behalf. Pending reports reserve the reported amount without settling it. Rejections make the amount available to report again. Refresh retrieves changes made by other participants.

Bill financial allocations are immutable after saving. Names and payment instructions remain editable. Before any pending/confirmed repayments, cancel and recreate a bill to correct financial inputs. Cancellation restores a linked original expense, or removes the generated transaction projections for a new bill. It does not move or refund actual money. The cancelled bill remains in the database for audit and all participant access stops. Bills with pending/confirmed repayments cannot be cancelled.

## Accounting

Ordinary transactions retain their existing behavior. Split-linked transactions distinguish:

- `amount`: positive stored transaction value, retained for compatibility with the existing constraint.
- `report_amount`: personal expense/income attribution. Repayments have zero attribution.
- `cash_amount`: actual movement of the creator's money.
- `split_bill_id`: ownership-safe reference to the split bill.

Example: paying RM125 with a personal share of RM30 records RM125 cash out and RM30 spending. Receiving RM95 repayment records cash in but zero income. If someone else fronts the creator's share, spending is recorded on the bill date with zero initial cash movement; the creator's later repayment records cash out with zero additional spending.

Web dashboards, budgets, reports, MCP summaries and scheduled report emails use the attributed amount. Account balances and credit-card balances use the cash amount. Ordinary edits/deletes are blocked for split-linked transactions at both UI/API and database layers.

## Backend

`split_bills` has owner-scoped read RLS and no guest table grants. Writes go through the `split-bill` Edge Function. Owner requests validate the Supabase JWT with `auth.getUser`; guest requests validate the hashed participant token. `verify_jwt=false` is intentional for this custom authentication. Service credentials never reach the browser. `save_split_bill` and `cancel_split_bill` are SECURITY INVOKER RPCs executable only by `service_role`. Revision checks serialize concurrent reports/confirmations and commit financial projections atomically.

Deploy the SQL migrations before the UI/MCP update, and deploy `supabase/functions/split-bill`. The function imports the shared root `split-core.mjs`; include this dependency when deploying. Scheduled report code must include `report_amount` and normalize it before aggregation. The October 2026 deployment patched the existing scheduled function while preserving its current workbook/email implementation.

## Validation

Run `npm run test:split` and `npm run build`. Tests cover mixed/equal/own items, multiple shop payers, direct own payments, rounding, discounts, partial reports, overpayment, recipient authorization, link rotation, revision conflicts, cancellation and MCP cash/spending attribution.

Known baseline test issues in `master` before this feature: `tests/mcp.test.mjs` contains a malformed string around line 378; three source-inspection tests in `tests/credit-cards.test.cjs` select the declaration rather than the relevant form handler. These baseline issues do not affect the new split tests or production build.
