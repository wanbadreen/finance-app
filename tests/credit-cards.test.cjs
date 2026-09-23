const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('credit card helper models liabilities and projections', async () => {
  let source = read('credit-cards.js')
    .replace(/^import[^;]+;\s*/gm, '')
    .replace(/export\s+/g, '');

  const factory = new Function(
    source + '\nreturn { getCreditCardOutstanding, getAvailableCredit, getCreditUtilisation, getRemainingStatementDue, estimateFinanceCharge, estimateMinimumPayment };'
  );

  const {
    getCreditCardOutstanding,
    getAvailableCredit,
    getCreditUtilisation,
    getRemainingStatementDue,
    estimateFinanceCharge,
    estimateMinimumPayment
  } = factory();

  assert.equal(getCreditCardOutstanding(-3011.83), 3011.83);
  assert.equal(getAvailableCredit(4000, 3011.83), 988.17);
  assert.equal(Math.round(getCreditUtilisation(4000, 3011.83) * 10) / 10, 75.3);
  assert.equal(estimateFinanceCharge({ interestBearingBalance: 1000, annualRate: 18, days: 30 }), 14.79);
  assert.equal(estimateMinimumPayment({ projectedBalance: 1000, percent: 5, floor: 50 }), 50);
  assert.equal(
    getRemainingStatementDue(
      {
        statement_balance: 2938.03,
        amount_due: 2789.08
      },
      50
    ),
    2888.03
  );
  assert.equal(
    getRemainingStatementDue(
      {
        statement_balance: 100,
        amount_due: 10
      },
      125
    ),
    0
  );
});

test('credit card schema keeps account and payment method ownership aligned', () => {
  const sql = read('supabase/drafts/credit-card-management.sql');

  assert.match(sql, /'credit_card'/);
  assert.match(sql, /foreign key \(account_id, user_id\)/);
  assert.match(sql, /foreign key \(payment_method_id, user_id\)/);
  assert.match(sql, /foreign key \(settlement_account_id, user_id\)/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /to authenticated/);
  assert.match(sql, /\(select auth\.uid\(\)\) = user_id/);
});

test('card payments stay account transfers rather than expenses', () => {
  const source = read('script.js');
  assert.match(source, /saveAccountTransfer/);
  assert.match(source, /recordCreditCardPayment/);
  assert.doesNotMatch(read('credit-cards.js'), /from\("transactions"\)\.insert/);
});

test('credit card account is automatically paired with its payment method', () => {
  const source = read('script.js');
  assert.match(source, /syncPaymentMethodForSelectedCreditCard/);
  assert.match(source, /payment_method_id/);
});

test('dashboard tracks card debt separately without double-counting card payments', () => {
  const source = read('script.js');
  assert.match(source, /renderCreditCardDashboardSummary/);
  assert.match(source, /calculateAccountBalance/);
  assert.match(source, /getTransferAccountDelta/);
  assert.match(source, /account\.account_type\s*!==\s*["']credit_card["']/);
});

test('dashboard labels liquid money separately from credit card debt', () => {
  const html = read('index.html');
  assert.match(html, /Available Funds/);
  assert.match(html, /Cash, bank, e-wallet &amp; savings|Cash, bank, e-wallet & savings/);
});

test('credit card statement UI uses statement balance and derived remaining due only', () => {
  const html = read('index.html');
  const source = read('script.js');

  assert.doesNotMatch(html, />Amount Due</);
  assert.doesNotMatch(html, /credit-card-amount-due/);
  assert.match(html, /Remaining Statement Due/);
  assert.doesNotMatch(source, /<span>Amount Due<\/span>/);
  assert.doesNotMatch(source, /credit-card-amount-due/);
  assert.match(source, /<span>Remaining Statement Due<\/span>/);
});

test('saving a card statement updates local state without blocking on a refetch', () => {
  const source = read('script.js');
  const start = source.indexOf('creditCardStatementForm');
  const handler = source.slice(start, source.indexOf('creditCardPaymentForm', start));

  assert.match(handler, /const savedStatement\s*=\s*await saveCreditCardStatement/);
  assert.match(handler, /creditCardStatements\s*=\s*creditCardStatements/);
  assert.doesNotMatch(handler, /await loadCreditCardData/);
});
