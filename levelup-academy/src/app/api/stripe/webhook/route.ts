import { NextResponse } from 'next/server';

import { stripeConfig } from '@/lib/env';
import { handleStripeEvent } from '@/lib/payments';
import { getStripe, supabasePaymentStore } from '@/lib/stripe';

/**
 * Stripe webhook. Verifies the signature against the RAW request body, then
 * records the payment and grants lifetime access in one idempotent transaction.
 * Returns 500 on database errors so Stripe retries the delivery.
 */
export async function POST(request: Request) {
  const { webhookSecret, webhookEnabled } = stripeConfig();
  if (!webhookEnabled) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const payload = await request.text();
  let event;
  try {
    event = await getStripe().webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    const outcome = await handleStripeEvent(event, supabasePaymentStore());
    if (outcome.result === 'rejected') console.error(`[stripe] ${event.id} rejected: ${outcome.detail}`);
    return NextResponse.json({ received: true, ...outcome });
  } catch (err) {
    console.error(`[stripe] ${event.id} failed`, err);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
