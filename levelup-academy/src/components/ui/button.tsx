import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink hover:bg-accent-strong shadow-[0_0_0_1px_rgb(61_252_143/.35),0_10px_30px_-12px_rgb(61_252_143/.55)] hover:shadow-[0_0_0_1px_rgb(61_252_143/.5),0_14px_40px_-12px_rgb(61_252_143/.7)]',
  secondary: 'bg-surface-2 text-fg border border-line-strong hover:border-white/25 hover:bg-surface-3',
  ghost: 'text-muted hover:text-fg hover:bg-white/5',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.95rem] gap-2',
  lg: 'h-13 px-7 text-base gap-2.5',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `group inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function ButtonLink({
  href,
  variant,
  size,
  className = '',
  children,
  ...rest
}: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  'href' | 'className'
>) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className = '',
  ...rest
}: { variant?: Variant; size?: Size } & ComponentProps<'button'>) {
  return <button className={buttonClass(variant, size, className)} {...rest} />;
}
