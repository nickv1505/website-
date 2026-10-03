import type { Metadata } from 'next';
import Link from 'next/link';

import { LegalPage } from '@/components/site/legal-page';
import { offer, site } from '@/config/site';

export const metadata: Metadata = { title: 'Terms and Conditions' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="October 3, 2026">
      <p>
        These Terms govern your use of {site.name} (the &quot;Platform&quot;), operated by {site.legalName}. By creating an account
        or purchasing access, you agree to these Terms.
      </p>
      <h2>1. The service</h2>
      <p>
        The Platform provides online educational courses. A one-time payment of {offer.priceLabelLong} grants your account
        access to every course, module, lesson and resource included in the library (&quot;Lifetime Access&quot;). There are no
        subscriptions or recurring charges.
      </p>
      <h2>2. Lifetime access</h2>
      <p>
        &quot;Lifetime&quot; means for as long as the Platform operates and offers the library. We may update, reorganise, add or
        retire content to keep it accurate and useful. Future updates to the included library are provided while the
        Platform continues to provide them. If we ever plan to shut down the Platform, we will make reasonable efforts to
        give notice.
      </p>
      <h2>3. Accounts</h2>
      <ul>
        <li>You must provide accurate information and keep your password secure.</li>
        <li>Access is for one person and is non-transferable. Do not share your login.</li>
        <li>We may suspend accounts that breach these Terms, such as account sharing or redistribution of content.</li>
      </ul>
      <h2>4. Payments</h2>
      <p>
        Payments are processed by Stripe. We do not receive or store your full card details. Prices are in US dollars and
        taxes may apply where required. Access is granted after the payment is confirmed by our payment processor.
      </p>
      <h2>5. Refunds</h2>
      <p>
        Refunds are governed by our <Link href="/refunds">Refund Policy</Link>. A refunded purchase removes Lifetime Access.
      </p>
      <h2>6. Intellectual property</h2>
      <p>
        All course content is owned by {site.name} or its licensors. You may use templates and worksheets for your own
        personal or business use, but you may not copy, resell, publish or redistribute the course content.
      </p>
      <h2>7. Educational purpose; no guarantees</h2>
      <p>
        The Platform is educational. We do not guarantee income, business success, investment returns, clients, sales or
        employment. Trading and investing involve risk of loss. Nothing on the Platform is financial, legal, tax or other
        professional advice. See the <Link href="/disclaimer">Disclaimer</Link>.
      </p>
      <h2>8. Third-party tools</h2>
      <p>
        Lessons reference third-party tools and services. We do not control them, and their terms, prices and availability
        may change.
      </p>
      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, our total liability relating to the Platform is limited to the amount you
        paid for access. Nothing in these Terms limits rights you have under applicable consumer protection laws.
      </p>
      <h2>10. Changes</h2>
      <p>We may update these Terms. Material changes will be posted on this page with a new &quot;last updated&quot; date.</p>
      <h2>11. Governing law</h2>
      <p>These Terms are governed by the laws of {site.jurisdiction}, unless your local consumer laws provide otherwise.</p>
      <h2>12. Contact</h2>
      <p>
        Questions: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
      </p>
    </LegalPage>
  );
}
