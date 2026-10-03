import type Stripe from 'stripe';
import { describe, expect, it, vi } from 'vitest';

import { offer } from '@/config/site';
import { handleStripeEvent, type PaymentStore } from '@/lib/payments';

const USER = '11111111-2222-4333-8444-555555555555';

function store(): PaymentStore & { [k: string]: ReturnType<typeof vi.fn> } {
  return {
    recordPaid: vi.fn(async () => 'granted'),
    recordStatus: vi.fn(async () => 'recorded'),
    recordRefund: vi.fn(async () => 'refunded'),
  };
}

function sessionEvent(type: string, overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Event {
  return {
    id: 'evt_1',
    type,
    data: {
      object: {
        id: 'cs_test_1',
        object: 'checkout.session',
        mode: 'payment',
        payment_status: 'paid',
        amount_total: offer.priceCents,
        currency: 'usd',
        client_reference_id: USER,
        metadata: { product: offer.productKey, user_id: USER },
        payment_intent: 'pi_1',
        customer: 'cus_1',
        ...overrides,
      },
    },
  } as unknown as Stripe.Event;
}

describe('handleStripeEvent', () => {
  it('grants lifetime access for a paid checkout session', async () => {
    const s = store();
    const res = await handleStripeEvent(sessionEvent('checkout.session.completed'), s);
    expect(res.result).toBe('granted');
    expect(s.recordPaid).toHaveBeenCalledWith(
      expect.objectContaining({ userId: USER, sessionId: 'cs_test_1', amountTotal: 4999, currency: 'usd', paymentIntentId: 'pi_1', customerId: 'cus_1' })
    );
  });

  it('does not grant access while an async payment is still unpaid', async () => {
    const s = store();
    await handleStripeEvent(sessionEvent('checkout.session.completed', { payment_status: 'unpaid' }), s);
    expect(s.recordPaid).not.toHaveBeenCalled();
    expect(s.recordStatus).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending' }));
  });

  it('grants access when a delayed payment succeeds', async () => {
    const s = store();
    await handleStripeEvent(sessionEvent('checkout.session.async_payment_succeeded'), s);
    expect(s.recordPaid).toHaveBeenCalledOnce();
  });

  it('records failed async payments without granting', async () => {
    const s = store();
    await handleStripeEvent(sessionEvent('checkout.session.async_payment_failed', { payment_status: 'unpaid' }), s);
    expect(s.recordPaid).not.toHaveBeenCalled();
    expect(s.recordStatus).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed' }));
  });

  it.each([
    ['wrong amount', { amount_total: 100 }],
    ['wrong currency', { currency: 'cad' }],
    ['subscription mode', { mode: 'subscription' as const }],
    ['other product', { metadata: { product: 'something_else', user_id: USER } }],
    ['missing user', { client_reference_id: null }],
    ['user mismatch', { metadata: { product: offer.productKey, user_id: '99999999-2222-4333-8444-555555555555' } }],
  ])('never grants access for %s', async (_, overrides) => {
    const s = store();
    const res = await handleStripeEvent(sessionEvent('checkout.session.completed', overrides as Partial<Stripe.Checkout.Session>), s);
    expect(['rejected', 'ignored']).toContain(res.result);
    expect(s.recordPaid).not.toHaveBeenCalled();
  });

  it('revokes access only on a full refund', async () => {
    const s = store();
    const charge = (refunded: boolean) =>
      ({ id: 'evt_r', type: 'charge.refunded', data: { object: { id: 'ch_1', payment_intent: 'pi_1', refunded } } }) as unknown as Stripe.Event;
    expect((await handleStripeEvent(charge(false), s)).result).toBe('ignored');
    expect((await handleStripeEvent(charge(true), s)).result).toBe('refunded');
    expect(s.recordRefund).toHaveBeenCalledWith({ eventId: 'evt_r', eventType: 'charge.refunded', paymentIntentId: 'pi_1' });
  });

  it('ignores unrelated events', async () => {
    const res = await handleStripeEvent({ id: 'evt_x', type: 'customer.created', data: { object: {} } } as unknown as Stripe.Event, store());
    expect(res.result).toBe('ignored');
  });
});
