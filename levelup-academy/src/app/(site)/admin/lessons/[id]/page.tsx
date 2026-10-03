import Link from 'next/link';
import { notFound } from 'next/navigation';

import { deleteLesson, deleteResource } from '@/app/(site)/admin/actions';
import { ActionButton } from '@/app/(site)/admin/admin-buttons';
import { LessonForm, ResourceUploader, VideoUploader } from '@/components/admin/forms';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLessonPage({ params }: PageProps<'/admin/lessons/[id]'>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, slug, title, summary, duration_minutes, is_preview, status, module_id, course_id, courses(id, slug, title, is_published)')
    .eq('id', id)
    .maybeSingle();
  if (!lesson) notFound();
  const [{ data: content }, { data: resources }, { data: modules }] = await Promise.all([
    supabase.from('lesson_content').select('body_md, video_url, video_path').eq('lesson_id', id).maybeSingle(),
    supabase.from('lesson_resources').select('id, title, kind, storage_path, external_url').eq('lesson_id', id).order('position'),
    supabase.from('modules').select('id, title, position').eq('course_id', lesson.course_id).order('position'),
  ]);
  const course = lesson.courses as unknown as { id: string; slug: string; title: string; is_published: boolean };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href={`/admin/courses/${course.id}`} className="text-sm text-muted hover:text-fg">← {course.title}</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {lesson.status === 'published' && course.is_published && (
            <Link href={`/courses/${course.slug}/${lesson.slug}`} className="text-sm text-accent hover:underline">View live</Link>
          )}
          <ActionButton action={deleteLesson.bind(null, lesson.id, course.id)} label="Delete lesson" icon="delete" danger confirmText="Delete this lesson? Student progress for it will also be removed." />
        </div>
      </div>

      <section className="card p-6 sm:p-8">
        <LessonForm
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
          modules={(modules ?? []).map((m) => ({ id: m.id, title: `${m.position}. ${m.title}` }))}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-semibold">Video file</h2>
          <p className="mb-4 mt-1 text-sm text-muted">Upload a video to private storage (served with expiring links to students who have access).</p>
          <VideoUploader lessonId={lesson.id} currentPath={content?.video_path ?? null} />
        </section>
        <section className="card p-6">
          <h2 className="font-semibold">Downloads and resources</h2>
          <p className="mb-4 mt-1 text-sm text-muted">PDFs, templates, worksheets or links. Only students who can open this lesson can download them.</p>
          {resources && resources.length > 0 && (
            <ul className="mb-5 divide-y divide-line border-y border-line text-sm">
              {resources.map((r) => (
                <li key={r.id} className="flex items-center gap-3 py-2.5">
                  <span className="flex-1">{r.title}</span>
                  <span className="text-xs text-subtle">{r.kind}</span>
                  <ActionButton action={deleteResource.bind(null, r.id)} label="Delete resource" icon="delete" danger confirmText="Delete this resource?" />
                </li>
              ))}
            </ul>
          )}
          <ResourceUploader lessonId={lesson.id} />
        </section>
      </div>
    </div>
  );
}
