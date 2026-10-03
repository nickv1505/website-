import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export const Icons = {
  spark: (p: IconProps) => (
    <svg {...base(p)}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="3.2" /></svg>
  ),
  briefcase: (p: IconProps) => (
    <svg {...base(p)}><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></svg>
  ),
  code: (p: IconProps) => (
    <svg {...base(p)}><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14" /></svg>
  ),
  cart: (p: IconProps) => (
    <svg {...base(p)}><path d="M3 4h2.2l2.3 11h10.2l2-7.5H6.4" /><circle cx="9" cy="19.5" r="1.3" /><circle cx="16.5" cy="19.5" r="1.3" /></svg>
  ),
  chart: (p: IconProps) => (
    <svg {...base(p)}><path d="M4 20V4M4 20h16" /><path d="M8 16v-3M12 16V9M16 16v-5M20 16V7" /></svg>
  ),
  play: (p: IconProps) => (
    <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10.5 9.5 4 2.5-4 2.5z" fill="currentColor" stroke="none" /></svg>
  ),
  megaphone: (p: IconProps) => (
    <svg {...base(p)}><path d="M4 10v4a1 1 0 0 0 1 1h2l8 4V5L7 9H5a1 1 0 0 0-1 1Z" /><path d="M18.5 9.5a3.5 3.5 0 0 1 0 5M8 15l1 4.5" /></svg>
  ),
  rocket: (p: IconProps) => (
    <svg {...base(p)}><path d="M14 4c3.5.3 5.7 2.5 6 6-1.6 3.8-4.6 6.5-8.3 8l-3.7-3.7C9.5 10.6 12.2 5.6 14 4Z" /><circle cx="15" cy="9" r="1.6" /><path d="M8 14.3 5 15l-1 4 4-1 .7-3M7.5 11H4.8L7 8.6h3" /></svg>
  ),
  check: (p: IconProps) => <svg {...base(p)}><path d="m5 12.5 4.2 4L19 7" /></svg>,
  checkCircle: (p: IconProps) => (
    <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="m8 12.3 2.8 2.7L16.2 9.5" /></svg>
  ),
  lock: (p: IconProps) => (
    <svg {...base(p)}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
  ),
  arrowRight: (p: IconProps) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  arrowLeft: (p: IconProps) => <svg {...base(p)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>,
  chevronDown: (p: IconProps) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>,
  clock: (p: IconProps) => <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>,
  book: (p: IconProps) => (
    <svg {...base(p)}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20" /></svg>
  ),
  file: (p: IconProps) => (
    <svg {...base(p)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
  ),
  download: (p: IconProps) => <svg {...base(p)}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>,
  link: (p: IconProps) => (
    <svg {...base(p)}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
  ),
  search: (p: IconProps) => <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>,
  menu: (p: IconProps) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>,
  close: (p: IconProps) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>,
  infinity: (p: IconProps) => (
    <svg {...base(p)}><path d="M12 12c-2-2.7-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.3 5.5-4Zm0 0c2 2.7 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.3-5.5 4Z" /></svg>
  ),
  layers: (p: IconProps) => (
    <svg {...base(p)}><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></svg>
  ),
  user: (p: IconProps) => <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  shield: (p: IconProps) => <svg {...base(p)}><path d="M12 3 4.5 6v6c0 4.2 3.1 7.7 7.5 9 4.4-1.3 7.5-4.8 7.5-9V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></svg>,
  phone: (p: IconProps) => <svg {...base(p)}><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>,
  refresh: (p: IconProps) => <svg {...base(p)}><path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20v-4h-4" /></svg>,
  edit: (p: IconProps) => <svg {...base(p)}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /></svg>,
  logout: (p: IconProps) => <svg {...base(p)}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l4-4-4-4M14 12H4" /></svg>,
};

export type IconName = keyof typeof Icons;

const COURSE_ICONS = ['spark', 'briefcase', 'code', 'cart', 'chart', 'play', 'megaphone', 'rocket'] as const;

export function CourseIcon({ name, size = 22 }: { name: string; size?: number }) {
  const key = (COURSE_ICONS as readonly string[]).includes(name) ? (name as IconName) : 'layers';
  const Icon = Icons[key];
  return <Icon size={size} />;
}
