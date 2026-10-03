import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthCallbackView } from '@/components/site/auth-pages';

export const metadata: Metadata = { title: 'Signing in', robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <AuthCallbackView />
    </Suspense>
  );
}
