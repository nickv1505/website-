import type { Metadata } from 'next';
import Link from 'next/link';

import { ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Contact', description: `Contact ${site.name} support.` };

export default function ContactPage() {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em]">How can we help?</h1>
      <p className="mt-4 text-lg text-muted">
        Questions about your account, purchase, refunds or the courses? Email us and include the email address you used to sign up.
      </p>
      <div className="card mt-10 p-7 sm:p-9">
        <p className="eyebrow">Email support</p>
        <a href={`mailto:${site.supportEmail}`} className="mt-3 block break-all text-2xl font-semibold tracking-tight hover:text-accent">
          {site.supportEmail}
        </a>
        <p className="mt-3 text-sm text-muted">We aim to reply within 2 business days.</p>
        <ButtonLink href={`mailto:${site.supportEmail}?subject=${encodeURIComponent(`${site.name} support`)}`} className="mt-7">
          <Icons.arrowRight size={16} /> Send an email
        </ButtonLink>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/forgot-password" className="card card-hover p-6">
          <p className="font-semibold">Forgot your password?</p>
          <p className="mt-1 text-sm text-muted">Reset it yourself in under a minute.</p>
        </Link>
        <Link href="/refunds" className="card card-hover p-6">
          <p className="font-semibold">Refund requests</p>
          <p className="mt-1 text-sm text-muted">Read the refund policy and how to ask.</p>
        </Link>
      </div>
    </div>
  );
}
