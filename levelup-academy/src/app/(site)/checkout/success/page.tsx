import type { Metadata } from 'next';

import { CheckoutSuccessView } from '@/components/views/checkout-view';

export const metadata: Metadata = { title: 'Payment received', robots: { index: false } };

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessView />;
}
