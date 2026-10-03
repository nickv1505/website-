'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress';
import type { CourseWithModules } from '@/lib/types';

export function LessonSidebar({
  course,
  currentLessonId,
  completed,
  unlocked,
  percent,
}: {
  course: CourseWithModules;
  currentLessonId: string;
  completed: string[];
  unlocked: string[];
  percent: number | null;
}) {
  const [open, setOpen] = useState(false);
  const currentRef = useRef<HTMLAnchorElement>(null);
  const done = new Set(completed);
  const canOpen = new Set(unlocked);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest' });
  }, [currentLessonId]);

  return (
    <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7.5rem)]">
      <div className="card flex h-full flex-col overflow-hidden">
        <div className="border-b border-line p-4">
          <Link href={`/courses/${course.slug}`} className="text-sm font-semibold hover:text-accent">
            {course.title}
          </Link>
          {percent !== null && (
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between text-xs text-muted">
                <span>Progress</span>
                <span className="text-fg">{percent}%</span>
              </div>
              <ProgressBar percent={percent} label="Course progress" />
            </div>
          )}
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-between rounded-lg border border-line px-3 py-2 text-sm text-muted lg:hidden"
            aria-expanded={open}
            aria-controls="lesson-nav"
            onClick={() => setOpen((v) => !v)}
          >
            Course contents
            <Icons.chevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <nav id="lesson-nav" aria-label="Lessons" className={`${open ? 'block' : 'hidden'} max-h-[60vh] overflow-y-auto p-2 lg:block lg:max-h-none lg:flex-1`}>
          {course.modules.map((m, i) => (
            <div key={m.id} className="py-2">
              <p className="px-2 pb-1 text-[11px] font-medium uppercase tracking-[.12em] text-subtle">
                Module {i + 1}
              </p>
              <ul>
                {m.lessons.map((l) => {
                  const current = l.id === currentLessonId;
                  return (
                    <li key={l.id}>
                      <Link
                        ref={current ? currentRef : undefined}
                        href={`/courses/${course.slug}/${l.slug}`}
                        aria-current={current ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                        className={`flex items-start gap-2.5 rounded-lg px-2 py-2 text-[13px] leading-snug transition-colors ${
                          current ? 'bg-white/7 text-fg' : 'text-muted hover:bg-white/4 hover:text-fg'
                        }`}
                      >
                        <span className="mt-px shrink-0">
                          {done.has(l.id) ? (
                            <Icons.checkCircle size={16} className="text-accent" />
                          ) : canOpen.has(l.id) ? (
                            <span className="mt-1 block size-2 rounded-full border border-current opacity-60" />
                          ) : (
                            <Icons.lock size={15} className="opacity-60" />
                          )}
                        </span>
                        <span>{l.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
