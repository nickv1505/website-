const express = require('express');
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const { loadSupplier, loadExampleSupplier } = require('./supplier');
const { renderAccess, renderAccessError } = require('./views/access');

const PRODUCT_KEY = 'supplier_access';
const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/;
const PAGES = {
  '/': 'index.html',
  '/terms': 'terms.html',
  '/privacy': 'privacy.html',
  '/refunds': 'refunds.html',
  '/contact': 'contact.html',
};

function createApp({ config, stripe } = {}) {
  const app = express();
  const stripeClient = stripe || (config.stripeSecretKey ? new Stripe(config.stripeSecretKey) : null);
  const pageCache = new Map();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use((req, res, next) => {
    res.set({
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "form-action 'self' https://checkout.stripe.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    });
    if (config.isProduction) {
      res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Static assets only. HTML pages are rendered through the routes below.
  app.use(express.static(config.publicDir, { index: false, maxAge: config.isProduction ? '7d' : 0 }));

  function page(name) {
    if (!config.isProduction || !pageCache.has(name)) {
      const html = fs
        .readFileSync(path.join(__dirname, 'pages', name), 'utf8')
        .replaceAll('{{CONTACT_EMAIL}}', config.contactEmail)
        .replaceAll('{{SITE_URL}}', config.siteUrl)
        .replaceAll('{{YEAR}}', String(new Date().getFullYear()));
      pageCache.set(name, html);
    }
    return pageCache.get(name);
  }

  for (const [route, file] of Object.entries(PAGES)) {
    app.get(route, (req, res) => res.type('html').send(page(file)));
  }

  app.get('/sitemap.xml', (req, res) => {
    const urls = Object.keys(PAGES).map((r) => `<url><loc>${config.siteUrl}${r === '/' ? '/' : r}</loc></url>`);
    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
    );
  });

  // ---- Checkout ------------------------------------------------------------
  const hits = new Map();
  function rateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > 20;
  }

  app.post('/api/checkout', async (req, res) => {
    if (!stripeClient || !config.supplierConfigured) {
      return res.redirect(303, '/?checkout=unavailable#buy');
    }
    if (rateLimited(req.ip)) {
      return res.redirect(303, '/?checkout=busy#buy');
    }
    try {
      const lineItem = config.stripePriceId
        ? { price: config.stripePriceId, quantity: 1 }
        : {
            price_data: {
              currency: config.currency,
              unit_amount: config.priceCents,
              product_data: {
                name: 'Supplier Access',
                description: 'One-time purchase. Supplier contact and information package.',
              },
            },
            quantity: 1,
          };

      const session = await stripeClient.checkout.sessions.create({
        mode: 'payment',
        line_items: [lineItem],
        success_url: `${config.siteUrl}/access?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.siteUrl}/?checkout=cancelled#buy`,
        metadata: { product: PRODUCT_KEY },
        payment_intent_data: { metadata: { product: PRODUCT_KEY } },
      });
      return res.redirect(303, session.url);
    } catch (err) {
      console.error('Stripe checkout error:', err.message);
      return res.redirect(303, '/?checkout=error#buy');
    }
  });

  // ---- Post-purchase delivery ---------------------------------------------
  app.get('/access', async (req, res) => {
    res.set({
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
      // Keep the session id out of the Referer header when buyers click supplier links.
      'Referrer-Policy': 'no-referrer',
    });

    if (req.query.demo === '1' && config.allowDemoAccess) {
      return res.type('html').send(renderAccess(loadExampleSupplier(config), { demo: true, config }));
    }

    const sessionId = String(req.query.session_id || '');
    if (!SESSION_ID_RE.test(sessionId) || !stripeClient) {
      return res.status(403).type('html').send(renderAccessError('locked', config));
    }

    let session;
    try {
      session = await stripeClient.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      console.error('Stripe session lookup failed:', err.message);
      return res.status(403).type('html').send(renderAccessError('locked', config));
    }

    const isOurs = session && session.metadata && session.metadata.product === PRODUCT_KEY;
    if (!isOurs) {
      return res.status(403).type('html').send(renderAccessError('locked', config));
    }
    if (session.payment_status !== 'paid') {
      const state = session.status === 'complete' ? 'processing' : 'locked';
      return res.status(402).type('html').send(renderAccessError(state, config));
    }

    let supplier;
    try {
      supplier = loadSupplier(config);
    } catch (err) {
      console.error('Supplier data could not be loaded:', err.message);
      return res.status(500).type('html').send(renderAccessError('unavailable', config));
    }
    return res.type('html').send(renderAccess(supplier, { demo: false, config }));
  });

  app.use((req, res) => res.status(404).type('html').send(page('404.html')));

  return app;
}

module.exports = { createApp, PRODUCT_KEY };
