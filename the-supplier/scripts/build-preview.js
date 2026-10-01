// Builds a static, view-only copy of the site into preview/ so it can be
// opened without running the server (e.g. through a GitHub file link).
// Checkout buttons show the "being set up" notice instead of paying, and the
// access page uses the SAMPLE data from data/supplier.example.json only.
const fs = require('fs');
const path = require('path');

const { loadConfig } = require('../src/config');
const { loadExampleSupplier } = require('../src/supplier');
const { renderAccess } = require('../src/views/access');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'preview');
const config = loadConfig({ CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'support@example.com' });

fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, 'public'), OUT, { recursive: true });

const css = path.join(OUT, 'assets/css/main.css');
fs.writeFileSync(css, fs.readFileSync(css, 'utf8').replaceAll('url("/assets/fonts/', 'url("../fonts/'));

const ROUTES = { '/': 'index.html', '/terms': 'terms.html', '/privacy': 'privacy.html', '/refunds': 'refunds.html', '/contact': 'contact.html' };

function relink(html) {
  return html
    .replace(/(href|src)="\/(assets\/|favicon\.svg)/g, '$1="$2')
    .replace(/href="\/(terms|privacy|refunds|contact)"/g, 'href="$1.html"')
    .replace(/href="\/#/g, 'href="index.html#')
    .replace(/href="\/"/g, 'href="index.html"')
    .replace(/<form([^>]*?)method="post" action="\/api\/checkout"/g, '<form$1method="get" action="index.html"')
    .replace(/(<form[^>]*data-checkout>)/g, '$1<input type="hidden" name="checkout" value="unavailable">')
    .replace(/<link rel="canonical"[^>]*>\n?\s*/, '');
}

for (const file of Object.values(ROUTES).concat('404.html')) {
  const html = fs
    .readFileSync(path.join(ROOT, 'src/pages', file), 'utf8')
    .replaceAll('{{CONTACT_EMAIL}}', config.contactEmail)
    .replaceAll('{{SITE_URL}}', '.')
    .replaceAll('{{YEAR}}', String(new Date().getFullYear()));
  fs.writeFileSync(path.join(OUT, file), relink(html));
}

fs.writeFileSync(
  path.join(OUT, 'access-demo.html'),
  relink(renderAccess(loadExampleSupplier(config), { demo: true, config }))
);

console.log(`Preview built in ${path.relative(process.cwd(), OUT) || OUT}`);
