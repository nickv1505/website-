'use client';
import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

import { buttonClass } from './button';

export function SubmitButton({
  children,
  pendingText = 'Please wait…',
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  children: ReactNode;
  pendingText?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass(variant, size, className)}>
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
