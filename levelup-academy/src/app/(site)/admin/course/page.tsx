import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AdminCourse } from '@/components/admin/admin-views';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default function Page() {
  return (
    <Suspense>
      <AdminCourse />
    </Suspense>
  );
}
