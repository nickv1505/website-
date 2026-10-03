'use client';
import { z } from 'zod';

import { supabase } from '@/lib/supabase';

/*
 * Admin mutations. They run as the signed-in user, and the database only
 * accepts them for admins (row level security "admins manage ..." policies),
 * so a non-admin calling these from the browser gets an error.
 */

export type AdminState = { error?: string; message?: string } | undefined;

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slugs use lowercase letters, numbers and single hyphens.');
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^https?:\/\//.test(v), 'Use a full https:// link.')
  .transform((v) => v || null);
const text = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v.trim() : '');
const bool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true';
const dbError = (e: { code?: string; message: string }) =>
  e.code === '23505' ? 'That slug is already used.' : e.code === '42501' ? 'Only admins can do that.' : e.message;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------- Courses ----------
export const ICONS = ['spark', 'briefcase', 'code', 'cart', 'chart', 'play', 'megaphone', 'rocket', 'layers'] as const;
const courseSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug,
  subtitle: z.string().trim().max(300),
  description: z.string().trim().max(3000),
  category: z.string().trim().min(2).max(60),
  icon: z.enum(ICONS),
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

export async function createCourse(form: FormData): Promise<AdminState & { id?: string }> {
  const parsed = courseFrom(form);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const db = supabase();
  const { count } = await db.from('courses').select('id', { count: 'exact', head: true });
  const { data, error } = await db.from('courses').insert({ ...parsed.data, position: (count ?? 0) + 1 }).select('id').single();
  if (error) return { error: dbError(error) };
  return { message: 'Course created.', id: data.id };
}

export async function updateCourse(courseId: string, form: FormData): Promise<AdminState> {
  const parsed = courseFrom(form);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { error } = await supabase().from('courses').update({ ...parsed.data, updated_at: new Date().toISOString() }).eq('id', courseId);
  return error ? { error: dbError(error) } : { message: 'Course saved.' };
}

export async function deleteCourse(courseId: string) {
  await supabase().from('courses').delete().eq('id', courseId);
}

// ---------- Modules ----------
export async function createModule(courseId: string, form: FormData): Promise<AdminState> {
  const title = text(form.get('title'));
  if (title.length < 2) return { error: 'Enter a module title.' };
  const db = supabase();
  const { data: last } = await db.from('modules').select('position').eq('course_id', courseId).order('position', { ascending: false }).limit(1).maybeSingle();
  const { error } = await db
    .from('modules')
    .insert({ course_id: courseId, title, summary: text(form.get('summary')), position: (last?.position ?? 0) + 1, is_published: true });
  return error ? { error: dbError(error) } : { message: 'Module added.' };
}

export async function updateModule(moduleId: string, form: FormData): Promise<AdminState> {
  const title = text(form.get('title'));
  if (title.length < 2) return { error: 'Enter a module title.' };
  const { error } = await supabase()
    .from('modules')
    .update({ title, summary: text(form.get('summary')), is_published: bool(form.get('is_published')), updated_at: new Date().toISOString() })
    .eq('id', moduleId);
  return error ? { error: dbError(error) } : { message: 'Saved.' };
}

async function reorder(table: 'modules' | 'lessons', parentColumn: 'course_id' | 'module_id', id: string, direction: 'up' | 'down') {
  const db = supabase();
  const { data: current } = await db.from(table).select(`id, ${parentColumn}`).eq('id', id).single();
  if (!current) return;
  const parent = (current as Record<string, string>)[parentColumn];
  const { data: siblings } = await db.from(table).select('id').eq(parentColumn, parent).order('position');
  const list = siblings ?? [];
  const i = list.findIndex((r) => r.id === id);
  const j = direction === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  await Promise.all(list.map((r, index) => db.from(table).update({ position: index + 1 }).eq('id', r.id)));
}

export const moveModule = (id: string, direction: 'up' | 'down') => reorder('modules', 'course_id', id, direction);
export const moveLesson = (id: string, direction: 'up' | 'down') => reorder('lessons', 'module_id', id, direction);

export async function deleteModule(moduleId: string) {
  await supabase().from('modules').delete().eq('id', moduleId);
}

// ---------- Lessons ----------
export async function createLesson(moduleId: string, form: FormData): Promise<AdminState & { id?: string }> {
  const title = text(form.get('title'));
  if (title.length < 2) return { error: 'Enter a lesson title.' };
  const lessonSlug = slug.safeParse(slugify(title));
  if (!lessonSlug.success) return { error: lessonSlug.error.issues[0].message };
  const db = supabase();
  const { data: last } = await db.from('lessons').select('position').eq('module_id', moduleId).order('position', { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await db
    .from('lessons')
    .insert({ module_id: moduleId, title, slug: lessonSlug.data, position: (last?.position ?? 0) + 1, status: 'draft' })
    .select('id')
    .single();
  if (error) return { error: dbError(error) };
  await db.from('lesson_content').insert({ lesson_id: data.id, body_md: '' });
  return { message: 'Lesson created.', id: data.id };
}

const lessonSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug,
  summary: z.string().trim().max(400),
  duration_minutes: z.coerce.number().int().min(0).max(1000),
  is_preview: z.boolean(),
  status: z.enum(['draft', 'published']),
  module_id: z.guid(),
  body_md: z.string().max(200_000),
  video_url: optionalUrl,
});

export async function updateLesson(lessonId: string, form: FormData): Promise<AdminState> {
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
  const db = supabase();
  const now = new Date().toISOString();
  const { error } = await db.from('lessons').update({ ...meta, updated_at: now }).eq('id', lessonId);
  if (error) return { error: dbError(error) };
  const { error: contentError } = await db
    .from('lesson_content')
    .upsert({ lesson_id: lessonId, body_md, video_url, updated_at: now }, { onConflict: 'lesson_id' });
  if (contentError) return { error: dbError(contentError) };
  return { message: meta.status === 'published' ? 'Saved and published.' : 'Saved as draft.' };
}

export async function deleteLesson(lessonId: string) {
  await supabase().from('lessons').delete().eq('id', lessonId);
}

// ---------- Files and resources ----------
function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '').slice(-80) || 'file';
}

/** Uploads to the private bucket (storage policies allow admins only). */
export async function uploadLessonFile(lessonId: string, file: File) {
  const path = `lessons/${lessonId}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase().storage.from('course-files').upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw new Error(error.message);
  return path;
}

export async function setLessonVideoPath(lessonId: string, path: string | null) {
  const { error } = await supabase()
    .from('lesson_content')
    .upsert({ lesson_id: lessonId, video_path: path, updated_at: new Date().toISOString() }, { onConflict: 'lesson_id' });
  if (error) throw new Error(dbError(error));
}

export async function addResource(input: {
  lessonId: string;
  title: string;
  kind: 'pdf' | 'template' | 'worksheet' | 'link' | 'file';
  storagePath: string | null;
  externalUrl: string | null;
}): Promise<AdminState> {
  if (!input.title.trim()) return { error: 'Enter a resource title.' };
  if (!input.storagePath && !input.externalUrl) return { error: 'Upload a file or provide a link.' };
  if (input.externalUrl && !/^https?:\/\//.test(input.externalUrl)) return { error: 'Use a full https:// link.' };
  const db = supabase();
  const { count } = await db.from('lesson_resources').select('id', { count: 'exact', head: true }).eq('lesson_id', input.lessonId);
  const { error } = await db.from('lesson_resources').insert({
    lesson_id: input.lessonId,
    title: input.title.trim(),
    kind: input.kind,
    storage_path: input.storagePath,
    external_url: input.externalUrl,
    position: (count ?? 0) + 1,
  });
  return error ? { error: dbError(error) } : { message: 'Resource added.' };
}

export async function deleteResource(resourceId: string) {
  const db = supabase();
  const { data } = await db.from('lesson_resources').select('storage_path').eq('id', resourceId).maybeSingle();
  if (data?.storage_path) await db.storage.from('course-files').remove([data.storage_path]);
  await db.from('lesson_resources').delete().eq('id', resourceId);
}
