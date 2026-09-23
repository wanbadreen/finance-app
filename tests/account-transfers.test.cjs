const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('transfer migration keeps transfers separate and ownership-safe', () => {
  const sql = read('supabase/migrations/20260923_account_transfers.sql');
  assert.match(sql, /create table if not exists public\.account_transfers/);
  assert.match(sql, /check \(from_account_id <> to_account_id\)/);
  assert.match(sql, /foreign key \(from_account_id, user_id\)/);
  assert.match(sql, /foreign key \(to_account_id, user_id\)/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /auth\.uid\(\)\) = user_id/);
});

test('transfer balance helper is wired into account balances', () => {
  const transferSource = read('transfers.js');
  const appSource = read('script.js');
  assert.match(transferSource, /export function getTransferAccountDelta/);
  assert.match(transferSource, /from_account_id/);
  assert.match(transferSource, /to_account_id/);
  assert.match(appSource, /getTransferAccountDelta\(\s*transfers,\s*accountId\s*\)/);
});

test('transfer mode exists without expanding transaction database types', () => {
  const html = read('index.html');
  const appSource = read('script.js');
  const migration = read('supabase/migrations/20260923_account_transfers.sql');
  assert.match(html, /<option value="transfer">/);
  assert.match(html, /id="transfer-from-account"/);
  assert.match(html, /id="transfer-to-account"/);
  assert.match(appSource, /type === "transfer"/);
  assert.doesNotMatch(migration, /alter table public\.transactions[\s\S]*type/);
});

test('reports continue to total income and expenses from transactions only', () => {
  const appSource = read('script.js');
  const start = appSource.indexOf('function getReportTotals(');
  const end = appSource.indexOf('function getMonthLabel(', start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const block = appSource.slice(start, end);
  assert.match(block, /item\.type ===\s*"income"/);
  assert.match(block, /item\.type ===\s*"expense"/);
  assert.doesNotMatch(block, /account_transfers|transfers/);
});
