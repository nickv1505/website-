# THE SUPPLIER

A single-product storefront that sells **Supplier Access** for **$19.99 USD**, as a one-time payment.

- Stripe Checkout handles payment. No subscriptions.
- The supplier information is only shown after the server confirms with Stripe that the payment went through.
- It is never in the public website code.

## Run it locally

You need Node.js 18 or newer.

```bash
cd the-supplier
npm install
cp .env.example .env                              # then fill in the values
cp data/supplier.example.json data/supplier.json  # then add your real supplier
npm start
```

Open http://localhost:3000.

- **Preview the access page with sample data:** http://localhost:3000/access?demo=1. This needs `ALLOW_DEMO_ACCESS=true` in `.env`, and never works in production.
- **Run the tests:** `npm test`.

If no Stripe key is set yet, the buy buttons return visitors to the page with a "checkout is being set up" notice.

## Stripe

1. Create an account at https://dashboard.stripe.com.
2. Go to **Developers → API keys** and copy the **Secret key** into `.env` as `STRIPE_SECRET_KEY`.
   - Use `sk_test_...` while testing. Pay with test card `4242 4242 4242 4242`, any future date and any CVC.
   - Switch to `sk_live_...` when you launch.
3. Set `SITE_URL` to your real address, for example `https://yourdomain.com`. Stripe sends buyers back to `SITE_URL/access?session_id=...`.
4. Optional: create a one-time $19.99 USD product in Stripe and put its price ID in `STRIPE_PRICE_ID`. If you leave it empty, the built-in $19.99 USD price is used.

The secret key stays on the server. The browser never sees it.

## Supplier information

Edit `data/supplier.json`. This file is git-ignored, so it never gets committed.

| Field | What it holds |
|---|---|
| `name` | Supplier name |
| `summary` | One line under the name |
| `contacts` | List of `{label, value, href}`. `href` is optional, e.g. `mailto:` or `tel:` |
| `links` | Website and socials, in the same format |
| `categories` | List of product categories |
| `ordering` | List of `{label, value}`: minimums, payment, shipping, how to order |
| `reselling` | List of tips or steps |
| `notes` | Free text |

On hosts where you can't upload a file, paste the whole JSON into the `SUPPLIER_JSON` environment variable instead. Checkout stays disabled until supplier data exists, so nobody can pay for nothing.

## How delivery is secured

1. A buy button posts to `/api/checkout`. The server creates a Stripe Checkout Session for $19.99, `mode: payment`, tagged `product=supplier_access`.
2. After payment, Stripe redirects the buyer to `/access?session_id=cs_...`.
3. The server retrieves that session from Stripe and checks that `payment_status === "paid"` and that it is our product. Only then does it read the supplier file and render the page.
4. Forged, unpaid or unrelated session IDs get "Access locked".
5. The access page is sent with `no-store`, `noindex` and `no-referrer`.

## Put it online with your domain

Any Node.js host works. Render is one of the simplest:

1. Push this repo to GitHub, then on https://render.com create a **Web Service** from it.
   - Root directory: `the-supplier`
   - Build: `npm install`
   - Start: `npm start`
2. Add the environment variables:
   - `NODE_ENV=production`
   - `SITE_URL=https://yourdomain.com`
   - `STRIPE_SECRET_KEY`
   - `CONTACT_EMAIL`
   - `SUPPLIER_JSON`, or upload `data/supplier.json` as a Secret File
3. In Render go to **Settings → Custom Domains**, add your domain, and create the DNS records it shows you at your registrar (GoDaddy, Namecheap and so on). HTTPS is automatic.
4. Switch Stripe to live keys and do one real purchase to confirm.

Railway, Fly.io, Heroku and a plain VPS also work. You need `npm install`, `npm start`, and the same environment variables.

Before launch, update the legal pages in `src/pages/` (terms, privacy and refunds) for your business. Having them reviewed by a lawyer is a good idea.

## Project structure

```
the-supplier/
  server.js              entry point
  src/app.js             routes, security headers, checkout, verified delivery
  src/config.js          environment configuration
  src/supplier.js        loads supplier data (server only)
  src/views/access.js    access page plus locked/processing states
  src/pages/*.html       homepage, terms, privacy, refunds, contact, 404
  public/                CSS, JS, fonts, images, favicon, robots.txt
  data/                  supplier.example.json (supplier.json is git-ignored)
  tests/                 end-to-end tests with a mocked Stripe
```
