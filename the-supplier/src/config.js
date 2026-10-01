const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function loadConfig(env) {
  const port = Number(env.PORT) || 3000;
  const isProduction = env.NODE_ENV === 'production';
  const siteUrl = (env.SITE_URL || `http://localhost:${port}`).replace(/\/+$/, '');
  const supplierDataPath = path.resolve(ROOT, env.SUPPLIER_DATA_PATH || 'data/supplier.json');

  return {
    port,
    isProduction,
    siteUrl,
    brand: 'THE SUPPLIER',
    contactEmail: env.CONTACT_EMAIL || 'support@example.com',
    stripeSecretKey: env.STRIPE_SECRET_KEY || '',
    // Optional: use a Price created in the Stripe dashboard instead of inline price data.
    stripePriceId: env.STRIPE_PRICE_ID || '',
    priceCents: 1999,
    currency: 'usd',
    supplierDataPath,
    supplierJson: env.SUPPLIER_JSON || '',
    get supplierConfigured() {
      return Boolean(this.supplierJson) || fs.existsSync(this.supplierDataPath);
    },
    // Demo preview of the access page with sample data. Never enabled in production.
    allowDemoAccess: !isProduction && env.ALLOW_DEMO_ACCESS === 'true',
    examplePath: path.join(ROOT, 'data', 'supplier.example.json'),
    publicDir: path.join(ROOT, 'public'),
  };
}

module.exports = { loadConfig };
