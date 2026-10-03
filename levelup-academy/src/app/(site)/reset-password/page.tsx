import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ResetPasswordView } from '@/components/site/auth-pages';

export const metadata: Metadata = { title: 'Choose a new password', robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordView />
    </Suspense>
  );
}
