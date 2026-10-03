'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

/*
 * Admin mutations. Every action re-checks the admin role on the server, and the
 * database enforces it again through row level security ("admins manage ...").
 */

export type AdminState = { error?: string; message?: string } | undefined;

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slugs use lowercase letters, numbers and single hyphens.');
const id = z.guid();
const bool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true';
const text = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\//.test(v), 'Use a full https:// link.')
  .transform((v) => v || null);

function refresh() {
  revalidatePath('/', 'layout');
}

async function db() {
  await requireAdmin();
  return createClient();
}

// ---------- Courses ----------
const courseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug,
  subtitle: z.string().trim().max(300),
  description: z.string().trim().max(3000),
  category: z.string().trim().min(2).max(60),
  icon: z.enum(['spark', 'briefcase', 'code', 'cart', 'chart', 'play', 'megaphone', 'rocket', 'layers']),
  thumbnail_url: optionalUrl,
  is_published: z.boolean(),
});

function courseFrom(form: FormData) {
  return courseSchema.safeParse({
    title: text(form.get('title')),
    slug: text(form.get('slug')),
    subtitle: text(form.get('subtitle')),
    description: text(form.get('description')),
    category: text(form.get('category')),
    icon: text(form.get('icon')) || 'layers',
    thumbnail_url: text(form.get('thumbnail_url')),
    is_published: bool(form.get('is_published')),
  });
}

export async function createCourse(_: AdminState, form: FormData): Promise<AdminState> {
  const parsed = courseFrom(form);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await db();
  const { count } = await supabase.from('courses').select('id', { count: 'exact', head: true });
  const { data, error } = await supabase
    .from('courses')
    .insert({ ...parsed.data, position: (count ?? 0) + 1 })
    .select('id')
    .single();
  if (error) return { error: error.code === '23505' ? 'That slug is already used.' : error.message };
  refresh();
  redirect(`/admin/courses/${data.id}`);
}

export async function updateCourse(courseId: string, _: AdminState, form: FormData): Promise<AdminState> {
  const parsed = courseFrom(form);
  if (!parsed.success || !id.safeParse(courseId).success) return { error: parsed.error?.issues[0].message ?? 'Invalid course' };
  const supabase = await db();
  const { error } = await supabase.from('courses').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', courseId);
  if (error) return { error: error.code === '23505' ? 'That slug is already used.' : error.message };
  refresh();
  return { message: 'Course saved.' };
}

export async function deleteCourse(courseId: string) {
  const supabase = await db();
  await supabase.from('courses').delete().eq('id', id.parse(courseId));
  refresh();
  redirect('/admin');
}

// ---------- Modules ----------
export async function createModule(courseId: string, _: AdminState, form: FormData): Promise<AdminState> {
  const title = text(form.get('title'));
  if (title.length < 2) return { error: 'Enter a module title.' };
  const supabase = await db();
  const { data: last } = await supabase
    .from('modules')
    .select('position')
    .eq('course_id', id.parse(courseId))
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase.from('modules').insert({
    course_id: courseId,
    title,
    summary: text(form.get('summary')),
    position: (last?.position ?? 0) + 1,
    is_published: true,
  });
  if (error) return { error: error.message };
  refresh();
  return { message: 'Module added.' };
}

export async function updateModule(moduleId: string, _: AdminState, form: FormData): Promise<AdminState> {
  const title = text(form.get('title'));
  if (title.length < 2) return { error: 'Enter a module title.' };
  const supabase = await db();
  const { error } = await supabase
    .from('modules')
    .update({ title, summary: text(form.get('summary')), is_published: bool(form.get('is_published')), updated_at: new Date().toISOString() })
    .eq('id', id.parse(moduleId));
  if (error) return { error: error.message };
  refresh();
  return { message: 'Saved.' };
}

export async function moveModule(moduleId: string, direction: 'up' | 'down') {
  const supabase = await db();
  const { data: current } = await supabase.from('modules').select('id, course_id, position').eq('id', id.parse(moduleId)).single();
  if (!current) return;
  const { data: siblings } = await supabase.from('modules').select('id, position').eq('course_id', current.course_id).order('position');
  const list = siblings ?? [];
  const i = list.findIndex((m) => m.id === moduleId);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  // Renumber 1..n so positions stay clean.
  await Promise.all(list.map((m, index) => supabase.from('modules').update({ position: index + 1 }).eq('id', m.id)));
  refresh();
}

export async function deleteModule(moduleId: string) {
  const supabase = await db();
  await supabase.from('modules').delete().eq('id', id.parse(moduleId));
  refresh();
}

// ---------- Lessons ----------
export async function createLesson(moduleId: string, _: AdminState, form: FormData): Promise<AdminState> {
  const title = text(form.get('title'));
  if (title.length < 2) return { error: 'Enter a lesson title.' };
  const lessonSlug = slug.safeParse(text(form.get('slug')) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  if (!lessonSlug.success) return { error: lessonSlug.error.issues[0].message };
  const supabase = await db();
  const { data: last } = await supabase
    .from('lessons')
    .select('position')
    .eq('module_id', id.parse(moduleId))
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from('lessons')
    .insert({ module_id: moduleId, title, slug: lessonSlug.data, position: (last?.position ?? 0) + 1, status: 'draft' })
    .select('id')
    .single();
  if (error) return { error: error.code === '23505' ? 'That slug is already used in this course.' : error.message };
  await supabase.from('lesson_content').insert({ lesson_id: data.id, body_md: '' });
  refresh();
  redirect(`/admin/lessons/${data.id}`);
}

const lessonSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  summary: z.string().trim().max(400),
  duration_minutes: z.coerce.number().int().min(0).max(1000),
  is_preview: z.boolean(),
  status: z.enum(['draft', 'published']),
  module_id: id,
  body_md: z.string().max(200_000),
  video_url: optionalUrl,
});

export async function updateLesson(lessonId: string, _: AdminState, form: FormData): Promise<AdminState> {
  const parsed = lessonSchema.safeParse({
    title: text(form.get('title')),
    slug: text(form.get('slug')),
    summary: text(form.get('summary')),
    duration_minutes: text(form.get('duration_minutes')) || '0',
    is_preview: bool(form.get('is_preview')),
    status: text(form.get('status')),
    module_id: text(form.get('module_id')),
    body_md: typeof form.get('body_md') === 'string' ? (form.get('body_md') as string) : '',
    video_url: text(form.get('video_url')),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { body_md, video_url, ...meta } = parsed.data;
  const supabase = await db();
  const now = new Date().toISOString();
  const { error } = await supabase.from('lessons').update({ ...meta, updated_at: now }).eq('id', id.parse(lessonId));
  if (error) return { error: error.code === '23505' ? 'That slug is already used in this course.' : error.message };
  const { error: contentError } = await supabase
    .from('lesson_content')
    .upsert({ lesson_id: lessonId, body_md, video_url, updated_at: now }, { onConflict: 'lesson_id' });
  if (contentError) return { error: contentError.message };
  refresh();
  return { message: meta.status === 'published' ? 'Saved and published.' : 'Saved as draft.' };
}

export async function moveLesson(lessonId: string, direction: 'up' | 'down') {
  const supabase = await db();
  const { data: current } = await supabase.from('lessons').select('id, module_id').eq('id', id.parse(lessonId)).single();
  if (!current) return;
  const { data: siblings } = await supabase.from('lessons').select('id').eq('module_id', current.module_id).order('position');
  const list = siblings ?? [];
  const i = list.findIndex((l) => l.id === lessonId);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((l, index) => supabase.from('lessons').update({ position: index + 1 }).eq('id', l.id)));
  refresh();
}

export async function deleteLesson(lessonId: string, courseId: string) {
  const supabase = await db();
  await supabase.from('lessons').delete().eq('id', id.parse(lessonId));
  refresh();
  redirect(`/admin/courses/${id.parse(courseId)}`);
}

// ---------- Files and resources ----------
export async function setLessonVideoPath(lessonId: string, path: string | null) {
  const supabase = await db();
  const { error } = await supabase
    .from('lesson_content')
    .upsert({ lesson_id: id.parse(lessonId), video_path: path, updated_at: new Date().toISOString() }, { onConflict: 'lesson_id' });
  if (error) throw new Error(error.message);
  refresh();
}

const resourceSchema = z
  .object({
    lessonId: id,
    title: z.string().trim().min(1).max(160),
    kind: z.enum(['pdf', 'template', 'worksheet', 'link', 'file']),
    storagePath: z.string().max(500).nullable(),
    externalUrl: z.url().nullable(),
  })
  .refine((r) => r.storagePath || r.externalUrl, 'Upload a file or provide a link.');

export async function addResource(input: z.input<typeof resourceSchema>): Promise<AdminState> {
  const parsed = resourceSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await db();
  const { count } = await supabase
    .from('lesson_resources')
    .select('id', { count: 'exact', head: true })
    .eq('lesson_id', parsed.data.lessonId);
  const { error } = await supabase.from('lesson_resources').insert({
    lesson_id: parsed.data.lessonId,
    title: parsed.data.title,
    kind: parsed.data.kind,
    storage_path: parsed.data.storagePath,
    external_url: parsed.data.externalUrl,
    position: (count ?? 0) + 1,
  });
  if (error) return { error: error.message };
  refresh();
  return { message: 'Resource added.' };
}

export async function deleteResource(resourceId: string) {
  const supabase = await db();
  const { data } = await supabase.from('lesson_resources').select('storage_path').eq('id', id.parse(resourceId)).maybeSingle();
  if (data?.storage_path) await supabase.storage.from('course-files').remove([data.storage_path]);
  await supabase.from('lesson_resources').delete().eq('id', resourceId);
  refresh();
}
