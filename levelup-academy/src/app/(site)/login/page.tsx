import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AuthShell } from '@/components/site/auth-shell';
import { SignInForm } from '@/components/site/auth-forms';
import { getViewer, safeNext } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getViewer()) redirect(next);
  return (
    <AuthShell
      title="Welcome back"
      subtitle={sp.error === 'link' ? 'That link is invalid or has expired. Please try again.' : 'Sign in to continue learning.'}
      footer={
        <>
          New here?{' '}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-fg underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm next={next} />
    </AuthShell>
  );
}
