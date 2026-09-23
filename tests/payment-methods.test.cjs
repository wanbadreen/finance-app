const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('payment method migration is additive and ownership-safe', () => {
  const sql = read('supabase/migrations/20260923_payment_methods.sql');
  assert.match(sql, /create table if not exists public\.payment_methods/);
  assert.match(sql, /foreign key \(payment_method_id, user_id\)/);
  assert.match(sql, /references public\.payment_methods\(id, user_id\)/);
  assert.match(sql, /add column if not exists payment_method_id uuid/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /grant select, insert, update, delete on public\.payment_methods to authenticated/);
  assert.doesNotMatch(sql, /alter table public\.account_transfers/);
});

test('existing transactions remain backward compatible', () => {
  const sql = read('supabase/migrations/20260923_payment_methods.sql');
  assert.doesNotMatch(sql, /payment_method_id uuid not null/i);
  assert.doesNotMatch(sql, /update public\.transactions[\s\S]*payment_method_id/i);
});

test('transaction and recurring payloads persist payment method ids', () => {
  const source = read('script.js');
  assert.match(source, /payment_method_id:\s*paymentMethodId\s*\|\|\s*null/);
  assert.match(source, /payment_method_id:\s*recurringPaymentMethodId\s*\|\|\s*null/);
  assert.match(source, /payment_method_id:\s*item\.payment_method_id/);
});

test('payment method filtering never assigns a payment method to transfers', () => {
  const source = read('script.js');
  assert.match(source, /selectedPaymentMethod/);
  assert.match(source, /selectedPaymentMethod !== "all"[\s\S]*return \[\]/);
  const transferSource = read('transfers.js');
  assert.doesNotMatch(transferSource, /payment_method_id/);
});

test('scheduled reports can resolve payment methods without changing totals', () => {
  const report = read('supabase/functions/scheduled-email-reports/index.ts');
  assert.match(report, /payment_method_id/);
  assert.match(report, /payment_methods/);
  assert.match(report, /Payment Method/);
  assert.match(report, /if \(tx\.type === "income"\)/);
  assert.match(report, /expenses \+= amount/);
});
