'use client';
import { useTransition } from 'react';

import { Icons } from '@/components/ui/icons';

/** Small button that runs an admin action, with an optional confirmation. */
export function ActionButton({
  action,
  label,
  confirmText,
  icon,
  danger,
  onDone,
}: {
  action: () => Promise<void>;
  onDone?: () => void;
  label: string;
  confirmText?: string;
  icon?: 'up' | 'down' | 'delete';
  danger?: boolean;
}) {
  const [pending, start] = useTransition();
  const Icon = icon === 'up' ? Icons.arrowRight : icon === 'down' ? Icons.arrowRight : null;
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        start(async () => {
          await action();
          onDone?.();
        });
      }}
      className={`grid size-8 place-items-center rounded-lg border text-xs transition-colors disabled:opacity-40 ${
        danger ? 'border-danger/30 text-danger hover:bg-danger/10' : 'border-line text-muted hover:border-line-strong hover:text-fg'
      }`}
    >
      {icon === 'delete' ? <Icons.close size={14} /> : Icon ? <Icon size={14} className={icon === 'up' ? '-rotate-90' : 'rotate-90'} /> : label}
    </button>
  );
}
