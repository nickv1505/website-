import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthShell } from '@/components/site/auth-shell';
import { SignUpForm } from '@/components/site/auth-forms';
import { offer } from '@/config/site';
import { getViewer, safeNext } from '@/lib/auth';

export const metadata: Metadata = { title: 'Create your account', robots: { index: false } };

export default async function SignUpPage({ searchParams }: PageProps<'/signup'>) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getViewer()) redirect(next);
  return (
    <AuthShell
      title="Create your account"
      subtitle={next === '/checkout' ? `Next, you'll complete your one-time ${offer.priceLabelLong} payment with Stripe.` : 'Free to create. Read the preview lessons and track your progress.'}
      footer={
        <>
          Already have an account?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-fg underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm next={next} />
    </AuthShell>
  );
}
