'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

import { ActionButton } from '@/app/(site)/admin/admin-buttons';
import { CourseForm, LessonForm, ModuleEditForm, NewLessonForm, NewModuleForm, ResourceUploader, VideoUploader } from '@/components/admin/forms';
import { NotFoundBlock } from '@/components/course/course-view';
import { CourseIcon } from '@/components/ui/icons';
import { PageLoading } from '@/components/views/dashboard-view';
import { deleteCourse, deleteLesson, deleteModule, deleteResource, moveLesson, moveModule } from '@/lib/admin';
import { useRequireViewer } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Course, LessonMeta } from '@/lib/types';

/** Admin role is read from the database; the database also enforces it on every write. */
function AdminShell({ children }: { children: ReactNode }) {
  const { loading, viewer } = useRequireViewer();
  if (loading) return <PageLoading />;
  if (viewer?.role !== 'admin') return <NotFoundBlock />;
  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">Admin</span>
          <Link href="/admin" className="font-semibold hover:text-accent">Content manager</Link>
        </div>
        <Link href="/courses" className="text-sm text-muted hover:text-fg">View public library →</Link>
      </div>
      {children}
    </div>
  );
}

/** Re-runs the loader whenever reload() is called. */
function useLoader<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let active = true;
    load().then((d) => active && setData(d));
    return () => {
      active = false;
    };
  }, [tick]); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, reload: useCallback(() => setTick((t) => t + 1), []) };
}

type CourseRow = Course & { modules: { id: string; lessons: { id: string; status: string }[] }[] };

function AdminHomeInner() {
  const router = useRouter();
  const { data } = useLoader(async () => {
    const db = supabase();
    const [{ data: courses }, { count: students }, { count: paid }] = await Promise.all([
      db.from('courses').select('id, slug, title, category, icon, is_published, modules(id, lessons(id, status))').order('position'),
      db.from('profiles').select('id', { count: 'exact', head: true }),
      db.from('entitlements').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ]);
    return { courses: (courses ?? []) as CourseRow[], students: students ?? 0, paid: paid ?? 0 };
  });
  if (!data) return <PageLoading />;
  return (
    <div className="space-y-10">
      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ['Courses', data.courses.length],
          ['Registered accounts', data.students],
          ['Active lifetime access', data.paid],
        ].map(([k, v]) => (
          <div key={k} className="card p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="mt-1 text-3xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <ul className="mt-5 divide-y divide-line rounded-[1.25rem] border border-line">
          {data.courses.map((c) => {
            const lessons = c.modules.flatMap((m) => m.lessons);
            const drafts = lessons.filter((l) => l.status === 'draft').length;
            return (
              <li key={c.id}>
                <Link href={`/admin/course?id=${c.id}`} className="flex items-center gap-4 p-4 hover:bg-white/3">
                  <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-accent">
                    <CourseIcon name={c.icon} size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{c.title}</span>
                    <span className="text-xs text-subtle">
                      {c.modules.length} modules · {lessons.length} lessons{drafts ? ` · ${drafts} drafts` : ''}
                    </span>
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${c.is_published ? 'bg-accent/10 text-accent' : 'bg-white/5 text-muted'}`}>
                    {c.is_published ? 'Published' : 'Hidden'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="card p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Create a course</h2>
        <CourseForm onSaved={(id) => id && router.push(`/admin/course?id=${id}`)} />
      </section>
    </div>
  );
}

type ModuleRow = { id: string; title: string; summary: string; position: number; is_published: boolean; lessons: LessonMeta[] };

function AdminCourseInner() {
  const id = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const { data, reload } = useLoader(async () => {
    const { data: row } = await supabase()
      .from('courses')
      .select('*, modules(id, title, summary, position, is_published, lessons(id, slug, title, status, is_preview, position, duration_minutes, module_id, course_id, summary))')
      .eq('id', id)
      .maybeSingle();
    return { course: row as (Course & { modules: ModuleRow[] }) | null };
  });
  if (!data) return <PageLoading />;
  const course = data.course;
  if (!course) return <NotFoundBlock title="Course not found" />;
  const modules = [...course.modules].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-muted hover:text-fg">← All courses</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {course.is_published && <Link href={`/courses/${course.slug}`} className="text-sm text-accent hover:underline">View live</Link>}
          <ActionButton
            action={() => deleteCourse(course.id)}
            onDone={() => router.push('/admin')}
            label="Delete course"
            icon="delete"
            danger
            confirmText="Delete this course and ALL its modules, lessons and progress? This cannot be undone."
          />
        </div>
      </div>
      <section className="card p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Course details</h2>
        <CourseForm course={course} onSaved={reload} />
      </section>
      <section>
        <h2 className="text-lg font-semibold">Modules and lessons</h2>
        <ol className="mt-5 space-y-4">
          {modules.map((m, i) => {
            const lessons = [...m.lessons].sort((a, b) => a.position - b.position);
            return (
              <li key={m.id} className="card p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-subtle">Module {i + 1}</span>
                  <div className="flex gap-1.5">
                    <ActionButton action={() => moveModule(m.id, 'up')} onDone={reload} label="Move module up" icon="up" />
                    <ActionButton action={() => moveModule(m.id, 'down')} onDone={reload} label="Move module down" icon="down" />
                    <ActionButton action={() => deleteModule(m.id)} onDone={reload} label="Delete module" icon="delete" danger confirmText="Delete this module and its lessons?" />
                  </div>
                </div>
                <ModuleEditForm module={m} onSaved={reload} />
                <ul className="mt-5 divide-y divide-line border-t border-line">
                  {lessons.map((l) => (
                    <li key={l.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <Link href={`/admin/lesson?id=${l.id}`} className="flex-1 hover:text-accent">{l.title}</Link>
                      {l.is_preview && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Preview</span>}
                      <span className={`rounded-full px-2 py-0.5 text-xs ${l.status === 'published' ? 'bg-white/5 text-muted' : 'bg-warning/10 text-warning'}`}>{l.status}</span>
                      <ActionButton action={() => moveLesson(l.id, 'up')} onDone={reload} label="Move lesson up" icon="up" />
                      <ActionButton action={() => moveLesson(l.id, 'down')} onDone={reload} label="Move lesson down" icon="down" />
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <NewLessonForm moduleId={m.id} onCreated={(lessonId) => router.push(`/admin/lesson?id=${lessonId}`)} />
                </div>
              </li>
            );
          })}
        </ol>
        <div className="card mt-4 p-5">
          <NewModuleForm courseId={course.id} onSaved={reload} />
        </div>
      </section>
    </div>
  );
}

function AdminLessonInner() {
  const id = useSearchParams().get('id') ?? '';
  const router = useRouter();
  const { data, reload } = useLoader(async () => {
    const db = supabase();
    const { data: lesson } = await db
      .from('lessons')
      .select('id, slug, title, summary, duration_minutes, is_preview, status, module_id, course_id, updated_at, courses(id, slug, title, is_published)')
      .eq('id', id)
      .maybeSingle();
    if (!lesson) return { lesson: null };
    const [{ data: content }, { data: resources }, { data: modules }] = await Promise.all([
      db.from('lesson_content').select('body_md, video_url, video_path').eq('lesson_id', id).maybeSingle(),
      db.from('lesson_resources').select('id, title, kind, storage_path, external_url').eq('lesson_id', id).order('position'),
      db.from('modules').select('id, title, position').eq('course_id', lesson.course_id).order('position'),
    ]);
    return { lesson, content, resources: resources ?? [], modules: modules ?? [] };
  });
  if (!data) return <PageLoading />;
  const { lesson } = data;
  if (!lesson || !('content' in data)) return <NotFoundBlock title="Lesson not found" />;
  const course = lesson.courses as unknown as { id: string; slug: string; title: string; is_published: boolean };
  const content = data.content;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={`/admin/course?id=${course.id}`} className="text-sm text-muted hover:text-fg">← {course.title}</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {lesson.status === 'published' && course.is_published && (
            <Link href={`/courses/${course.slug}/${lesson.slug}`} className="text-sm text-accent hover:underline">View live</Link>
          )}
          <ActionButton
            action={() => deleteLesson(lesson.id)}
            onDone={() => router.push(`/admin/course?id=${course.id}`)}
            label="Delete lesson"
            icon="delete"
            danger
            confirmText="Delete this lesson? Student progress for it will also be removed."
          />
        </div>
      </div>
      <section className="card p-6 sm:p-8">
        <LessonForm
          key={String(lesson.updated_at)}
          lesson={{
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            summary: lesson.summary,
            duration_minutes: lesson.duration_minutes,
            is_preview: lesson.is_preview,
            status: lesson.status,
            module_id: lesson.module_id,
            body_md: content?.body_md ?? '',
            video_url: content?.video_url ?? null,
          }}
          modules={data.modules.map((m) => ({ id: m.id, title: `${m.position}. ${m.title}` }))}
          onSaved={() => undefined}
        />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-semibold">Video file</h2>
          <p className="mb-4 mt-1 text-sm text-muted">Upload a video to private storage (served with expiring links to students who have access).</p>
          <VideoUploader lessonId={lesson.id} currentPath={content?.video_path ?? null} onSaved={reload} />
        </section>
        <section className="card p-6">
          <h2 className="font-semibold">Downloads and resources</h2>
          <p className="mb-4 mt-1 text-sm text-muted">PDFs, templates, worksheets or links. Only students who can open this lesson can download them.</p>
          {data.resources.length > 0 && (
            <ul className="mb-5 divide-y divide-line border-y border-line text-sm">
              {data.resources.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex-1">{r.title}</span>
                  <span className="text-xs text-subtle">{r.kind}</span>
                  <ActionButton action={() => deleteResource(r.id)} onDone={reload} label="Delete resource" icon="delete" danger confirmText="Delete this resource?" />
                </li>
              ))}
            </ul>
          )}
          <ResourceUploader lessonId={lesson.id} onSaved={reload} />
        </section>
      </div>
    </div>
  );
}

export const AdminHome = () => <AdminShell><AdminHomeInner /></AdminShell>;
export const AdminCourse = () => <AdminShell><AdminCourseInner /></AdminShell>;
export const AdminLesson = () => <AdminShell><AdminLessonInner /></AdminShell>;
