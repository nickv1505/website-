'use client';
import Link from 'next/link';

import { ButtonLink } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { offer } from '@/config/site';
import { useAuth } from '@/lib/auth';

import { MobileNav } from './mobile-nav';

const links = [
  { href: '/courses', label: 'Courses' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const { viewer, loading } = useAuth();
  const cta = viewer?.hasAccess ? { href: '/dashboard', label: 'My Dashboard' } : { href: '/checkout', label: 'Get Full Access' };
  const accountLinks = viewer
    ? [
        ...(viewer.hasAccess ? [] : [{ href: '/dashboard', label: 'Dashboard' }]),
        { href: '/account', label: 'Account' },
        ...(viewer.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
      ]
    : [{ href: '/login', label: 'Sign In' }];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/75 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className={`hidden items-center gap-2 transition-opacity md:flex ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {accountLinks.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
          <ButtonLink href={cta.href} size="sm">
            {cta.label}
            {!viewer?.hasAccess && <span className="hidden font-normal opacity-70 lg:inline">· {offer.priceLabel}</span>}
          </ButtonLink>
        </div>
        <MobileNav links={[...links, ...accountLinks]} cta={cta} />
      </div>
    </header>
  );
}
