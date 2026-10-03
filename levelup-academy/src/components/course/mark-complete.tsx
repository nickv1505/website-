'use client';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { setLessonComplete } from '@/app/actions/progress';
import { buttonClass } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

export function MarkComplete({
  lessonId,
  initial,
  path,
  nextHref,
}: {
  lessonId: string;
  initial: boolean;
  path: string;
  nextHref?: string | null;
}) {
  const [complete, setComplete] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function toggle() {
    const target = !complete;
    setError(null);
    start(async () => {
      const res = await setLessonComplete({ lessonId, complete: target, path });
      if (res.ok) {
        setComplete(res.complete);
        if (res.complete && nextHref) router.push(nextHref);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={complete}
        className={buttonClass(complete ? 'secondary' : 'primary', 'md')}
      >
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
