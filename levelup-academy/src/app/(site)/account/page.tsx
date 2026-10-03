import type { Metadata } from 'next';

import { signOut } from '@/app/actions/auth';
import { NewPasswordForm, ProfileForm } from '@/components/site/auth-forms';
import { ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { SubmitButton } from '@/components/ui/submit-button';
import { offer, site } from '@/config/site';
import { requireViewer } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Account settings', robots: { index: false } };

export default async function AccountPage() {
  const viewer = await requireViewer('/account');
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount_total, currency, status, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <p className="eyebrow">Account</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Account settings</h1>
      <p className="mt-2 text-muted">{viewer.email}</p>

      <section className="card mt-10 p-6 sm:p-8">
        <h2 className="text-lg font-semibold">Access</h2>
        {viewer.hasAccess ? (
          <p className="mt-3 flex items-center gap-2 text-accent">
            <Icons.checkCircle size={18} /> Lifetime access active. Every course is unlocked.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">You don&apos;t have lifetime access yet.</p>
            <ButtonLink href="/checkout" size="sm">
              Unlock everything: {offer.priceLabel}
            </ButtonLink>
          </div>
        )}
        {payments && payments.length > 0 && (
          <ul className="mt-6 divide-y divide-line border-t border-line text-sm">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <span className="text-muted">{new Date(p.created_at).toLocaleDateString('en-CA', { dateStyle: 'medium' })}</span>
                <span>
                  {(p.amount_total / 100).toFixed(2)} {p.currency.toUpperCase()}
                </span>
                <span className={p.status === 'paid' ? 'text-accent' : 'text-muted'}>{p.status}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-subtle">Receipts are emailed by Stripe. Need help? Contact {site.supportEmail}.</p>
      </section>

      <section className="card mt-6 p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Profile</h2>
        <ProfileForm fullName={viewer.fullName} />
      </section>

      <section className="card mt-6 p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Change password</h2>
        <NewPasswordForm />
      </section>

      <section className="mt-6 flex items-center justify-between rounded-[1.25rem] border border-line p-6">
        <p className="text-sm text-muted">Sign out of this device.</p>
        <form action={signOut}>
          <SubmitButton variant="secondary" size="sm" pendingText="Signing out…">
            <Icons.logout size={16} /> Sign out
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
