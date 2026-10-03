import type Stripe from 'stripe';

import { offer } from '@/config/site';

/** Builds the Stripe Checkout Session for the single one-time product. */
export function buildCheckoutParams(opts: {
  userId: string;
  email: string;
  siteUrl: string;
  priceId?: string;
}): Stripe.Checkout.SessionCreateParams {
  const metadata = { product: offer.productKey, user_id: opts.userId };
  return {
    mode: 'payment', // one-time payment, never a subscription
    line_items: [
      opts.priceId
        ? { price: opts.priceId, quantity: 1 }
        : {
            quantity: 1,
            price_data: {
              currency: offer.currency,
              unit_amount: offer.priceCents,
              product_data: {
                name: offer.name,
                description: 'One-time payment. Lifetime access to every course on the platform.',
              },
            },
          },
    ],
    customer_email: opts.email || undefined,
    customer_creation: 'always',
    client_reference_id: opts.userId,
    metadata,
    payment_intent_data: { metadata },
    success_url: `${opts.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.siteUrl}/checkout/cancelled`,
  };
}
