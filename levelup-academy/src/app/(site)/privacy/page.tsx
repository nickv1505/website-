import type { Metadata } from 'next';

import { LegalPage } from '@/components/site/legal-page';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 3, 2026">
      <p>
        This policy explains how {site.legalName} collects, uses and protects personal information when you use {site.name}.
        We aim to comply with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable
        provincial privacy laws.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information:</strong> your name, email address and an encrypted password (managed by our authentication provider, Supabase).</li>
        <li><strong>Purchase information:</strong> payment status, amount, currency and Stripe identifiers. Card details are handled by Stripe and never stored by us.</li>
        <li><strong>Learning activity:</strong> lessons you open and complete, so we can show your progress.</li>
        <li><strong>Messages:</strong> anything you send us by email.</li>
        <li><strong>Technical data:</strong> basic logs (such as IP address and browser type) kept by our hosting providers for security.</li>
      </ul>
      <h2>How we use it</h2>
      <p>To provide your account and courses, process payments, save your progress, provide support, keep the Platform secure, and meet legal obligations. We do not sell your personal information.</p>
      <h2>Service providers</h2>
      <p>
        We use Supabase (database and authentication), Stripe (payments) and a hosting provider. These providers may process
        data outside Canada, including in the United States, where it may be subject to local laws.
      </p>
      <h2>Email</h2>
      <p>We send transactional emails (account confirmation, password resets, receipts). We will only send marketing emails with your consent, and every marketing email will include an unsubscribe link.</p>
      <h2>Retention</h2>
      <p>We keep account data while your account is active and purchase records as long as needed for legal, tax and accounting purposes.</p>
      <h2>Your rights</h2>
      <p>
        You can request access to, or correction of, your personal information, or ask us to delete your account, subject to
        legal record-keeping requirements. Contact <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
      </p>
      <h2>Security</h2>
      <p>We use encryption in transit, access controls and row-level security in our database. No system is perfectly secure, but we work to protect your information.</p>
      <h2>Contact</h2>
      <p>
        Privacy questions or complaints: <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. You may also contact the
        Office of the Privacy Commissioner of Canada.
      </p>
    </LegalPage>
  );
}
