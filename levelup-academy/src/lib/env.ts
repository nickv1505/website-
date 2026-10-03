import 'server-only';

/** Server-side configuration. Values come only from environment variables. */
export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

export function supabaseSecretKey(): string | null {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function stripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const priceId = process.env.STRIPE_PRICE_ID || '';
  return {
    secretKey,
    webhookSecret,
    priceId,
    checkoutEnabled: Boolean(secretKey),
    webhookEnabled: Boolean(secretKey && webhookSecret),
  };
}
