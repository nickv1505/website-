import Stripe from 'stripe';
import { describe, expect, it, vi } from 'vitest';

import { checkoutForm, serve as checkoutServe } from '../../supabase/functions/create-checkout/index';
import { handleEvent, serve as webhookServe, verifyStripeSignature, type Store } from '../../supabase/functions/stripe-webhook/index';

const USER = '11111111-2222-4333-8444-555555555555';
const stripe = new Stripe('sk_test_unused');

function store() {
  const rpc = vi.fn(async (fn: string) => (fn === 'record_paid_checkout' ? 'granted' : fn === 'record_refund' ? 'refunded' : 'recorded'));
  return { rpc } as Store & { rpc: typeof rpc };
}

function sessionEvent(type: string, overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt_1',
    type,
    data: {
      object: {
        id: 'cs_test_1', mode: 'payment', payment_status: 'paid', amount_total: 4999, currency: 'usd',
        client_reference_id: USER, metadata: { product: 'lifetime_all_access', user_id: USER },
        payment_intent: 'pi_1', customer: 'cus_1', ...overrides,
      },
    },
  };
}

describe('Stripe signature verification (webhook function)', () => {
  const payload = JSON.stringify({ id: 'evt_x' });
  it('accepts signatures produced by the official Stripe library', async () => {
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_abc' });
    expect(await verifyStripeSignature(payload, header, 'whsec_abc')).toBe(true);
  });
  it('rejects a wrong secret, a tampered body, a missing header and old timestamps', async () => {
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_abc' });
    expect(await verifyStripeSignature(payload, header, 'whsec_other')).toBe(false);
    expect(await verifyStripeSignature(payload + ' ', header, 'whsec_abc')).toBe(false);
    expect(await verifyStripeSignature(payload, null, 'whsec_abc')).toBe(false);
    const old = stripe.webhooks.generateTestHeaderString({ payload, secret: 'whsec_abc', timestamp: Math.floor(Date.now() / 1000) - 3600 });
    expect(await verifyStripeSignature(payload, old, 'whsec_abc')).toBe(false);
  });
});

describe('webhook event handling', () => {
  it('grants lifetime access for a paid $49.99 USD checkout', async () => {
    const s = store();
    expect((await handleEvent(sessionEvent('checkout.session.completed'), s)).result).toBe('granted');
    expect(s.rpc).toHaveBeenCalledWith('record_paid_checkout', expect.objectContaining({ p_user_id: USER, p_session_id: 'cs_test_1', p_amount_total: 4999, p_currency: 'usd', p_payment_intent_id: 'pi_1', p_customer_id: 'cus_1' }));
  });
  it('does not grant access while a delayed payment is unpaid, then grants when it succeeds', async () => {
    const s = store();
    await handleEvent(sessionEvent('checkout.session.completed', { payment_status: 'unpaid' }), s);
    expect(s.rpc).toHaveBeenLastCalledWith('record_checkout_status', expect.objectContaining({ p_status: 'pending' }));
    await handleEvent(sessionEvent('checkout.session.async_payment_succeeded'), s);
    expect(s.rpc).toHaveBeenLastCalledWith('record_paid_checkout', expect.anything());
  });
  it('records failed delayed payments without granting', async () => {
    const s = store();
    await handleEvent(sessionEvent('checkout.session.async_payment_failed', { payment_status: 'unpaid' }), s);
    expect(s.rpc).toHaveBeenCalledWith('record_checkout_status', expect.objectContaining({ p_status: 'failed' }));
  });
  it.each([
    ['wrong amount', { amount_total: 100 }],
    ['wrong currency', { currency: 'cad' }],
    ['subscription mode', { mode: 'subscription' }],
    ['other product', { metadata: { product: 'x', user_id: USER } }],
    ['missing user', { client_reference_id: null }],
    ['user mismatch', { metadata: { product: 'lifetime_all_access', user_id: '99999999-2222-4333-8444-555555555555' } }],
  ])('never grants access for %s', async (_, overrides) => {
    const s = store();
    const res = await handleEvent(sessionEvent('checkout.session.completed', overrides), s);
    expect(['rejected', 'ignored']).toContain(res.result);
    expect(s.rpc).not.toHaveBeenCalled();
  });
  it('revokes access only on a full refund', async () => {
    const s = store();
    const charge = (refunded: boolean) => ({ id: 'evt_r', type: 'charge.refunded', data: { object: { payment_intent: 'pi_1', refunded } } });
    expect((await handleEvent(charge(false), s)).result).toBe('ignored');
    expect((await handleEvent(charge(true), s)).result).toBe('refunded');
  });
  it('rejects unsigned requests at the HTTP level', async () => {
    const env = (k: string) => ({ STRIPE_WEBHOOK_SECRET: 'whsec_abc', SUPABASE_URL: 'http://x', SUPABASE_SERVICE_ROLE_KEY: 'k' })[k];
    const res = await webhookServe(new Request('http://x', { method: 'POST', body: '{}' }), env);
    expect(res.status).toBe(400);
  });
});

describe('create-checkout function', () => {
  it('builds a one-time $49.99 USD payment linked to the user, never a subscription', () => {
    const f = checkoutForm({ userId: USER, email: 'a@b.co', siteUrl: 'https://site.test' });
    expect(f.get('mode')).toBe('payment');
    expect(f.get('line_items[0][price_data][unit_amount]')).toBe('4999');
    expect(f.get('line_items[0][price_data][currency]')).toBe('usd');
    expect(f.get('line_items[0][quantity]')).toBe('1');
    expect([...f.keys()].some((k) => k.includes('recurring'))).toBe(false);
    expect(f.get('client_reference_id')).toBe(USER);
    expect(f.get('metadata[user_id]')).toBe(USER);
    expect(f.get('metadata[product]')).toBe('lifetime_all_access');
    expect(f.get('payment_intent_data[metadata][user_id]')).toBe(USER);
    expect(f.get('success_url')).toBe('https://site.test/checkout/success?session_id={CHECKOUT_SESSION_ID}');
    expect(f.get('cancel_url')).toBe('https://site.test/checkout/cancelled');
  });

  it('uses a dashboard Price when STRIPE_PRICE_ID is set', () => {
    const f = checkoutForm({ userId: USER, email: '', siteUrl: 'https://s', priceId: 'price_123' });
    expect(f.get('line_items[0][price]')).toBe('price_123');
    expect(f.has('line_items[0][price_data][unit_amount]')).toBe(false);
  });

  const env = (k: string) => ({ SUPABASE_URL: 'http://db', SUPABASE_SERVICE_ROLE_KEY: 'svc', STRIPE_SECRET_KEY: 'sk_test_x' })[k];
  const req = () => new Request('http://fn', { method: 'POST', headers: { authorization: 'Bearer user-token', origin: 'https://site.test' } });

  it('refuses signed-out callers', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 401 }));
    expect((await checkoutServe(req(), env, fetcher as unknown as typeof fetch)).status).toBe(401);
  });

  it('does not charge customers who already have access', async () => {
    const fetcher = vi.fn(async (url: string) =>
      String(url).includes('/auth/v1/user') ? Response.json({ id: USER, email: 'a@b.co' }) : Response.json([{ status: 'active' }])
    );
    const res = await checkoutServe(req(), env, fetcher as unknown as typeof fetch);
    expect(await res.json()).toEqual({ alreadyPurchased: true });
    expect(fetcher).not.toHaveBeenCalledWith('https://api.stripe.com/v1/checkout/sessions', expect.anything());
  });

  it('returns the Stripe Checkout URL and keeps the secret key server-side', async () => {
    const calls: { url: string; init?: RequestInit }[] = [];
    const fetcher = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url: String(url), init });
      if (String(url).includes('/auth/v1/user')) return Response.json({ id: USER, email: 'a@b.co' });
      if (String(url).includes('/rest/v1/entitlements')) return Response.json([]);
      return Response.json({ url: 'https://checkout.stripe.com/c/pay/cs_test_123' });
    });
    const res = await checkoutServe(req(), env, fetcher as unknown as typeof fetch);
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/c/pay/cs_test_123' });
    const stripeCall = calls.find((c) => c.url === 'https://api.stripe.com/v1/checkout/sessions')!;
    expect((stripeCall.init!.headers as Record<string, string>).Authorization).toBe('Bearer sk_test_x');
  });

  it('reports "not configured" when no Stripe key is set', async () => {
    const res = await checkoutServe(req(), () => undefined);
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe('not_configured');
  });
});
