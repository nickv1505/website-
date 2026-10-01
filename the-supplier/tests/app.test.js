const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createApp, PRODUCT_KEY } = require('../src/app');
const { loadConfig } = require('../src/config');

const SECRET_MARKER = 'SECRET-SUPPLIER-XYZ-9731';
const PAID_ID = 'cs_test_paid0000000000000001';

function tmpSupplier() {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sup-')), 'supplier.json');
  fs.writeFileSync(
    file,
    JSON.stringify({
      name: SECRET_MARKER,
      contacts: [{ label: 'Email', value: 'real@supplier.test', href: 'mailto:real@supplier.test' }],
      links: [{ label: 'Bad link', value: 'x', href: 'javascript:alert(1)' }],
      categories: ['<script>alert(1)</script>'],
    })
  );
  return file;
}

function fakeStripe(sessions, created) {
  return {
    checkout: {
      sessions: {
        async create(params) {
          created.push(params);
          return { id: 'cs_test_new', url: 'https://checkout.stripe.com/c/pay/cs_test_new' };
        },
        async retrieve(id) {
          if (!sessions[id]) throw new Error('No such checkout.session');
          return sessions[id];
        },
      },
    },
  };
}

async function start(envOverrides = {}, sessions = {}) {
  const created = [];
  const config = loadConfig({
    STRIPE_SECRET_KEY: 'sk_test_dummy',
    SUPPLIER_DATA_PATH: tmpSupplier(),
    SITE_URL: 'https://shop.test',
    CONTACT_EMAIL: 'help@shop.test',
    ...envOverrides,
  });
  const app = createApp({ config, stripe: fakeStripe(sessions, created) });
  const server = await new Promise((r) => { const s = app.listen(0, () => r(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  return { base, created, close: () => server.close() };
}

const paid = { [PAID_ID]: { id: PAID_ID, status: 'complete', payment_status: 'paid', metadata: { product: PRODUCT_KEY } } };

test('public pages render and never contain supplier data', async () => {
  const s = await start({}, paid);
  try {
    for (const p of ['/', '/terms', '/privacy', '/refunds', '/contact', '/assets/js/main.js', '/assets/css/main.css', '/sitemap.xml', '/robots.txt']) {
      const res = await fetch(s.base + p);
      assert.strictEqual(res.status, 200, p);
      const body = await res.text();
      assert.ok(!body.includes(SECRET_MARKER), `${p} leaks supplier data`);
      assert.ok(!body.includes('{{'), `${p} has unreplaced placeholders`);
    }
    const data = await fetch(s.base + '/data/supplier.json');
    assert.strictEqual(data.status, 404);
  } finally { s.close(); }
});

test('checkout creates a one-time $19.99 USD payment session', async () => {
  const s = await start({}, paid);
  try {
    const res = await fetch(s.base + '/api/checkout', { method: 'POST', redirect: 'manual' });
    assert.strictEqual(res.status, 303);
    assert.match(res.headers.get('location'), /^https:\/\/checkout\.stripe\.com\//);
    const p = s.created[0];
    assert.strictEqual(p.mode, 'payment');
    assert.strictEqual(p.line_items[0].price_data.unit_amount, 1999);
    assert.strictEqual(p.line_items[0].price_data.currency, 'usd');
    assert.strictEqual(p.line_items[0].quantity, 1);
    assert.strictEqual(p.success_url, 'https://shop.test/access?session_id={CHECKOUT_SESSION_ID}');
    assert.strictEqual(p.metadata.product, PRODUCT_KEY);
  } finally { s.close(); }
});

test('checkout without Stripe key redirects back with a notice', async () => {
  const config = loadConfig({ SUPPLIER_DATA_PATH: tmpSupplier() });
  const app = createApp({ config });
  const server = await new Promise((r) => { const x = app.listen(0, () => r(x)); });
  try {
    const res = await fetch(`http://127.0.0.1:${server.address().port}/api/checkout`, { method: 'POST', redirect: 'manual' });
    assert.strictEqual(res.status, 303);
    assert.strictEqual(res.headers.get('location'), '/?checkout=unavailable#buy');
  } finally { server.close(); }
});

test('access page requires a verified paid session', async () => {
  const sessions = {
    ...paid,
    cs_test_unpaid000000000000001: { status: 'open', payment_status: 'unpaid', metadata: { product: PRODUCT_KEY } },
    cs_test_processing00000000001: { status: 'complete', payment_status: 'unpaid', metadata: { product: PRODUCT_KEY } },
    cs_test_otherproduct000000001: { status: 'complete', payment_status: 'paid', metadata: {} },
  };
  const s = await start({}, sessions);
  try {
    const cases = [
      ['/access', 403],
      ['/access?session_id=nope', 403],
      ['/access?session_id=cs_test_doesnotexist00000001', 403],
      ['/access?session_id=cs_test_unpaid000000000000001', 402],
      ['/access?session_id=cs_test_processing00000000001', 402],
      ['/access?session_id=cs_test_otherproduct000000001', 403],
      ['/access?demo=1', 403],
    ];
    for (const [url, code] of cases) {
      const res = await fetch(s.base + url);
      const body = await res.text();
      assert.strictEqual(res.status, code, url);
      assert.ok(!body.includes(SECRET_MARKER), `${url} leaked supplier data`);
    }

    const ok = await fetch(`${s.base}/access?session_id=${PAID_ID}`);
    const html = await ok.text();
    assert.strictEqual(ok.status, 200);
    assert.ok(html.includes('ACCESS') && html.includes('GRANTED.') && html.includes('YOUR SUPPLIER IS READY.'));
    assert.ok(html.includes(SECRET_MARKER));
    assert.ok(html.includes('mailto:real@supplier.test'));
    assert.ok(!html.includes('javascript:alert'), 'unsafe href rendered');
    assert.ok(!html.includes('<script>alert(1)</script>'), 'unescaped HTML rendered');
    assert.strictEqual(ok.headers.get('cache-control'), 'no-store, max-age=0');
    assert.strictEqual(ok.headers.get('referrer-policy'), 'no-referrer');
  } finally { s.close(); }
});

test('demo access shows sample data only when enabled and not in production', async () => {
  const s = await start({ ALLOW_DEMO_ACCESS: 'true' }, paid);
  try {
    const html = await (await fetch(s.base + '/access?demo=1')).text();
    assert.ok(html.includes('Example Supplier Co.'));
    assert.ok(!html.includes(SECRET_MARKER));
  } finally { s.close(); }
  const p = await start({ ALLOW_DEMO_ACCESS: 'true', NODE_ENV: 'production' }, paid);
  try {
    assert.strictEqual((await fetch(p.base + '/access?demo=1')).status, 403);
  } finally { p.close(); }
});
