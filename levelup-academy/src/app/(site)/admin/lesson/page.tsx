import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AdminLesson } from '@/components/admin/admin-views';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <AdminLesson />
    </Suspense>
  );
}
