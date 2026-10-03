import 'server-only';
import { cache } from 'react';

import { supabaseConfig } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import type { Course, CourseWithModules, LessonMeta, LessonResource, ModuleWithLessons } from '@/lib/types';

const COURSE_FIELDS = 'id, slug, title, subtitle, description, category, icon, thumbnail_url, position, is_published';
const MODULE_FIELDS = 'id, course_id, title, summary, position, is_published';
const LESSON_FIELDS =
  'id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status';

type RawCourse = Course & {
  modules: (Omit<ModuleWithLessons, 'lessons'> & { lessons: LessonMeta[] })[];
};

function shape(course: RawCourse, includeDrafts: boolean): CourseWithModules {
  const modules = [...(course.modules ?? [])]
    .filter((m) => includeDrafts || m.is_published)
    .sort((a, b) => a.position - b.position)
    .map((m) => ({
      ...m,
      lessons: [...(m.lessons ?? [])]
        .filter((l) => includeDrafts || l.status === 'published')
        .sort((a, b) => a.position - b.position),
    }))
    .filter((m) => includeDrafts || m.lessons.length > 0);
  return { ...course, modules };
}

/** Published catalog with the curriculum (titles only; lesson bodies are protected). */
export const getCatalog = cache(async (): Promise<CourseWithModules[]> => {
  if (!supabaseConfig()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select(`${COURSE_FIELDS}, modules(${MODULE_FIELDS}, lessons(${LESSON_FIELDS}))`)
    .eq('is_published', true)
    .order('position');
  if (error) throw new Error(`Could not load courses: ${error.message}`);
  return (data as unknown as RawCourse[]).map((c) => shape(c, false));
});

export const getCourseBySlug = cache(async (slug: string): Promise<CourseWithModules | null> => {
  const catalog = await getCatalog();
  return catalog.find((c) => c.slug === slug) ?? null;
});

export function allLessons(course: CourseWithModules): LessonMeta[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function catalogStats(catalog: CourseWithModules[]) {
  const lessons = catalog.flatMap(allLessons);
  return {
    courses: catalog.length,
    modules: catalog.reduce((n, c) => n + c.modules.length, 0),
    lessons: lessons.length,
    minutes: lessons.reduce((n, l) => n + l.duration_minutes, 0),
  };
}

export type LessonBody = {
  body_md: string;
  video_url: string | null;
  video_signed_url: string | null;
  resources: LessonResource[];
};

/**
 * Loads a lesson body. Row level security returns nothing unless the lesson is
 * a free preview, the viewer has lifetime access, or the viewer is an admin.
 */
export async function getLessonBody(lessonId: string): Promise<LessonBody | null> {
  const supabase = await createClient();
  const [{ data: content }, { data: resources }] = await Promise.all([
    supabase.from('lesson_content').select('body_md, video_url, video_path').eq('lesson_id', lessonId).maybeSingle(),
    supabase
      .from('lesson_resources')
      .select('id, title, kind, storage_path, external_url, position')
      .eq('lesson_id', lessonId)
      .order('position'),
  ]);
  if (!content) return null;

  const signed = async (path: string | null) => {
    if (!path) return null;
    const { data } = await supabase.storage.from('course-files').createSignedUrl(path, 60 * 60);
    return data?.signedUrl ?? null;
  };

  return {
    body_md: content.body_md,
    video_url: content.video_url,
    video_signed_url: await signed(content.video_path),
    resources: await Promise.all(
      ((resources ?? []) as LessonResource[]).map(async (r) => ({
        ...r,
        url: r.external_url || (await signed(r.storage_path)),
      }))
    ),
  };
}

export type Progress = {
  completed: Set<string>;
  recent: { lesson_id: string; visited_at: string }[];
};

export async function getProgress(userId: string): Promise<Progress> {
  const supabase = await createClient();
  const [{ data: done }, { data: visits }] = await Promise.all([
    supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId),
    supabase
      .from('lesson_visits')
      .select('lesson_id, visited_at')
      .eq('user_id', userId)
      .order('visited_at', { ascending: false })
      .limit(20),
  ]);
  return {
    completed: new Set((done ?? []).map((r) => r.lesson_id as string)),
    recent: (visits ?? []) as Progress['recent'],
  };
}

export function courseProgress(course: CourseWithModules, completed: Set<string>) {
  const lessons = allLessons(course);
  const done = lessons.filter((l) => completed.has(l.id)).length;
  const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[0] ?? null;
  return {
    total: lessons.length,
    done,
    percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0,
    next,
  };
}
