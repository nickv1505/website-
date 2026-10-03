import type { Metadata } from 'next';
import Link from 'next/link';

import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = { title: 'Admin', robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  await requireAdmin(); // server-side role check from the database
  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">Admin</span>
          <Link href="/admin" className="font-semibold hover:text-accent">Content manager</Link>
        </div>
        <Link href="/courses" className="text-sm text-muted hover:text-fg">View public library →</Link>
      </div>
      {children}
    </div>
  );
}
