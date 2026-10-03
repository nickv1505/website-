import type { Metadata } from 'next';

import { LegalPage } from '@/components/site/legal-page';
import { offer, refundPolicy, site } from '@/config/site';

export const metadata: Metadata = { title: 'Refund Policy' };

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="October 3, 2026">
      <p>{refundPolicy.summary}</p>
      <h2>How to request a refund</h2>
      <ol>
        <li>Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> within {refundPolicy.days} days of your purchase.</li>
        <li>Use the email address on your account and include &quot;Refund request&quot; in the subject.</li>
        <li>Refunds are issued to the original payment method through Stripe. Your bank may take 5–10 business days to show it.</li>
      </ol>
      <h2>What happens to your access</h2>
      <p>When a refund is processed, Lifetime Access to the library is removed from your account automatically.</p>
      <h2>Duplicate charges and technical problems</h2>
      <p>If you were charged more than once, or paid but could not access the library, contact us and we will fix or refund it.</p>
      <h2>After {refundPolicy.days} days</h2>
      <p>
        Because the {offer.priceLabelLong} purchase gives immediate access to the entire library, requests after {refundPolicy.days} days are
        generally not eligible, except where required by law.
      </p>
      <p>This policy does not limit any rights you have under applicable consumer protection laws.</p>
    </LegalPage>
  );
}
