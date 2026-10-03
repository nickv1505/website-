'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Icons } from '@/components/ui/icons';

type NavLink = { href: string; label: string };

export function MobileNav({ links, cta }: { links: NavLink[]; cta: NavLink & { secondary?: NavLink } }) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so it closes on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((typeof value === 'function' ? value(open) : value) ? pathname : null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="grid size-11 place-items-center rounded-full border border-line-strong text-fg"
      >
        {open ? <Icons.close /> : <Icons.menu />}
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col justify-between border-t border-line bg-bg/95 px-5 pt-4 pb-8 backdrop-blur-xl">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-4 text-2xl font-semibold tracking-tight">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            {cta.secondary && (
              <Link href={cta.secondary.href} onClick={() => setOpen(false)} className="flex h-12 items-center justify-center rounded-full border border-line-strong font-semibold">
                {cta.secondary.label}
              </Link>
            )}
            <Link href={cta.href} onClick={() => setOpen(false)} className="flex h-12 items-center justify-center rounded-full bg-accent font-semibold text-accent-ink">
              {cta.label}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
