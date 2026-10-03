'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Refreshes the page every few seconds while we wait for the Stripe webhook. */
export function AccessPoller({ intervalMs = 3000, maxAttempts = 20 }: { intervalMs?: number; maxAttempts?: number }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  useEffect(() => {
    if (attempts >= maxAttempts) return;
    const t = setTimeout(() => {
      router.refresh();
      setAttempts((a) => a + 1);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [attempts, intervalMs, maxAttempts, router]);

  return attempts >= maxAttempts ? (
    <p className="text-sm text-muted">
      This is taking longer than usual. Refresh the page in a minute. If access still doesn&apos;t appear, contact support with
      the email you used at checkout.
    </p>
  ) : (
    <p className="flex items-center justify-center gap-2 text-sm text-muted" role="status">
      <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden /> Confirming your
      payment with Stripe…
    </p>
  );
}
