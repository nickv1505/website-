// LevelUp Academy: create a Stripe Checkout session (Supabase Edge Function)
//
// Paste this whole file into Supabase → Edge Functions → "create-checkout".
// Keep "Enforce JWT verification" ON (only signed-in users can start checkout).
// Required secrets (Edge Functions → Secrets):
//   STRIPE_SECRET_KEY   sk_test_... while testing, sk_live_... when live
// Optional secrets:
//   SITE_URL            e.g. https://yourdomain.com (where Stripe sends people back)
//   STRIPE_PRICE_ID     price_... of a one-time $49.99 USD price in Stripe
// Provided automatically by Supabase: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// (if your project has no SUPABASE_SERVICE_ROLE_KEY, add your sb_secret_ key as SUPABASE_SECRET_KEY)
//
// The Stripe secret key stays here on the server and never reaches the browser.
// This file has no dependencies so it can be pasted as-is.

export const PRODUCT_KEY = 'lifetime_all_access';
export const PRICE_CENTS = 4999;
export const CURRENCY = 'usd';
export const PRODUCT_NAME = 'LevelUp Academy: Lifetime Access';

type Json = Record<string, unknown>;

/** Supabase secret keys: legacy JWT keys also go in Authorization; new sb_secret_ keys only in apikey. */
export function serviceHeaders(key: string): Record<string, string> {
  return key.startsWith('eyJ') ? { apikey: key, Authorization: `Bearer ${key}` } : { apikey: key };
}


const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: Json, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

/** Stripe Checkout parameters for the single one-time product (form-encoded). */
export function checkoutForm(opts: { userId: string; email: string; siteUrl: string; priceId?: string }): URLSearchParams {
  const f = new URLSearchParams();
  f.set('mode', 'payment'); // one-time payment, never a subscription
  if (opts.priceId) {
    f.set('line_items[0][price]', opts.priceId);
  } else {
    f.set('line_items[0][price_data][currency]', CURRENCY);
    f.set('line_items[0][price_data][unit_amount]', String(PRICE_CENTS));
    f.set('line_items[0][price_data][product_data][name]', PRODUCT_NAME);
    f.set('line_items[0][price_data][product_data][description]', 'One-time payment. Lifetime access to every course on the platform.');
  }
  f.set('line_items[0][quantity]', '1');
  if (opts.email) f.set('customer_email', opts.email);
  f.set('customer_creation', 'always');
  f.set('client_reference_id', opts.userId);
  for (const prefix of ['metadata', 'payment_intent_data[metadata]']) {
    f.set(`${prefix}[product]`, PRODUCT_KEY);
    f.set(`${prefix}[user_id]`, opts.userId);
  }
  f.set('success_url', `${opts.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  f.set('cancel_url', `${opts.siteUrl}/checkout/cancelled`);
  return f;
}

export async function serve(req: Request, env: (k: string) => string | undefined, fetcher: typeof fetch = fetch): Promise<Response> {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const url = env('SUPABASE_URL') ?? '';
  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY') || env('SUPABASE_SECRET_KEY') || '';
  const stripeKey = env('STRIPE_SECRET_KEY') ?? '';
  if (!stripeKey) return json({ error: 'not_configured', message: 'Payments are not configured yet.' }, 503);

  // Identify the signed-in user from their access token.
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  const userRes = await fetcher(`${url}/auth/v1/user`, { headers: { apikey: serviceKey, Authorization: `Bearer ${token}` } });
  if (!userRes.ok) return json({ error: 'unauthorized', message: 'Please sign in again.' }, 401);
  const user = (await userRes.json()) as { id: string; email?: string };

  // Already purchased? Don't charge twice.
  const entRes = await fetcher(`${url}/rest/v1/entitlements?select=status&user_id=eq.${user.id}&status=eq.active`, {
    headers: serviceHeaders(serviceKey),
  });
  if (entRes.ok && ((await entRes.json()) as unknown[]).length > 0) return json({ alreadyPurchased: true });

  const origin = req.headers.get('origin') ?? '';
  const siteUrl = (env('SITE_URL') || origin).replace(/\/+$/, '');
  if (!/^https?:\/\//.test(siteUrl)) return json({ error: 'bad_origin' }, 400);

  const stripeRes = await fetcher('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: checkoutForm({ userId: user.id, email: user.email ?? '', siteUrl, priceId: env('STRIPE_PRICE_ID') || undefined }),
  });
  const session = (await stripeRes.json()) as { url?: string; error?: { message?: string } };
  if (!stripeRes.ok || !session.url) {
    console.error('[checkout] Stripe error', session.error?.message);
    return json({ error: 'stripe', message: 'Could not start checkout. Please try again.' }, 502);
  }
  return json({ url: session.url });
}

declare const Deno: { serve(h: (req: Request) => Response | Promise<Response>): void; env: { get(k: string): string | undefined } } | undefined;
if (typeof Deno !== 'undefined') Deno.serve((req) => serve(req, (k) => Deno!.env.get(k)));
