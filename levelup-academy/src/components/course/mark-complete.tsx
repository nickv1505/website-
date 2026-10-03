'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { buttonClass } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { setLessonComplete } from '@/lib/data';

/** Saves progress. The database only accepts it for lessons the user can open. */
export function MarkComplete({
  userId,
  lessonId,
  initial,
  nextHref,
  onChange,
}: {
  userId: string;
  lessonId: string;
  initial: boolean;
  nextHref?: string | null;
  onChange?: (complete: boolean) => void;
}) {
  const [override, setOverride] = useState<boolean | null>(null);
  const complete = override ?? initial;
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle() {
    const target = !complete;
    setError(null);
    start(async () => {
      try {
        await setLessonComplete(userId, lessonId, target);
        setOverride(target);
        onChange?.(target);
        if (target && nextHref) router.push(nextHref);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save your progress.');
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button type="button" onClick={toggle} disabled={pending} aria-pressed={complete} className={buttonClass(complete ? 'secondary' : 'primary', 'md')}>
        {pending ? (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : complete ? (
          <Icons.checkCircle size={18} className="text-accent" />
        ) : (
          <Icons.check size={18} />
        )}
        {complete ? 'Completed' : nextHref ? 'Mark as complete & continue' : 'Mark as complete'}
      </button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
