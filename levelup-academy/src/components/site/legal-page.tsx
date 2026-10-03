import type { ReactNode } from 'react';

/** Shared layout for legal pages. All copy is plain JSX so it can be edited without code knowledge. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="container-page max-w-3xl py-14 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em]">{title}</h1>
      <p className="mt-2 text-sm text-subtle">Last updated: {updated}</p>
      <div
        role="note"
        className="mt-8 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
      >
        Template: review before launch. This page is a starting point, not legal advice. Have it reviewed by a qualified
        professional for your jurisdiction (including Canadian privacy law, consumer protection rules and tax treatment).
      </div>
      <div className="prose-lesson mt-10">{children}</div>
    </div>
  );
}
