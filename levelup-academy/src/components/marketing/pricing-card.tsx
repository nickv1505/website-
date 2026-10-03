import { ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { offer } from '@/config/site';

export const pricingIncludes = [
  'All available courses',
  'All included modules and lessons',
  'Downloadable learning resources where available',
  'Lifetime access to purchased content',
  'Future updates to the included course library, as long as the platform continues to provide them',
];

export function PricingCard({ ctaHref = '/checkout', ctaLabel = `Unlock Everything: ${offer.priceLabel}` }: { ctaHref?: string; ctaLabel?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-px rounded-[1.6rem] bg-gradient-to-b from-accent/40 via-white/10 to-transparent" aria-hidden />
      <div className="relative rounded-[1.55rem] bg-surface p-7 sm:p-10">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Lifetime access</p>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">One-time payment</span>
        </div>
        <p className="mt-6 flex items-end gap-2">
          <span className="text-6xl font-semibold tracking-[-0.04em]">{offer.priceLabel}</span>
          <span className="mb-2 text-sm text-muted">USD</span>
        </p>
        <p className="mt-2 text-sm text-muted">Pay once. No subscription, no recurring fees, no per-course charges.</p>
        <ul className="mt-8 space-y-3.5">
          {pricingIncludes.map((item) => (
            <li key={item} className="flex gap-3 text-[0.95rem]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Icons.check size={13} strokeWidth={2.4} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <ButtonLink href={ctaHref} size="lg" className="mt-9 w-full">
          {ctaLabel} <Icons.arrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-subtle">
          <Icons.shield size={14} /> Secure checkout by Stripe. We never see your card details.
        </p>
      </div>
    </div>
  );
}
