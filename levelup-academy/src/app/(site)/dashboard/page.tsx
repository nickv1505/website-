import type { Metadata } from 'next';

import { DashboardView } from '@/components/views/dashboard-view';
import { staticCatalog } from '@/lib/catalog-static';

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false } };

export default function DashboardPage() {
  return <DashboardView initial={staticCatalog()} />;
}
