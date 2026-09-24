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
        pre_tracking_paid_since_statement: 148.95,
        amount_due: 1
      },
      0
    ),
    2789.08
  );
  assert.equal(
    getRemainingStatementDue(
      {
        statement_balance: 2938.03,
        pre_tracking_paid_since_statement: 148.95,
        amount_due: 9999
      },
      50
    ),
    2739.08
  );
  assert.equal(
    getRemainingStatementDue(
      {
        statement_balance: 100,
        pre_tracking_paid_since_statement: 25,
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
  assert.match(html, /Already Paid Since Statement/);
  assert.match(html, /credit-card-pre-tracking-paid/);
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


test('credit card reconciliation stores a stable Kira balance snapshot', () => {
  const source = read('script.js');
  const helper = read('credit-cards.js');

  assert.match(source, /reconciliation\.kira_outstanding/);
  assert.match(source, /kiraOutstanding:\s*getCreditCardOutstandingAsOf/);
  assert.doesNotMatch(
    source.slice(
      source.indexOf('creditCardReconcileForm'),
      source.indexOf('document\n    \.getElementById', source.indexOf('creditCardReconcileForm'))
    ),
    /await loadCreditCardData/
  );
  assert.match(helper, /kira_outstanding:\s*toMoneyNumber\(kiraOutstanding\)/);
});


test('statement payment counting starts strictly after the statement date', () => {
  const source = read('credit-cards.js');
  const notifications = read('notifications.js');

  assert.match(source, /transfer\.transfer_date > statementDate/);
  assert.doesNotMatch(source, /transfer\.transfer_date >= statementDate/);
  assert.match(notifications, /transfer\.transfer_date > statement\.statement_date/);
});


test('statement form resets values when switching cards and after save', () => {
  const source = read('script.js');

  assert.match(
    source,
    /function resetCreditCardStatementForm\(\s*cardId = ""\s*\)/
  );
  assert.match(
    source,
    /creditCardStatementForm\s*\?\.reset\(\)/
  );
  assert.match(
    source,
    /"credit-card-statement-card"[\s\S]*?addEventListener\(\s*"change"[\s\S]*?resetCreditCardStatementForm\(\s*event\.target\.value\s*\)/
  );
  assert.match(
    source,
    /action ===\s*"statement"[\s\S]*?resetCreditCardStatementForm\(\s*card\.id\s*\)/
  );

  const statementHandlerStart =
    source.indexOf('creditCardStatementForm');
  const paymentHandlerStart =
    source.indexOf('creditCardPaymentForm', statementHandlerStart);
  const statementHandler =
    source.slice(statementHandlerStart, paymentHandlerStart);

  assert.match(
    statementHandler,
    /resetCreditCardStatementForm\(\s*creditCardId\s*\)[\s\S]*?"Statement saved\."/
  );
});


test('credit card to e-wallet transfers support automatic top-up fees', () => {
  const html = read('index.html');
  const source = read('script.js');
  const transfers = read('transfers.js');

  assert.match(html, /id="transfer-fee-group"/);
  assert.match(html, /id="transfer-fee-percent"/);
  assert.match(html, /TNG eWallet defaults to 1%/);

  assert.match(source, /source\?\.account_type ===\s*"credit_card"/);
  assert.match(source, /destination\?\.account_type ===\s*"e_wallet"/);
  assert.match(source, /isTngEwalletAccount/);
  assert.match(source, /transferFeePercentInput\.value =\s*"1"/);
  assert.match(source, /feePercent:\s*transferFeePercentInput/);
  assert.match(source, /Automatic top-up fee/);
  assert.match(source, /await loadTransfers\(\s*true\s*\);[\s\S]*?await loadTransactions\(\s*true\s*\);/);

  assert.match(transfers, /feePercent = 0/);
  assert.match(transfers, /fee_percent:\s*numericFeePercent/);
});

test('transfer refresh recalculates dashboard available funds immediately', () => {
  const source = read('script.js');
  const start = source.indexOf('async function loadTransfers');
  const end = source.indexOf('function populateTransferAccountSelects', start);
  const helper = source.slice(start, end);

  assert.match(helper, /updateDashboard\(\)/);
});
