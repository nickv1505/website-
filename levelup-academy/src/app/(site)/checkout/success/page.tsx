import type { Metadata } from 'next';

import { AccessPoller } from '@/components/site/access-poller';
import { ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { site } from '@/config/site';
import { requireViewer } from '@/lib/auth';

export const metadata: Metadata = { title: 'Payment received', robots: { index: false } };

/**
 * Shown after Stripe redirects back. This page NEVER grants access itself: it
 * only reads the entitlement that the verified webhook writes to the database.
 */
export default async function CheckoutSuccessPage() {
  const viewer = await requireViewer('/checkout/success');

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
            We unlock your account as soon as Stripe confirms the payment, usually within a few seconds. Some payment
            methods take longer to clear.
          </p>
          <div className="mt-8">
            <AccessPoller />
          </div>
          <ButtonLink href="/dashboard" variant="secondary" className="mt-8">
            Go to dashboard
          </ButtonLink>
        </>
      )}
    </div>
  );
}
