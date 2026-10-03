'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ButtonLink } from '@/components/ui/button';
import { CourseIcon, Icons } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress';
import { offer } from '@/config/site';
import { useAuth } from '@/lib/auth';
import { allLessons, courseProgress } from '@/lib/catalog-utils';
import { fetchProgress, useCatalog } from '@/lib/data';
import type { CourseWithModules } from '@/lib/types';

/** Slug segments from the real URL (works for pre-rendered pages and the fallback page). */
export function usePathSegments() {
  const pathname = usePathname() ?? '';
  return pathname.replace(/\/+$/, '').split('/').filter(Boolean);
}

export function NotFoundBlock({ title = 'Page not found' }: { title?: string }) {
  return (
    <div className="container-page flex flex-1 flex-col items-center justify-center py-28 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/courses" variant="secondary">Browse courses</ButtonLink>
      </div>
    </div>
  );
}

export function useCourse(initial: CourseWithModules | null) {
  const [, slug] = usePathSegments();
  const { catalog, loaded } = useCatalog(initial ? [initial] : []);
  const course = catalog.find((c) => c.slug === slug) ?? (initial?.slug === slug ? initial : null);
  return { course, loaded, slug };
}

export function useCompleted(userId: string | undefined) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (!userId) return;
    let active = true;
    fetchProgress(userId).then((p) => active && setCompleted(p.completed));
    return () => {
      active = false;
    };
  }, [userId]);
  return completed;
}

export function CourseView({ initial }: { initial: CourseWithModules | null }) {
  const { course, loaded } = useCourse(initial);
  const { viewer } = useAuth();
  const completed = useCompleted(viewer?.id);

  if (!course) return loaded ? <NotFoundBlock title="Course not found" /> : <div className="container-page py-28 text-center text-muted">Loading…</div>;

  const stats = courseProgress(course, completed);
  const lessons = allLessons(course);
  const preview = lessons.find((l) => l.is_preview);
  const unlocked = Boolean(viewer?.hasAccess) || viewer?.role === 'admin';
  const canOpen = (isPreview: boolean) => isPreview || unlocked;
  const minutes = lessons.reduce((n, l) => n + l.duration_minutes, 0);

  return (
    <div className="container-page py-14 sm:py-20">
      <nav aria-label="Breadcrumb" className="text-sm text-subtle">
        <Link href="/courses" className="hover:text-fg">Courses</Link> / <span className="text-muted">{course.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <header>
          <span className="grid size-14 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-accent">
            <CourseIcon name={course.icon} size={26} />
          </span>
          <p className="eyebrow mt-6">{course.category}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">{course.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{course.subtitle}</p>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{course.description}</p>
        </header>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <dl className="grid grid-cols-3 gap-3 text-center">
            {[
              ['Modules', course.modules.length],
              ['Lessons', lessons.length],
              ['Hours', `~${Math.max(1, Math.round(minutes / 60))}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-surface-2 py-3">
                <dt className="text-xs text-subtle">{k}</dt>
                <dd className="mt-1 text-lg font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          {unlocked ? (
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm text-muted">
                <span>Your progress</span>
                <span className="text-fg">{stats.percent}%</span>
              </div>
              <ProgressBar percent={stats.percent} label="Course progress" />
              {stats.next && (
                <ButtonLink href={`/courses/${course.slug}/${stats.next.slug}`} className="mt-6 w-full">
                  {stats.done ? 'Continue learning' : 'Start course'} <Icons.arrowRight size={17} />
                </ButtonLink>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <ButtonLink href="/checkout" className="w-full">Unlock all courses: {offer.priceLabel}</ButtonLink>
              {preview && (
                <ButtonLink href={`/courses/${course.slug}/${preview.slug}`} variant="secondary" className="w-full">
                  Read the free lesson
                </ButtonLink>
              )}
              <p className="pt-1 text-center text-xs text-subtle">One payment unlocks all {lessons.length} lessons here and every other course.</p>
            </div>
          )}
        </aside>
      </div>

      <section aria-labelledby="curriculum-title" className="mt-16">
        <h2 id="curriculum-title" className="text-2xl font-semibold tracking-tight">Curriculum</h2>
        <ol className="mt-6 space-y-3">
          {course.modules.map((m, i) => (
            <li key={m.id} className="card p-5 sm:p-6">
              <span className="font-mono text-xs text-subtle">Module {String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight">{m.title}</h3>
              <p className="mt-1 text-sm text-muted">{m.summary}</p>
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {m.lessons.map((l) => {
                  const open = canOpen(l.is_preview);
                  const done = completed.has(l.id);
                  return (
                    <li key={l.id}>
                      <Link href={`/courses/${course.slug}/${l.slug}`} className="flex items-center gap-3 py-3 text-sm transition-colors hover:text-accent">
                        <span className="shrink-0 text-subtle">
                          {done ? <Icons.checkCircle size={18} className="text-accent" /> : open ? <Icons.book size={18} /> : <Icons.lock size={18} />}
                        </span>
                        <span className="flex-1">{l.title}</span>
                        {l.is_preview && !unlocked && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Free preview</span>}
                        <span className="shrink-0 text-xs text-subtle">{l.duration_minutes} min</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
