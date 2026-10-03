import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthShell } from '@/components/site/auth-shell';
import { NewPasswordForm } from '@/components/site/auth-forms';
import { getViewer } from '@/lib/auth';

export const metadata: Metadata = { title: 'Choose a new password', robots: { index: false } };

export default async function ResetPasswordPage() {
  const viewer = await getViewer();
  if (!viewer) {
    return (
      <AuthShell title="Link expired" subtitle="This password reset link is invalid or has expired.">
        <Link href="/forgot-password" className="text-accent underline underline-offset-4">Request a new link</Link>
      </AuthShell>
    );
  }
  return (
    <AuthShell
      title="Choose a new password"
      subtitle={`Signed in as ${viewer.email}`}
      footer={<Link href="/dashboard" className="text-fg underline underline-offset-4">Go to dashboard</Link>}
    >
      <NewPasswordForm />
    </AuthShell>
  );
}
