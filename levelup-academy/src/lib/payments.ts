import type Stripe from 'stripe';

import { offer } from '@/config/site';

/**
 * Stripe webhook processing. Kept free of framework code so it can be unit
 * tested with a fake store. Each store method runs as ONE database transaction
 * that also records the Stripe event id, so duplicate deliveries are no-ops.
 */
export type CheckoutRecord = {
  eventId: string;
  eventType: string;
  userId: string;
  sessionId: string;
  paymentIntentId: string | null;
  customerId: string | null;
  amountTotal: number;
  currency: string;
};

export interface PaymentStore {
  recordPaid(record: CheckoutRecord): Promise<string>;
  recordStatus(record: CheckoutRecord & { status: 'pending' | 'failed' }): Promise<string>;
  recordRefund(args: { eventId: string; eventType: string; paymentIntentId: string }): Promise<string>;
}

export type HandleResult = { result: string; detail?: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const idOf = (v: string | { id: string } | null | undefined) => (typeof v === 'string' ? v : v?.id ?? null);

function toRecord(event: Stripe.Event, session: Stripe.Checkout.Session): CheckoutRecord | HandleResult {
  const userId = session.client_reference_id ?? '';
  if (session.mode !== 'payment') return { result: 'ignored', detail: 'not a one-time payment session' };
  if (session.metadata?.product !== offer.productKey) return { result: 'ignored', detail: 'different product' };
  if (!UUID_RE.test(userId) || session.metadata?.user_id !== userId) {
    return { result: 'rejected', detail: 'missing or mismatched user reference' };
  }
  if (session.amount_total !== offer.priceCents || session.currency?.toLowerCase() !== offer.currency) {
    return { result: 'rejected', detail: `unexpected amount ${session.amount_total} ${session.currency}` };
  }
  return {
    eventId: event.id,
    eventType: event.type,
    userId,
    sessionId: session.id,
    paymentIntentId: idOf(session.payment_intent),
    customerId: idOf(session.customer),
    amountTotal: session.amount_total,
    currency: session.currency,
  };
}

export async function handleStripeEvent(event: Stripe.Event, store: PaymentStore): Promise<HandleResult> {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const record = toRecord(event, session);
      if ('result' in record) return record;

      if (event.type === 'checkout.session.async_payment_failed') {
        return { result: await store.recordStatus({ ...record, status: 'failed' }) };
      }
      // Grant access only when Stripe says the money has actually been collected.
      if (session.payment_status === 'paid') {
        return { result: await store.recordPaid(record) };
      }
      return { result: await store.recordStatus({ ...record, status: 'pending' }) };
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = idOf(charge.payment_intent);
      // Revoke only on a full refund.
      if (!paymentIntentId || !charge.refunded) return { result: 'ignored', detail: 'partial refund' };
      return { result: await store.recordRefund({ eventId: event.id, eventType: event.type, paymentIntentId }) };
    }
    default:
      return { result: 'ignored', detail: `unhandled event ${event.type}` };
  }
}
