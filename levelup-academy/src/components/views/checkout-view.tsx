'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { pricingIncludes } from '@/components/marketing/pricing-card';
import { buttonClass, ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { PageLoading } from '@/components/views/dashboard-view';
import { offer, refundPolicy, site } from '@/config/site';
import { useAuth } from '@/lib/auth';
import { catalogStats } from '@/lib/catalog-utils';
import { startCheckout, useCatalog } from '@/lib/data';
import type { CourseWithModules } from '@/lib/types';

const errors: Record<string, string> = {
  not_configured: 'Payments are not configured yet. The site owner needs to add Stripe keys before purchases can be made.',
  not_deployed: 'Payments are not set up yet. The site owner needs to add the checkout function in Supabase.',
  unauthorized: 'Your session expired. Please sign in again.',
  stripe: 'We could not start checkout. Please try again in a moment.',
};

export function CheckoutView({ initial }: { initial: CourseWithModules[] }) {
  const { loading, viewer } = useAuth();
  const router = useRouter();
  const stats = catalogStats(useCatalog(initial).catalog);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!viewer) router.replace('/signup?next=/checkout');
    else if (viewer.hasAccess) router.replace('/dashboard');
  }, [loading, viewer, router]);

  if (loading || !viewer || viewer.hasAccess) return <PageLoading />;

  async function pay() {
    setPending(true);
    setError(null);
    const res = await startCheckout();
    if ('url' in res) {
      window.location.assign(res.url); // Stripe's secure checkout page
      return;
    }
    setPending(false);
    if ('alreadyPurchased' in res) router.replace('/dashboard');
    else setError(errors[res.error] ?? errors.stripe);
  }

  return (
    <div className="container-page grid max-w-5xl gap-10 py-14 sm:py-20 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Unlock the full library</h1>
        <p className="mt-4 text-lg text-muted">
          One payment of {offer.priceLabelLong} gives <span className="text-fg">{viewer.email}</span> lifetime access to all {stats.courses} courses and{' '}
          {stats.lessons} lessons.
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
        <button type="button" onClick={pay} disabled={pending} aria-busy={pending} className={buttonClass('primary', 'lg', 'mt-6 w-full')}>
          {pending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden /> Redirecting to Stripe…
            </>
          ) : (
            <>
              Pay {offer.priceLabel} with Stripe <Icons.arrowRight size={18} />
            </>
          )}
        </button>
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-subtle">
          <Icons.shield size={14} className="mt-0.5 shrink-0" />
          You&apos;ll pay on Stripe&apos;s secure page. We never see or store your card details. {refundPolicy.summary}
        </p>
        <p className="mt-3 text-xs text-subtle">
          By purchasing you agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/refunds" className="underline">Refund Policy</Link>.
        </p>
      </div>
    </div>
  );
}

/**
 * After Stripe redirects back. This page NEVER grants access itself: it only
 * re-reads the entitlement that the verified webhook writes to the database.
 */
export function CheckoutSuccessView() {
  const { loading, viewer, refresh } = useAuth();
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const max = 20;

  useEffect(() => {
    if (!loading && !viewer) router.replace('/login?next=/checkout/success');
  }, [loading, viewer, router]);

  useEffect(() => {
    if (loading || !viewer || viewer.hasAccess || attempts >= max) return;
    const t = setTimeout(async () => {
      await refresh();
      setAttempts((a) => a + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [loading, viewer, attempts, refresh]);

  if (loading || !viewer) return <PageLoading />;

  return (
    <div className="container-page flex max-w-xl flex-1 flex-col items-center justify-center py-20 text-center">
      {viewer.hasAccess ? (
        <>
          <span className="grid size-16 place-items-center rounded-full bg-accent/10 text-accent">
            <Icons.checkCircle size={32} />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">You&apos;re in. Welcome to {site.name}.</h1>
          <p className="mt-3 text-muted">
            Your lifetime access is active. Every course is now unlocked in your dashboard. A receipt has been sent to {viewer.email}.
          </p>
          <ButtonLink href="/dashboard" size="lg" className="mt-8">
            Go to my dashboard <Icons.arrowRight size={18} />
          </ButtonLink>
        </>
      ) : (
        <>
          <span className="grid size-16 place-items-center rounded-full border border-line-strong text-muted">
            <Icons.clock size={30} />
          </span>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">Finishing up your purchase</h1>
          <p className="mt-3 text-muted">
            We unlock your account as soon as Stripe confirms the payment, usually within a few seconds. Some payment methods take longer to clear.
          </p>
          <div className="mt-8">
            {attempts >= max ? (
              <p className="text-sm text-muted">
                This is taking longer than usual. Refresh the page in a minute. If access still doesn&apos;t appear, contact {site.supportEmail} with the email
                you used at checkout.
              </p>
            ) : (
              <p className="flex items-center justify-center gap-2 text-sm text-muted" role="status">
                <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden /> Confirming your payment with Stripe…
              </p>
            )}
          </div>
          <ButtonLink href="/dashboard" variant="secondary" className="mt-8">Go to dashboard</ButtonLink>
        </>
      )}
    </div>
  );
}
