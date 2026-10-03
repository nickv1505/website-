import Link from 'next/link';

import { Logo } from '@/components/ui/logo';
import { site } from '@/config/site';

const groups = [
  {
    title: 'Platform',
    links: [
      { href: '/courses', label: 'Course Library' },
      { href: '/#pricing', label: 'Pricing' },
      { href: '/login', label: 'Sign In' },
      { href: '/dashboard', label: 'Student Dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/terms', label: 'Terms and Conditions' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/refunds', label: 'Refund Policy' },
      { href: '/disclaimer', label: 'Disclaimer' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface/40">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Practical courses on AI, freelancing, websites, e-commerce, marketing and more. One payment unlocks the
            full library for life.
          </p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="text-sm font-semibold">{g.title}</h2>
            <ul className="mt-4 space-y-3">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-page flex flex-col gap-3 border-t border-line py-8 text-xs leading-relaxed text-subtle md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <p className="max-w-2xl md:text-right">
          Educational content only. We do not guarantee income, business results, investment returns or employment.
          Trading and investing involve risk of loss.
        </p>
      </div>
    </footer>
  );
}
