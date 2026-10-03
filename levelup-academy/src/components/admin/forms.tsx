'use client';
import { useState, useTransition, type FormEvent, type ReactNode } from 'react';

import { buttonClass } from '@/components/ui/button';
import {
  addResource,
  createCourse,
  createLesson,
  createModule,
  ICONS,
  setLessonVideoPath,
  updateCourse,
  updateLesson,
  updateModule,
  uploadLessonFile,
  type AdminState,
} from '@/lib/admin';
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

function Submit({ pending, children, variant = 'primary', size = 'md', className = '' }: { pending: boolean; children: ReactNode; variant?: 'primary' | 'secondary'; size?: 'sm' | 'md'; className?: string }) {
  return (
    <button type="submit" disabled={pending} className={buttonClass(variant, size, className)}>
      {pending ? 'Saving…' : children}
    </button>
  );
}

/** Runs a form action with pending and result state. */
function useAction<T extends AdminState>(action: (form: FormData) => Promise<T>, after?: (result: T, form: HTMLFormElement) => void) {
  const [state, setState] = useState<AdminState>();
  const [pending, start] = useTransition();
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    start(async () => {
      const result = await action(data);
      setState(result);
      if (!result?.error) after?.(result, formEl);
    });
  }
  return { state, pending, onSubmit };
}

export function CourseForm({ course, onSaved }: { course?: Course; onSaved?: (id?: string) => void }) {
  const { state, pending, onSubmit } = useAction(
    (form) => (course ? updateCourse(course.id, form) : createCourse(form)),
    (r) => onSaved?.((r as { id?: string }).id)
  );
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
      <Submit pending={pending}>{course ? 'Save course' : 'Create course'}</Submit>
    </form>
  );
}

export function NewModuleForm({ courseId, onSaved }: { courseId: string; onSaved: () => void }) {
  const { state, pending, onSubmit } = useAction((f) => createModule(courseId, f), (_, el) => { el.reset(); onSaved(); });
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Notice state={state} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
        <input name="title" placeholder="New module title" required className="input" aria-label="Module title" />
        <input name="summary" placeholder="Short summary (optional)" className="input" aria-label="Module summary" />
        <Submit pending={pending} variant="secondary">Add module</Submit>
      </div>
    </form>
  );
}

export function ModuleEditForm({ module, onSaved }: { module: { id: string; title: string; summary: string; is_published: boolean }; onSaved: () => void }) {
  const { state, pending, onSubmit } = useAction((f) => updateModule(module.id, f), () => onSaved());
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Notice state={state} />
      <input name="title" defaultValue={module.title} required className="input" aria-label="Module title" />
      <input name="summary" defaultValue={module.summary} className="input" aria-label="Module summary" />
      <div className="flex items-center justify-between gap-4">
        <Toggle name="is_published" label="Module published" defaultChecked={module.is_published} />
        <Submit pending={pending} variant="secondary" size="sm">Save module</Submit>
      </div>
    </form>
  );
}

export function NewLessonForm({ moduleId, onCreated }: { moduleId: string; onCreated: (id: string) => void }) {
  const { state, pending, onSubmit } = useAction((f) => createLesson(moduleId, f), (r) => r.id && onCreated(r.id));
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input name="title" placeholder="New lesson title" required className="input" aria-label="Lesson title" />
      <Submit pending={pending} variant="secondary" size="sm" className="h-[46px]">Add lesson</Submit>
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

export function LessonForm({ lesson, modules, onSaved }: { lesson: LessonFormData; modules: { id: string; title: string }[]; onSaved: () => void }) {
  const { state, pending, onSubmit } = useAction((f) => updateLesson(lesson.id, f), () => onSaved());
  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
      <Submit pending={pending}>Save lesson</Submit>
    </form>
  );
}

export function ResourceUploader({ lessonId, onSaved }: { lessonId: string; onSaved: () => void }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<AdminState>();
  const [mode, setMode] = useState<'file' | 'link'>('file');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
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
          storagePath = await uploadLessonFile(lessonId, file);
        } else {
          externalUrl = String(form.get('url') ?? '') || null;
        }
        const result = await addResource({ lessonId, title, kind: mode === 'link' ? 'link' : kind, storagePath, externalUrl });
        setState(result);
        if (!result?.error) {
          formEl.reset();
          onSaved();
        }
      } catch (err) {
        setState({ error: err instanceof Error ? err.message : 'Upload failed.' });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
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

export function VideoUploader({ lessonId, currentPath, onSaved }: { lessonId: string; currentPath: string | null; onSaved: () => void }) {
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
            onClick={() => start(async () => { await setLessonVideoPath(lessonId, null); setState({ message: 'Video removed.' }); onSaved(); })}
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
              const path = await uploadLessonFile(lessonId, file);
              await setLessonVideoPath(lessonId, path);
              setState({ message: 'Video uploaded.' });
              onSaved();
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
