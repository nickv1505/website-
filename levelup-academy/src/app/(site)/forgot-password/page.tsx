import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ForgotPasswordView } from '@/components/site/auth-pages';

export const metadata: Metadata = { title: 'Reset your password', robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <ForgotPasswordView />
    </Suspense>
  );
}
