const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const safeHref = (href) => (/^(https?:|mailto:|tel:)/i.test(String(href || '')) ? String(href) : '');

function shell({ title, body, config }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#0a0a0a">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/archivo-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/main.css">
</head>
<body class="page-access">
  <div class="grain" aria-hidden="true"></div>
  <header class="nav nav--solid">
    <div class="wrap nav__inner">
      <a class="logo" href="/" aria-label="THE SUPPLIER home"><span class="logo__dot" aria-hidden="true"></span>THE SUPPLIER</a>
      <span class="nav__tag">Private access</span>
    </div>
  </header>
  <main>
${body}
  </main>
  <footer class="footer footer--slim">
    <div class="wrap footer__bottom">
      <span>© ${new Date().getFullYear()} THE SUPPLIER</span>
      <nav class="footer__links" aria-label="Legal">
        <a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/refunds">Refunds</a><a href="/contact">Contact</a>
      </nav>
    </div>
  </footer>
  <script src="/assets/js/access.js" defer></script>
</body>
</html>`;
}

function row(label, value, href) {
  const link = safeHref(href);
  const shown = link
    ? `<a href="${esc(link)}" target="_blank" rel="noopener noreferrer">${esc(value)}</a>`
    : `<span>${esc(value)}</span>`;
  return `<div class="field">
          <dt>${esc(label)}</dt>
          <dd>${shown}<button class="copy" type="button" data-copy="${esc(value)}" aria-label="Copy ${esc(label)}">Copy</button></dd>
        </div>`;
}

function section(num, title, inner) {
  return `<section class="dossier__section reveal">
        <h2 class="dossier__h"><span>${num}</span>${esc(title)}</h2>
        ${inner}
      </section>`;
}

function renderAccess(s, { demo, config }) {
  const plain = [
    `SUPPLIER: ${s.name}`,
    s.summary,
    '',
    'CONTACT',
    ...s.contacts.map((c) => `${c.label}: ${c.value}`),
    ...s.links.map((l) => `${l.label}: ${l.value}`),
    '',
    'PRODUCT CATEGORIES',
    ...s.categories.map((c) => `- ${c}`),
    '',
    'ORDERING',
    ...s.ordering.map((o) => `${o.label}: ${o.value}`),
    '',
    'RESELLING',
    ...s.reselling.map((r, i) => `${i + 1}. ${r}`),
    s.notes ? `\nNOTES\n${s.notes}` : '',
  ].join('\n');

  const sections = [];
  let n = 1;
  const num = () => String(n++).padStart(2, '0');

  if (s.contacts.length || s.links.length) {
    sections.push(
      section(num(), 'Contact', `<dl class="fields">
        ${s.contacts.map((c) => row(c.label, c.value, c.href)).join('')}
        ${s.links.map((l) => row(l.label, l.value, l.href)).join('')}
      </dl>`)
    );
  }
  if (s.categories.length) {
    sections.push(
      section(num(), 'Product categories', `<ul class="chips">${s.categories.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`)
    );
  }
  if (s.ordering.length) {
    sections.push(
      section(num(), 'Ordering', `<dl class="fields fields--plain">
        ${s.ordering.map((o) => `<div class="field"><dt>${esc(o.label)}</dt><dd><span>${esc(o.value)}</span></dd></div>`).join('')}
      </dl>`)
    );
  }
  if (s.reselling.length) {
    sections.push(
      section(num(), 'Reselling information', `<ol class="steps-list">${s.reselling.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>`)
    );
  }
  if (s.notes) {
    sections.push(section(num(), 'Notes', `<p class="dossier__notes">${esc(s.notes)}</p>`));
  }

  const body = `
    ${demo ? '<div class="demo-ribbon" role="note">Demo preview · sample data only</div>' : ''}
    <section class="granted">
      <div class="wrap">
        <p class="eyebrow eyebrow--live"><span class="pulse" aria-hidden="true"></span>Payment verified</p>
        <h1 class="granted__title"><span class="line"><span>ACCESS</span></span> <span class="line"><span>GRANTED.</span></span></h1>
        <p class="granted__sub">YOUR SUPPLIER IS READY.</p>
        <p class="granted__hint">This private link is your access. Bookmark it or save the details below. Questions? <a href="mailto:${esc(config.contactEmail)}">${esc(config.contactEmail)}</a></p>
      </div>
    </section>

    <section class="wrap dossier">
      <header class="dossier__head reveal">
        <div>
          <p class="eyebrow">Supplier</p>
          <h2 class="dossier__name">${esc(s.name)}</h2>
          ${s.summary ? `<p class="dossier__summary">${esc(s.summary)}</p>` : ''}
        </div>
        <div class="dossier__actions">
          <button class="btn btn--primary btn--sm" type="button" data-copy="${esc(plain)}">Copy everything</button>
          <button class="btn btn--ghost btn--sm" type="button" data-print>Save as PDF</button>
        </div>
      </header>
      ${sections.join('\n      ')}
      <p class="disclaimer disclaimer--inline">Purchasing supplier information does not guarantee sales, profits, or business success. Customers are responsible for evaluating suppliers and complying with applicable laws, platform rules, and resale requirements.</p>
    </section>
    <div class="toast" role="status" aria-live="polite"></div>`;

  return shell({ title: 'Access Granted — THE SUPPLIER', body, config });
}

const STATES = {
  locked: {
    eyebrow: 'Access locked',
    title: ['ACCESS', 'LOCKED.'],
    text: "We couldn't verify a completed purchase for this link. If you've paid, open the link from your checkout confirmation or contact us.",
  },
  processing: {
    eyebrow: 'Payment processing',
    title: ['ALMOST', 'THERE.'],
    text: 'Your payment is still processing. Refresh this page in a minute. Your supplier unlocks as soon as payment is confirmed.',
  },
  unavailable: {
    eyebrow: 'Payment received',
    title: ['ONE', 'MOMENT.'],
    text: "Your payment went through, but we couldn't load your supplier information right now. Email us and we'll send it to you directly.",
  },
};

function renderAccessError(state, config) {
  const s = STATES[state] || STATES.locked;
  const body = `
    <section class="granted granted--locked">
      <div class="wrap">
        <p class="eyebrow">${esc(s.eyebrow)}</p>
        <h1 class="granted__title"><span class="line"><span>${s.title[0]}</span></span> <span class="line"><span>${s.title[1]}</span></span></h1>
        <p class="granted__hint">${esc(s.text)}</p>
        <div class="granted__cta">
          ${state === 'processing' ? '<a class="btn btn--primary" href="">Refresh</a>' : '<a class="btn btn--primary" href="/#buy">Get access <span aria-hidden="true">→</span></a>'}
          <a class="btn btn--ghost" href="mailto:${esc(config.contactEmail)}">Contact us</a>
        </div>
      </div>
    </section>`;
  return shell({ title: `${s.eyebrow} — THE SUPPLIER`, body, config });
}

module.exports = { renderAccess, renderAccessError };
