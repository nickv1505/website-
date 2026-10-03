// LevelUp Academy: Stripe webhook (Supabase Edge Function)
//
// Paste this whole file into Supabase → Edge Functions → "stripe-webhook".
// Turn OFF "Enforce JWT verification" for this function (Stripe can't send one).
// Required secrets (Edge Functions → Secrets):
//   STRIPE_WEBHOOK_SECRET   whsec_... from your Stripe webhook endpoint
// Provided automatically by Supabase: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// (if your project has no SUPABASE_SERVICE_ROLE_KEY, add your sb_secret_ key as SUPABASE_SECRET_KEY)
//
// What it does: verifies Stripe's signature, checks the payment is a completed
// one-time $49.99 USD purchase for this site, then calls the database function
// record_paid_checkout(), which grants lifetime access in ONE transaction and
// ignores duplicate deliveries of the same Stripe event.
// This file has no dependencies so it can be pasted as-is.

export const PRODUCT_KEY = 'lifetime_all_access';
export const PRICE_CENTS = 4999;
export const CURRENCY = 'usd';

type Json = Record<string, unknown>;

/** Supabase secret keys: legacy JWT keys also go in Authorization; new sb_secret_ keys only in apikey. */
export function serviceHeaders(key: string): Record<string, string> {
  return key.startsWith('eyJ') ? { apikey: key, Authorization: `Bearer ${key}` } : { apikey: key };
}

export type Store = {
  rpc(fn: string, args: Json): Promise<string>;
};
export type Outcome = { result: string; detail?: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const idOf = (v: unknown): string | null =>
  typeof v === 'string' ? v : v && typeof v === 'object' && typeof (v as Json).id === 'string' ? ((v as Json).id as string) : null;

// ---------------------------------------------------------------------------
// Signature verification (Stripe "v1" scheme: HMAC-SHA256 of `${t}.${body}`)
// ---------------------------------------------------------------------------
function hex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
export async function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
  now = Math.floor(Date.now() / 1000)
): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = header.split(',').map((p) => p.split('=') as [string, string]);
  const t = parts.find(([k]) => k === 't')?.[1];
  const sigs = parts.filter(([k]) => k === 'v1').map(([, v]) => v);
  if (!t || !sigs.length || !/^\d+$/.test(t)) return false;
  if (Math.abs(now - Number(t)) > toleranceSeconds) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${t}.${payload}`)));
  return sigs.some((s) => safeEqual(s, expected));
}

// ---------------------------------------------------------------------------
// Event handling
// ---------------------------------------------------------------------------
export async function handleEvent(event: Json, store: Store): Promise<Outcome> {
  const type = String(event.type ?? '');
  const eventId = String(event.id ?? '');
  const object = ((event.data as Json | undefined)?.object ?? {}) as Json;

  if (type.startsWith('checkout.session.')) {
    if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed'].includes(type)) {
      return { result: 'ignored', detail: type };
    }
    const metadata = (object.metadata ?? {}) as Json;
    const userId = String(object.client_reference_id ?? '');
    if (object.mode !== 'payment') return { result: 'ignored', detail: 'not a one-time payment' };
    if (metadata.product !== PRODUCT_KEY) return { result: 'ignored', detail: 'different product' };
    if (!UUID_RE.test(userId) || metadata.user_id !== userId) return { result: 'rejected', detail: 'user reference mismatch' };
    if (object.amount_total !== PRICE_CENTS || String(object.currency ?? '').toLowerCase() !== CURRENCY) {
      return { result: 'rejected', detail: `unexpected amount ${object.amount_total} ${object.currency}` };
    }
    const args = {
      p_event_id: eventId,
      p_event_type: type,
      p_user_id: userId,
      p_session_id: String(object.id),
      p_payment_intent_id: idOf(object.payment_intent),
      p_customer_id: idOf(object.customer),
      p_amount_total: object.amount_total,
      p_currency: String(object.currency),
    };
    if (type === 'checkout.session.async_payment_failed') {
      return { result: await store.rpc('record_checkout_status', { ...args, p_status: 'failed' }) };
    }
    // Grant access only when Stripe says the money was collected.
    if (object.payment_status === 'paid') return { result: await store.rpc('record_paid_checkout', args) };
    return { result: await store.rpc('record_checkout_status', { ...args, p_status: 'pending' }) };
  }

  if (type === 'charge.refunded') {
    const paymentIntentId = idOf(object.payment_intent);
    if (!paymentIntentId || object.refunded !== true) return { result: 'ignored', detail: 'partial refund' };
    return { result: await store.rpc('record_refund', { p_event_id: eventId, p_event_type: type, p_payment_intent_id: paymentIntentId }) };
  }

  return { result: 'ignored', detail: type };
}

function restStore(url: string, serviceKey: string): Store {
  return {
    async rpc(fn, args) {
      const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: { ...serviceHeaders(serviceKey), 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`${fn} failed (${res.status}): ${text}`);
      return JSON.parse(text);
    },
  };
}

const json = (body: Json, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export async function serve(req: Request, env: (k: string) => string | undefined): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const secret = env('STRIPE_WEBHOOK_SECRET') ?? '';
  const url = env('SUPABASE_URL') ?? '';
  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY') || env('SUPABASE_SECRET_KEY') || '';
  if (!secret || !url || !serviceKey) return json({ error: 'Webhook not configured' }, 503);

  const payload = await req.text();
  if (!(await verifyStripeSignature(payload, req.headers.get('stripe-signature'), secret))) {
    return json({ error: 'Invalid signature' }, 400);
  }
  let event: Json;
  try {
    event = JSON.parse(payload);
  } catch {
    return json({ error: 'Invalid payload' }, 400);
  }
  try {
    const outcome = await handleEvent(event, restStore(url, serviceKey));
    if (outcome.result === 'rejected') console.error(`[stripe] ${event.id} rejected: ${outcome.detail}`);
    return json({ received: true, ...outcome });
  } catch (err) {
    console.error(`[stripe] ${event.id} failed`, err);
    return json({ error: 'Processing failed' }, 500); // Stripe retries; duplicates are ignored
  }
}

declare const Deno: { serve(h: (req: Request) => Response | Promise<Response>): void; env: { get(k: string): string | undefined } } | undefined;
if (typeof Deno !== 'undefined') Deno.serve((req) => serve(req, (k) => Deno!.env.get(k)));
