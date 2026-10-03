'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { NotFoundBlock, usePathSegments, useCourse } from '@/components/course/course-view';
import { LessonSidebar } from '@/components/course/lesson-sidebar';
import { Markdown } from '@/components/course/markdown';
import { MarkComplete } from '@/components/course/mark-complete';
import { VideoPlayer } from '@/components/course/video-player';
import { ButtonLink } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { offer } from '@/config/site';
import { useAuth } from '@/lib/auth';
import { allLessons, courseProgress } from '@/lib/catalog-utils';
import { fetchLessonBody, fetchProgress, recordVisit, type LessonBody } from '@/lib/data';
import type { CourseWithModules } from '@/lib/types';

const resourceIcon = { pdf: Icons.file, template: Icons.layers, worksheet: Icons.file, link: Icons.link, file: Icons.download };

export function LessonView({ initial }: { initial: CourseWithModules | null }) {
  const { course, loaded } = useCourse(initial);
  const [, , lessonSlug] = usePathSegments();
  const { viewer, loading: authLoading } = useAuth();
  const [loadedBody, setLoadedBody] = useState<{ key: string; body: LessonBody | null } | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const lessons = course ? allLessons(course) : [];
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  const lesson = index >= 0 ? lessons[index] : null;
  const userId = viewer?.id;
  const hasAccess = viewer?.hasAccess;
  const bodyKey = `${lesson?.id}:${userId ?? ''}:${hasAccess ?? ''}`;
  const body = loadedBody?.key === bodyKey ? loadedBody.body : undefined;

  // Row level security decides: the body is null when this viewer may not read it.
  useEffect(() => {
    if (!lesson || authLoading) return;
    let active = true;
    fetchLessonBody(lesson.id).then((b) => {
      if (!active) return;
      setLoadedBody({ key: bodyKey, body: b });
      if (b && userId) recordVisit(userId, lesson.id).catch(() => undefined);
    });
    return () => {
      active = false;
    };
  }, [bodyKey, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!userId) return;
    fetchProgress(userId).then((p) => setCompleted(p.completed));
  }, [userId, lesson?.id]);

  if (!course || !lesson) {
    return loaded || course ? <NotFoundBlock title="Lesson not found" /> : <div className="container-page py-28 text-center text-muted">Loading…</div>;
  }

  const mod = course.modules.find((m) => m.id === lesson.module_id)!;
  const prev = lessons[index - 1] ?? null;
  const next = lessons[index + 1] ?? null;
  const unlocked = Boolean(viewer?.hasAccess) || viewer?.role === 'admin';
  const canOpen = (isPreview: boolean) => isPreview || unlocked;
  const stats = courseProgress(course, completed);
  const path = `/courses/${course.slug}/${lesson.slug}`;

  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-12 lg:py-12">
      <LessonSidebar
        course={course}
        currentLessonId={lesson.id}
        completed={[...completed]}
        unlocked={lessons.filter((l) => canOpen(l.is_preview)).map((l) => l.id)}
        percent={viewer ? stats.percent : null}
      />

      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-subtle">
          <Link href={`/courses/${course.slug}`} className="hover:text-fg">{course.title}</Link>
          <span aria-hidden>/</span>
          <span>Module {course.modules.indexOf(mod) + 1}</span>
        </nav>
        <header className="mt-4 border-b border-line pb-8">
          <div className="flex flex-wrap items-center gap-2">
            {lesson.is_preview && <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">Free preview</span>}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              <Icons.clock size={13} /> {lesson.duration_minutes} min
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{lesson.title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">{lesson.summary}</p>
        </header>

        {body === undefined ? (
          <div className="mt-10 space-y-4" role="status" aria-label="Loading lesson">
            {[80, 95, 70, 90, 60].map((w, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-white/6" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : body ? (
          <div className="mt-8 space-y-10">
            {(body.video_signed_url || body.video_url) && <VideoPlayer url={(body.video_signed_url || body.video_url)!} title={lesson.title} />}
            <Markdown>{body.body_md || '_This lesson has no written content yet._'}</Markdown>

            {body.resources.length > 0 && (
              <section aria-labelledby="resources-title" className="card p-6">
                <h2 id="resources-title" className="font-semibold">Downloads and resources</h2>
                <ul className="mt-4 divide-y divide-line">
                  {body.resources.map((r) => {
                    const Icon = resourceIcon[r.kind] ?? Icons.download;
                    return (
                      <li key={r.id} className="flex items-center gap-3 py-3">
                        <Icon size={18} className="shrink-0 text-accent" />
                        <span className="flex-1 text-sm">{r.title}</span>
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent hover:underline">
                            {r.kind === 'link' ? 'Open' : 'Download'}
                          </a>
                        ) : (
                          <span className="text-xs text-subtle">Unavailable</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            <footer className="flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                {prev && (
                  <ButtonLink href={`/courses/${course.slug}/${prev.slug}`} variant="secondary" size="sm" aria-label={`Previous lesson: ${prev.title}`}>
                    <Icons.arrowLeft size={16} /> Previous
                  </ButtonLink>
                )}
                {next && (
                  <ButtonLink href={`/courses/${course.slug}/${next.slug}`} variant="secondary" size="sm" aria-label={`Next lesson: ${next.title}`}>
                    Next <Icons.arrowRight size={16} />
                  </ButtonLink>
                )}
              </div>
              {viewer ? (
                <MarkComplete
                  key={lesson.id}
                  userId={viewer.id}
                  lessonId={lesson.id}
                  initial={completed.has(lesson.id)}
                  nextHref={next && canOpen(next.is_preview) ? `/courses/${course.slug}/${next.slug}` : null}
                  onChange={(done) =>
                    setCompleted((prevSet) => {
                      const s = new Set(prevSet);
                      if (done) s.add(lesson.id);
                      else s.delete(lesson.id);
                      return s;
                    })
                  }
                />
              ) : (
                <p className="text-sm text-muted">
                  <Link href={`/signup?next=${encodeURIComponent(path)}`} className="text-accent hover:underline">Create a free account</Link> to track your
                  progress.
                </p>
              )}
            </footer>

            {lesson.is_preview && !viewer?.hasAccess && (
              <aside className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Enjoyed this free lesson?</p>
                  <p className="mt-1 text-sm text-muted">One payment of {offer.priceLabelLong} unlocks every lesson in all courses, for life.</p>
                </div>
                <ButtonLink href="/checkout">Unlock everything</ButtonLink>
              </aside>
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-line-strong bg-surface p-8 text-center sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-full border border-line-strong text-accent">
              <Icons.lock size={24} />
            </span>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">This lesson is part of the full library</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Get lifetime access to every course, lesson, template and resource for one payment of {offer.priceLabelLong}. No subscription.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/checkout" size="lg">Get Lifetime Access: {offer.priceLabel}</ButtonLink>
              {!viewer && (
                <ButtonLink href={`/login?next=${encodeURIComponent(path)}`} size="lg" variant="secondary">
                  I already purchased: sign in
                </ButtonLink>
              )}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
