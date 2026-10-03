import Link from 'next/link';

import { CourseIcon, Icons } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress';
import type { CourseWithModules } from '@/lib/types';

export function CourseCard({
  course,
  href,
  progress,
  cta = 'Explore course',
}: {
  course: CourseWithModules;
  href?: string;
  progress?: { percent: number; done: number; total: number };
  cta?: string;
}) {
  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const minutes = course.modules.reduce((n, m) => n + m.lessons.reduce((t, l) => t + l.duration_minutes, 0), 0);
  const target = href ?? `/courses/${course.slug}`;

  return (
    <article className="card card-hover group relative flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-accent shadow-[inset_0_1px_0_rgb(255_255_255/.06)]">
          <CourseIcon name={course.icon} />
        </span>
        <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium uppercase tracking-[.12em] text-subtle">
          {course.category}
        </span>
      </div>
      <h3 className="mt-6 text-lg font-semibold tracking-tight">
        <Link href={target} className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none">
          {course.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{course.subtitle}</p>
      <div className="mt-auto pt-6">
        {progress ? (
          <div>
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span>
                {progress.done} of {progress.total} lessons
              </span>
              <span className="text-fg">{progress.percent}%</span>
            </div>
            <ProgressBar percent={progress.percent} label={`${course.title} progress`} />
          </div>
        ) : (
          <p className="flex items-center gap-3 text-xs text-subtle">
            <span>{course.modules.length} modules</span>
            <span aria-hidden>·</span>
            <span>{lessons} lessons</span>
            <span aria-hidden>·</span>
            <span>~{Math.max(1, Math.round(minutes / 60))} hrs</span>
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg transition-colors group-hover:text-accent">
          {cta} <Icons.arrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
