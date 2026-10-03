'use client';
import Link from 'next/link';
import { useState } from 'react';

import { CourseIcon, Icons } from '@/components/ui/icons';
import { useCatalog } from '@/lib/data';
import type { CourseWithModules } from '@/lib/types';

export type CurriculumCourse = {
  slug: string;
  title: string;
  icon: string;
  subtitle: string;
  modules: { title: string; summary: string; lessonSlug: string; minutes: number; preview: boolean }[];
};

function toCurriculum(c: CourseWithModules): CurriculumCourse {
  return {
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    subtitle: c.subtitle,
    modules: c.modules.map((m) => ({
      title: m.title,
      summary: m.summary,
      lessonSlug: m.lessons[0]?.slug ?? '',
      minutes: m.lessons.reduce((n, l) => n + l.duration_minutes, 0),
      preview: m.lessons.some((l) => l.is_preview),
    })),
  };
}

export function CurriculumPreview({ initial }: { initial: CourseWithModules[] }) {
  const courses = useCatalog(initial).catalog.map(toCurriculum);
  const [active, setActive] = useState(0);
  const course = courses[active];
  if (!course) return null;
  const preview = course.modules.find((m) => m.preview);

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <div role="tablist" aria-label="Courses" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {courses.map((c, i) => (
          <button
            key={c.slug}
            role="tab"
            id={`tab-${c.slug}`}
            aria-selected={i === active}
            aria-controls="curriculum-panel"
            onClick={() => setActive(i)}
            className={`flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
              i === active ? 'border-line-strong bg-surface-2 text-fg' : 'border-transparent text-muted hover:bg-white/4 hover:text-fg'
            }`}
          >
            <span className={i === active ? 'text-accent' : ''}>
              <CourseIcon name={c.icon} size={18} />
            </span>
            <span className="whitespace-nowrap lg:whitespace-normal">{c.title}</span>
          </button>
        ))}
      </div>

      <div id="curriculum-panel" role="tabpanel" aria-labelledby={`tab-${course.slug}`} className="card p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{course.title}</h3>
            <p className="mt-1.5 max-w-xl text-sm text-muted">{course.subtitle}</p>
          </div>
          {preview && (
            <Link
              href={`/courses/${course.slug}/${preview.lessonSlug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/15"
            >
              Read a free lesson <Icons.arrowRight size={15} />
            </Link>
          )}
        </div>
        <ol className="mt-6 divide-y divide-line">
          {course.modules.map((m, i) => (
            <li key={m.lessonSlug} className="flex items-start gap-4 py-3.5">
              <span className="w-7 shrink-0 pt-0.5 font-mono text-xs text-subtle">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.95rem] font-medium">{m.title}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">{m.summary}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-1 pt-0.5 text-xs text-subtle sm:inline-flex">
                {m.preview ? (
                  <span className="text-accent">Free preview</span>
                ) : (
                  <>
                    <Icons.lock size={13} /> {m.minutes} min
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
        <Link href={`/courses/${course.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:text-accent">
          View full course outline <Icons.arrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
