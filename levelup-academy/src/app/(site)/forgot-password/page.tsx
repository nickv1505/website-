import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthShell } from '@/components/site/auth-shell';
import { ForgotPasswordForm } from '@/components/site/auth-forms';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure link to choose a new password."
      footer={<Link href="/login" className="text-fg underline underline-offset-4">Back to sign in</Link>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
