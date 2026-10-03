import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SignUpView } from '@/components/site/auth-pages';

export const metadata: Metadata = { title: 'Create your account', robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <SignUpView />
    </Suspense>
  );
}
