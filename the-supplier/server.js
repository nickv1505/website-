require('dotenv').config();

const { createApp } = require('./src/app');
const { loadConfig } = require('./src/config');

const config = loadConfig(process.env);
const app = createApp({ config });

app.listen(config.port, () => {
  console.log(`THE SUPPLIER running at http://localhost:${config.port}`);
  if (!config.stripeSecretKey) {
    console.log('  Stripe: not configured (add STRIPE_SECRET_KEY to .env to enable checkout)');
  }
  if (!config.supplierConfigured) {
    console.log(`  Supplier data: missing (create ${config.supplierDataPath} from data/supplier.example.json)`);
  }
  if (config.allowDemoAccess) {
    console.log(`  Demo access page: http://localhost:${config.port}/access?demo=1`);
  }
});
