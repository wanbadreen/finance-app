const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Exercise the actual app functions with browser/native boundaries mocked;
// never authenticate or contact the live backend.
function load(file, name, globals) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8').replace(/\r\n/g, '\n');
  const pattern = new RegExp('(?:async )?function ' + name + '\\(');
  const start = source.search(pattern);
  assert.notEqual(start, -1);
  const end = source.indexOf('\n}\n', start) + 2;
  return vm.runInNewContext(source.slice(start, end) + '\n' + name, globals);
}

test('native reset uses configured Site URL; web keeps its current redirect', () => {
  const window = { location: { origin: 'https://example.test', pathname: '/kira' } };
  assert.equal(load('script.js', 'getPasswordResetRedirectUrl', { isNativeApp: true, window })(), undefined);
  assert.equal(load('script.js', 'getPasswordResetRedirectUrl', { isNativeApp: false, window })(), 'https://example.test/kira');
});

test('native install card reports installed without consulting browser APIs', () => {
  assert.equal(load('script.js', 'isStandaloneMode', { isNativeApp: true })(), true);
  const window = { matchMedia: () => ({ matches: false }), navigator: {} };
  assert.equal(load('script.js', 'isStandaloneMode', { isNativeApp: false, window })(), false);
});

test('native never advertises web push even when browser API names exist', () => {
  const navigator = { serviceWorker: {} };
  const window = { Notification: {}, PushManager: {} };
  assert.equal(load('notifications.js', 'canUsePushApi', { isNativeApp: true, navigator, window })(), false);
  assert.equal(load('notifications.js', 'canUsePushApi', { isNativeApp: false, navigator, window })(), true);
});

test('native notification bootstrap never looks up or registers a service worker', async () => {
  const navigator = new Proxy({}, { has() { throw Error('Unexpected service worker access'); } });
  const globals = { isNativeApp: true, navigator };
  assert.equal(await load('notifications.js', 'getServiceWorkerRegistration', globals)({ registerIfMissing: true }), null);
  assert.equal(await load('notifications.js', 'primeServiceWorker', globals)(), undefined);
});

test('native receipt opens signed HTTPS URL without opening about:blank', async () => {
  const window = { location: {}, open() { throw Error('Unexpected popup'); } };
  const supabase = { storage: { from: () => ({ createSignedUrl: async () => ({ data: { signedUrl: 'https://example.test/receipt' } }) }) } };
  await load('script.js', 'openReceipt', { isNativeApp: true, window, supabase, RECEIPT_BUCKET: 'receipts' })('test.png');
  assert.equal(window.location.href, 'https://example.test/receipt');
});

test('web receipt keeps popup flow; failures close it and report error', async () => {
  let closed = false, message;
  const popup = { location: {}, close() { closed = true; } };
  const window = { open: () => popup };
  let response = { data: { signedUrl: 'https://example.test/receipt' } };
  const supabase = { storage: { from: () => ({ createSignedUrl: async () => response }) } };
  const open = load('script.js', 'openReceipt', { isNativeApp: false, window, supabase, RECEIPT_BUCKET: 'receipts', alert: text => { message = text; } });
  await open('test.png');
  assert.equal(popup.location.href, 'https://example.test/receipt');
  response = { error: { message: 'Expired' } };
  await open('test.png');
  assert.equal(closed, true);
  assert.equal(message, 'Expired');
});
