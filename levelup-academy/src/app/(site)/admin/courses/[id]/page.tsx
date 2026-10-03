import Link from 'next/link';
import { notFound } from 'next/navigation';

import { deleteCourse, deleteModule, moveLesson, moveModule } from '@/app/(site)/admin/actions';
import { ActionButton } from '@/app/(site)/admin/admin-buttons';
import { CourseForm, ModuleEditForm, NewLessonForm, NewModuleForm } from '@/components/admin/forms';
import type { Course, LessonMeta } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';

type ModuleRow = { id: string; title: string; summary: string; position: number; is_published: boolean; lessons: LessonMeta[] };

export default async function AdminCoursePage({ params }: PageProps<'/admin/courses/[id]'>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('*, modules(id, title, summary, position, is_published, lessons(id, slug, title, status, is_preview, position, duration_minutes, module_id, course_id, summary))')
    .eq('id', id)
    .maybeSingle();
  if (!data) notFound();
  const course = data as Course & { modules: ModuleRow[] };
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
          <ActionButton action={deleteCourse.bind(null, course.id)} label="Delete course" icon="delete" danger confirmText="Delete this course and ALL its modules, lessons and progress? This cannot be undone." />
        </div>
      </div>

      <section className="card p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Course details</h2>
        <CourseForm course={course} />
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
                    <ActionButton action={moveModule.bind(null, m.id, 'up')} label="Move module up" icon="up" />
                    <ActionButton action={moveModule.bind(null, m.id, 'down')} label="Move module down" icon="down" />
                    <ActionButton action={deleteModule.bind(null, m.id)} label="Delete module" icon="delete" danger confirmText="Delete this module and its lessons?" />
                  </div>
                </div>
                <ModuleEditForm module={m} />
                <ul className="mt-5 divide-y divide-line border-t border-line">
                  {lessons.map((l) => (
                    <li key={l.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <Link href={`/admin/lessons/${l.id}`} className="flex-1 hover:text-accent">{l.title}</Link>
                      {l.is_preview && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">Preview</span>}
                      <span className={`rounded-full px-2 py-0.5 text-xs ${l.status === 'published' ? 'bg-white/5 text-muted' : 'bg-warning/10 text-warning'}`}>{l.status}</span>
                      <ActionButton action={moveLesson.bind(null, l.id, 'up')} label="Move lesson up" icon="up" />
                      <ActionButton action={moveLesson.bind(null, l.id, 'down')} label="Move lesson down" icon="down" />
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <NewLessonForm moduleId={m.id} />
                </div>
              </li>
            );
          })}
        </ol>
        <div className="card mt-4 p-5">
          <NewModuleForm courseId={course.id} />
        </div>
      </section>
    </div>
  );
}
