'use client';
import { useActionState, useState, useTransition, type ReactNode } from 'react';

import {
  addResource,
  createCourse,
  createLesson,
  createModule,
  setLessonVideoPath,
  updateCourse,
  updateLesson,
  updateModule,
  type AdminState,
} from '@/app/(site)/admin/actions';
import { buttonClass } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { createClient } from '@/lib/supabase/client';
import type { Course } from '@/lib/types';

function Notice({ state }: { state: AdminState }) {
  if (!state) return null;
  return state.error ? (
    <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
  ) : state.message ? (
    <p role="status" className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">{state.message}</p>
  ) : null;
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-subtle">{hint}</span>}
    </label>
  );
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2.5 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 accent-[var(--color-accent)]" />
      {label}
    </label>
  );
}

const ICONS = ['spark', 'briefcase', 'code', 'cart', 'chart', 'play', 'megaphone', 'rocket', 'layers'];

export function CourseForm({ course }: { course?: Course }) {
  const action = course ? updateCourse.bind(null, course.id) : createCourse;
  const [state, formAction] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-5">
      <Notice state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title"><input name="title" required defaultValue={course?.title} className="input" /></Field>
        <Field label="URL slug" hint="e.g. making-money-with-ai"><input name="slug" required defaultValue={course?.slug} className="input" /></Field>
        <Field label="Category"><input name="category" required defaultValue={course?.category} className="input" /></Field>
        <Field label="Icon">
          <select name="icon" defaultValue={course?.icon ?? 'layers'} className="input">
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Subtitle (shown on cards)"><input name="subtitle" defaultValue={course?.subtitle} className="input" /></Field>
      <Field label="Description"><textarea name="description" rows={4} defaultValue={course?.description} className="input" /></Field>
      <Field label="Thumbnail URL (optional)"><input name="thumbnail_url" type="url" defaultValue={course?.thumbnail_url ?? ''} className="input" /></Field>
      <Toggle name="is_published" label="Published (visible to visitors)" defaultChecked={course?.is_published ?? false} />
      <SubmitButton pendingText="Saving…">{course ? 'Save course' : 'Create course'}</SubmitButton>
    </form>
  );
}

export function NewModuleForm({ courseId }: { courseId: string }) {
  const [state, formAction] = useActionState(createModule.bind(null, courseId), undefined);
  return (
    <form action={formAction} className="space-y-3">
      <Notice state={state} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
        <input name="title" placeholder="New module title" required className="input" aria-label="Module title" />
        <input name="summary" placeholder="Short summary (optional)" className="input" aria-label="Module summary" />
        <SubmitButton variant="secondary" pendingText="Adding…">Add module</SubmitButton>
      </div>
    </form>
  );
}

export function ModuleEditForm({ module }: { module: { id: string; title: string; summary: string; is_published: boolean } }) {
  const [state, formAction] = useActionState(updateModule.bind(null, module.id), undefined);
  return (
    <form action={formAction} className="space-y-3">
      <Notice state={state} />
      <input name="title" defaultValue={module.title} required className="input" aria-label="Module title" />
      <input name="summary" defaultValue={module.summary} className="input" aria-label="Module summary" />
      <div className="flex items-center justify-between gap-4">
        <Toggle name="is_published" label="Module published" defaultChecked={module.is_published} />
        <SubmitButton variant="secondary" size="sm" pendingText="Saving…">Save module</SubmitButton>
      </div>
    </form>
  );
}

export function NewLessonForm({ moduleId }: { moduleId: string }) {
  const [state, formAction] = useActionState(createLesson.bind(null, moduleId), undefined);
  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
      <input name="title" placeholder="New lesson title" required className="input" aria-label="Lesson title" />
      <SubmitButton variant="secondary" size="sm" pendingText="Adding…" className="h-[46px]">Add lesson</SubmitButton>
      <Notice state={state} />
    </form>
  );
}

export type LessonFormData = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  duration_minutes: number;
  is_preview: boolean;
  status: 'draft' | 'published';
  module_id: string;
  body_md: string;
  video_url: string | null;
};

export function LessonForm({ lesson, modules }: { lesson: LessonFormData; modules: { id: string; title: string }[] }) {
  const [state, formAction] = useActionState(updateLesson.bind(null, lesson.id), undefined);
  return (
    <form action={formAction} className="space-y-5">
      <Notice state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title"><input name="title" required defaultValue={lesson.title} className="input" /></Field>
        <Field label="URL slug"><input name="slug" required defaultValue={lesson.slug} className="input" /></Field>
        <Field label="Module">
          <select name="module_id" defaultValue={lesson.module_id} className="input">
            {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </Field>
        <Field label="Duration (minutes)"><input name="duration_minutes" type="number" min={0} defaultValue={lesson.duration_minutes} className="input" /></Field>
      </div>
      <Field label="Summary"><input name="summary" defaultValue={lesson.summary} className="input" /></Field>
      <Field label="Video link (optional)" hint="YouTube, Vimeo or a direct .mp4 link. Or upload a video file below.">
        <input name="video_url" type="url" defaultValue={lesson.video_url ?? ''} className="input" />
      </Field>
      <Field label="Lesson content (Markdown)" hint="Use ## for section headings, - for bullets, 1. for steps, - [ ] for checklist items, > for callouts.">
        <textarea name="body_md" rows={24} defaultValue={lesson.body_md} className="input font-mono text-sm leading-relaxed" />
      </Field>
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-line p-4">
        <Field label="Status">
          <select name="status" defaultValue={lesson.status} className="input w-44">
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Toggle name="is_preview" label="Free preview (anyone can read)" defaultChecked={lesson.is_preview} />
      </div>
      <SubmitButton pendingText="Saving…">Save lesson</SubmitButton>
    </form>
  );
}

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').slice(-80) || 'file';
}

/** Uploads directly from the browser to the private bucket (allowed for admins only by storage policies). */
async function upload(lessonId: string, file: File) {
  const supabase = createClient();
  const path = `lessons/${lessonId}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from('course-files').upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw new Error(error.message);
  return path;
}

export function ResourceUploader({ lessonId }: { lessonId: string }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<AdminState>();
  const [mode, setMode] = useState<'file' | 'link'>('file');

  function submit(form: FormData) {
    setState(undefined);
    start(async () => {
      try {
        const title = String(form.get('title') ?? '');
        const kind = String(form.get('kind') ?? 'file') as 'pdf' | 'template' | 'worksheet' | 'link' | 'file';
        let storagePath: string | null = null;
        let externalUrl: string | null = null;
        if (mode === 'file') {
          const file = form.get('file');
          if (!(file instanceof File) || file.size === 0) return setState({ error: 'Choose a file to upload.' });
          storagePath = await upload(lessonId, file);
        } else {
          externalUrl = String(form.get('url') ?? '') || null;
        }
        setState(await addResource({ lessonId, title, kind: mode === 'link' ? 'link' : kind, storagePath, externalUrl }));
      } catch (e) {
        setState({ error: e instanceof Error ? e.message : 'Upload failed.' });
      }
    });
  }

  return (
    <form action={submit} className="space-y-3">
      <Notice state={state} />
      <div className="flex gap-2 text-sm" role="group" aria-label="Resource type">
        {(['file', 'link'] as const).map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`rounded-full border px-3 py-1 ${mode === m ? 'border-accent/40 text-accent' : 'border-line text-muted'}`}>
            {m === 'file' ? 'Upload file' : 'External link'}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
        <input name="title" placeholder="Resource title (e.g. Proposal template)" required className="input" aria-label="Resource title" />
        {mode === 'file' ? (
          <select name="kind" className="input" aria-label="Resource kind">
            <option value="pdf">PDF</option>
            <option value="template">Template</option>
            <option value="worksheet">Worksheet</option>
            <option value="file">Other file</option>
          </select>
        ) : (
          <span />
        )}
      </div>
      {mode === 'file' ? (
        <input name="file" type="file" required className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-3 file:px-4 file:py-2 file:text-fg" />
      ) : (
        <input name="url" type="url" placeholder="https://…" required className="input" aria-label="Resource link" />
      )}
      <button type="submit" disabled={pending} className={buttonClass('secondary', 'sm')}>
        {pending ? 'Uploading…' : 'Add resource'}
      </button>
    </form>
  );
}

export function VideoUploader({ lessonId, currentPath }: { lessonId: string; currentPath: string | null }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<AdminState>();
  return (
    <div className="space-y-3">
      <Notice state={state} />
      {currentPath && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2 text-sm">
          <span className="truncate text-muted">{currentPath}</span>
          <button
            type="button"
            className="text-danger hover:underline"
            disabled={pending}
            onClick={() => start(async () => { await setLessonVideoPath(lessonId, null); setState({ message: 'Video removed.' }); })}
          >
            Remove
          </button>
        </div>
      )}
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        disabled={pending}
        aria-label="Upload lesson video"
        className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-3 file:px-4 file:py-2 file:text-fg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setState(undefined);
          start(async () => {
            try {
              const path = await upload(lessonId, file);
              await setLessonVideoPath(lessonId, path);
              setState({ message: 'Video uploaded.' });
            } catch (err) {
              setState({ error: err instanceof Error ? err.message : 'Upload failed.' });
            }
          });
        }}
      />
      {pending && <p className="text-sm text-muted">Uploading… keep this tab open.</p>}
    </div>
  );
}
