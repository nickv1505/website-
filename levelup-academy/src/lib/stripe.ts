import 'server-only';
import Stripe from 'stripe';

import { stripeConfig } from '@/lib/env';
import type { PaymentStore } from '@/lib/payments';
import { createAdminClient } from '@/lib/supabase/admin';

let client: Stripe | null = null;

/** Server-only Stripe client. The secret key never reaches the browser. */
export function getStripe(): Stripe {
  const { secretKey } = stripeConfig();
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not set.');
  client ??= new Stripe(secretKey);
  return client;
}

/** Writes verified payments through the transactional SQL functions (service role). */
export function supabasePaymentStore(): PaymentStore {
  const db = createAdminClient();
  const call = async (fn: string, args: Record<string, unknown>) => {
    const { data, error } = await db.rpc(fn, args);
    if (error) throw new Error(`${fn} failed: ${error.message}`);
    return String(data);
  };
  return {
    recordPaid: (r) =>
      call('record_paid_checkout', {
        p_event_id: r.eventId,
        p_event_type: r.eventType,
        p_user_id: r.userId,
        p_session_id: r.sessionId,
        p_payment_intent_id: r.paymentIntentId,
        p_customer_id: r.customerId,
        p_amount_total: r.amountTotal,
        p_currency: r.currency,
      }),
    recordStatus: (r) =>
      call('record_checkout_status', {
        p_event_id: r.eventId,
        p_event_type: r.eventType,
        p_user_id: r.userId,
        p_session_id: r.sessionId,
        p_payment_intent_id: r.paymentIntentId,
        p_customer_id: r.customerId,
        p_amount_total: r.amountTotal,
        p_currency: r.currency,
        p_status: r.status,
      }),
    recordRefund: (r) =>
      call('record_refund', { p_event_id: r.eventId, p_event_type: r.eventType, p_payment_intent_id: r.paymentIntentId }),
  };
}
