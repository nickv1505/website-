'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { CourseLibrary } from '@/components/course/course-library';
import { ButtonLink } from '@/components/ui/button';
import { CourseIcon, Icons } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress';
import { offer } from '@/config/site';
import { useRequireViewer } from '@/lib/auth';
import { allLessons, courseProgress } from '@/lib/catalog-utils';
import { fetchProgress, useCatalog, type Progress } from '@/lib/data';
import { toLibraryItems } from '@/lib/library';
import type { CourseWithModules } from '@/lib/types';

export function PageLoading() {
  return (
    <div className="container-page py-16" role="status" aria-label="Loading">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-white/6" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-[1.25rem] border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}

export function DashboardView({ initial }: { initial: CourseWithModules[] }) {
  const { loading, viewer } = useRequireViewer();
  const { catalog } = useCatalog(initial);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    if (viewer) fetchProgress(viewer.id).then(setProgress);
  }, [viewer]);

  if (loading || !viewer) return <PageLoading />;
  const unlocked = viewer.hasAccess || viewer.role === 'admin';
  const completed = progress?.completed ?? new Set<string>();

  const lessonCourse = new Map(catalog.flatMap((c) => allLessons(c).map((l) => [l.id, c] as const)));
  const seen = new Set<string>();
  const continueItems = (progress?.recent ?? [])
    .map((v) => lessonCourse.get(v.lesson_id))
    .filter((c): c is CourseWithModules => Boolean(c) && !seen.has(c!.id) && Boolean(seen.add(c!.id)))
    .slice(0, 3)
    .map((c) => ({ course: c, stats: courseProgress(c, completed) }));
  const totalLessons = catalog.reduce((n, c) => n + allLessons(c).length, 0);
  const firstName = viewer.fullName.split(' ')[0];

  return (
    <div className="container-page py-12 sm:py-16">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}</h1>
          <p className="mt-2 text-muted">
            {unlocked
              ? `Lifetime access active. All ${catalog.length} courses are unlocked.`
              : 'You can read the free preview lessons. Unlock the full library to access every lesson.'}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:w-80">
          <div className="card px-4 py-3">
            <dt className="text-xs text-subtle">Lessons completed</dt>
            <dd className="mt-1 text-2xl font-semibold">
              {completed.size}
              <span className="text-sm font-normal text-subtle"> / {totalLessons}</span>
            </dd>
          </div>
          <div className="card px-4 py-3">
            <dt className="text-xs text-subtle">Access</dt>
            <dd className={`mt-1.5 text-sm font-semibold ${unlocked ? 'text-accent' : 'text-muted'}`}>{unlocked ? 'Lifetime' : 'Preview only'}</dd>
          </div>
        </dl>
      </header>

      {!unlocked && (
        <section className="mt-10 flex flex-col gap-5 rounded-[1.25rem] border border-accent/25 bg-accent/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
              <Icons.lock size={20} />
            </span>
            <div>
              <h2 className="font-semibold">Unlock all {catalog.length} courses for {offer.priceLabelLong}</h2>
              <p className="mt-1 text-sm text-muted">One payment. Lifetime access. If you just paid, your access appears within a few seconds of Stripe confirming it.</p>
            </div>
          </div>
          <ButtonLink href="/checkout">Get lifetime access</ButtonLink>
        </section>
      )}

      <section aria-labelledby="continue-title" className="mt-12">
        <h2 id="continue-title" className="text-xl font-semibold tracking-tight">Continue learning</h2>
        {continueItems.length ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {continueItems.map(({ course, stats }) => (
              <li key={course.id} className="card card-hover p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-accent">
                    <CourseIcon name={course.icon} size={18} />
                  </span>
                  <p className="font-medium">{course.title}</p>
                </div>
                <p className="mt-4 line-clamp-1 text-sm text-muted">Next: {stats.next?.title}</p>
                <div className="mt-4">
                  <ProgressBar percent={stats.percent} label={`${course.title} progress`} />
                  <p className="mt-2 text-xs text-subtle">{stats.done}/{stats.total} lessons · {stats.percent}%</p>
                </div>
                {stats.next && (
                  <Link href={`/courses/${course.slug}/${stats.next.slug}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                    Resume <Icons.arrowRight size={15} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-[1.25rem] border border-dashed border-line-strong p-8 text-center">
            <p className="font-medium">You haven&apos;t started a lesson yet.</p>
            <p className="mt-1 text-sm text-muted">Pick a course below. Many students start with Freelancing From Zero or Making Money With AI.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="library-title" className="mt-14">
        <h2 id="library-title" className="mb-5 text-xl font-semibold tracking-tight">Your library</h2>
        <CourseLibrary items={toLibraryItems(catalog, completed)} showProgress />
      </section>
    </div>
  );
}
