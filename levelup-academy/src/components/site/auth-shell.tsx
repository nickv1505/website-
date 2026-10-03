import type { ReactNode } from 'react';

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative flex flex-1 items-center justify-center px-5 py-16">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <div className="w-full max-w-md">
        <div className="card p-7 sm:p-9">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}
