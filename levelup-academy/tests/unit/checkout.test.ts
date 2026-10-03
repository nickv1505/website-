import { describe, expect, it } from 'vitest';

import { buildCheckoutParams } from '@/lib/checkout';

describe('buildCheckoutParams', () => {
  const base = { userId: 'u-1', email: 'a@b.co', siteUrl: 'https://example.com' };

  it('creates a one-time $49.99 USD payment, never a subscription', () => {
    const p = buildCheckoutParams(base);
    expect(p.mode).toBe('payment');
    expect(p.line_items).toHaveLength(1);
    const item = p.line_items![0];
    expect(item.quantity).toBe(1);
    expect(item.price_data?.unit_amount).toBe(4999);
    expect(item.price_data?.currency).toBe('usd');
    expect(item.price_data).not.toHaveProperty('recurring');
  });

  it('links the payment to the account and returns to our pages', () => {
    const p = buildCheckoutParams(base);
    expect(p.client_reference_id).toBe('u-1');
    expect(p.metadata).toEqual({ product: 'lifetime_all_access', user_id: 'u-1' });
    expect(p.payment_intent_data?.metadata).toEqual(p.metadata);
    expect(p.success_url).toBe('https://example.com/checkout/success?session_id={CHECKOUT_SESSION_ID}');
    expect(p.cancel_url).toBe('https://example.com/checkout/cancelled');
  });

  it('uses a dashboard Price when STRIPE_PRICE_ID is configured', () => {
    const p = buildCheckoutParams({ ...base, priceId: 'price_123' });
    expect(p.line_items).toEqual([{ price: 'price_123', quantity: 1 }]);
  });
});
