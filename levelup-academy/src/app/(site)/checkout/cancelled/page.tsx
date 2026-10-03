import type { Metadata } from 'next';

import { ButtonLink } from '@/components/ui/button';
import { offer } from '@/config/site';

export const metadata: Metadata = { title: 'Checkout cancelled', robots: { index: false } };

export default function CheckoutCancelledPage() {
  return (
    <div className="container-page flex max-w-xl flex-1 flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout cancelled</h1>
      <p className="mt-3 text-muted">No payment was taken. You can keep browsing the courses and free lessons, and come back whenever you&apos;re ready.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/checkout">Try again: {offer.priceLabel}</ButtonLink>
        <ButtonLink href="/courses" variant="secondary">
          Browse courses
        </ButtonLink>
      </div>
    </div>
  );
}
