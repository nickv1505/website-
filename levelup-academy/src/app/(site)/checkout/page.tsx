import type { Metadata } from 'next';

import { CheckoutView } from '@/components/views/checkout-view';
import { staticCatalog } from '@/lib/catalog-static';

export const metadata: Metadata = { title: 'Get lifetime access', robots: { index: false } };

export default function CheckoutPage() {
  return <CheckoutView initial={staticCatalog()} />;
}
