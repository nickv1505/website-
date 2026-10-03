import Link from 'next/link';

import { site } from '@/config/site';

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#14171b" />
      <rect x=".5" y=".5" width="31" height="31" rx="8.5" fill="none" stroke="rgb(255 255 255 / .12)" />
      <path d="M9 20.5 16 14l7 6.5" fill="none" stroke="#3dfc8f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 14.5 16 8l7 6.5" fill="none" stroke="#f4f5f6" strokeOpacity=".55" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 font-semibold tracking-[-0.02em]" aria-label={`${site.name} home`}>
      <LogoMark />
      <span className="text-[1.05rem]">
        {site.name.split(' ')[0]}
        <span className="text-muted"> {site.name.split(' ').slice(1).join(' ')}</span>
      </span>
    </Link>
  );
}
