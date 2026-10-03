import { NextResponse, type NextRequest } from 'next/server';

import { siteUrl } from '@/config/site';
import { getViewer } from '@/lib/auth';
import { buildCheckoutParams } from '@/lib/checkout';
import { stripeConfig } from '@/lib/env';
import { getStripe } from '@/lib/stripe';

/** Creates a Stripe Checkout Session and redirects the customer to Stripe. */
export async function POST(request: NextRequest) {
  const base = siteUrl();
  const go = (path: string) => NextResponse.redirect(new URL(path, request.nextUrl.origin), 303);

  // Basic CSRF protection: only accept form posts from our own pages.
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin && origin !== new URL(base).origin) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const viewer = await getViewer();
  if (!viewer) return go('/signup?next=/checkout');
  if (viewer.hasAccess) return go('/dashboard');

  const config = stripeConfig();
  if (!config.checkoutEnabled) return go('/checkout?error=unavailable');

  try {
    const session = await getStripe().checkout.sessions.create(
      buildCheckoutParams({ userId: viewer.id, email: viewer.email, siteUrl: base, priceId: config.priceId })
    );
    if (!session.url) throw new Error('Stripe returned no checkout URL');
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error('[checkout] could not create session', err);
    return go('/checkout?error=stripe');
  }
}
