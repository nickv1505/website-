import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { pricingIncludes } from '@/components/marketing/pricing-card';
import { Icons } from '@/components/ui/icons';
import { SubmitButton } from '@/components/ui/submit-button';
import { offer, refundPolicy } from '@/config/site';
import { getViewer } from '@/lib/auth';
import { catalogStats, getCatalog } from '@/lib/data/catalog';
import { stripeConfig } from '@/lib/env';

export const metadata: Metadata = { title: 'Get lifetime access', robots: { index: false } };

const errors: Record<string, string> = {
  unavailable: 'Payments are not configured yet. The site owner needs to add Stripe keys before purchases can be made.',
  stripe: 'We could not start checkout. Please try again in a moment.',
};

export default async function CheckoutPage({ searchParams }: PageProps<'/checkout'>) {
  const viewer = await getViewer();
  if (!viewer) redirect('/signup?next=/checkout');
  if (viewer.hasAccess) redirect('/dashboard');
  const sp = await searchParams;
  const error = typeof sp.error === 'string' ? errors[sp.error] : undefined;
  const enabled = stripeConfig().checkoutEnabled;
  const stats = catalogStats(await getCatalog());

  return (
    <div className="container-page grid max-w-5xl gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Unlock the full library</h1>
        <p className="mt-4 text-lg text-muted">
          One payment of {offer.priceLabelLong} gives <span className="text-fg">{viewer.email}</span> lifetime access to all{' '}
          {stats.courses} courses and {stats.lessons} lessons.
        </p>
        <ul className="mt-8 space-y-3.5">
          {pricingIncludes.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Icons.check size={13} strokeWidth={2.4} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="card h-fit p-7">
        <div className="flex items-baseline justify-between border-b border-line pb-5">
          <span className="text-muted">Lifetime access</span>
          <span className="text-3xl font-semibold tracking-tight">
            {offer.priceLabel} <span className="text-sm font-normal text-muted">USD</span>
          </span>
        </div>
        <p className="mt-4 text-sm text-muted">One-time charge. No subscription. Taxes may apply where required.</p>
        {error && (
          <p role="alert" className="mt-5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
            {error}
          </p>
        )}
        {enabled ? (
          <form action="/api/checkout" method="post" className="mt-6">
            <SubmitButton size="lg" className="w-full" pendingText="Redirecting to Stripe…">
              Pay {offer.priceLabel} with Stripe <Icons.arrowRight size={18} />
            </SubmitButton>
          </form>
        ) : (
          !error && (
            <p role="status" className="mt-6 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              {errors.unavailable}
            </p>
          )
        )}
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-subtle">
          <Icons.shield size={14} className="mt-0.5 shrink-0" />
          You&apos;ll pay on Stripe&apos;s secure page. We never see or store your card details. {refundPolicy.summary}
        </p>
        <p className="mt-3 text-xs text-subtle">
          By purchasing you agree to the <Link href="/terms" className="underline">Terms</Link> and{' '}
          <Link href="/refunds" className="underline">Refund Policy</Link>.
        </p>
      </div>
    </div>
  );
}
