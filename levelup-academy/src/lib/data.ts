'use client';
import { useEffect, useState } from 'react';

import { shapeCourse } from '@/lib/catalog-utils';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import type { CourseWithModules, LessonResource } from '@/lib/types';

const CATALOG_SELECT =
  'id, slug, title, subtitle, description, category, icon, thumbnail_url, position, is_published, ' +
  'modules(id, course_id, title, summary, position, is_published, ' +
  'lessons(id, module_id, course_id, slug, title, summary, duration_minutes, position, is_preview, status))';

let catalogPromise: Promise<CourseWithModules[]> | null = null;

/** Live, published catalog (titles and outlines only; lesson bodies are protected). */
export function fetchCatalog(force = false): Promise<CourseWithModules[]> {
  if (!supabaseConfigured()) return Promise.resolve([]);
  if (!catalogPromise || force) {
    catalogPromise = (async () => {
      const { data, error } = await supabase().from('courses').select(CATALOG_SELECT).eq('is_published', true).order('position');
      if (error) throw new Error(error.message);
      return (data as unknown as CourseWithModules[]).map((c) => shapeCourse(c));
    })();
    catalogPromise.catch(() => (catalogPromise = null));
  }
  return catalogPromise;
}

/** Starts with the pre-rendered catalog and refreshes it from the database. */
export function useCatalog(initial: CourseWithModules[] = []) {
  const [catalog, setCatalog] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    fetchCatalog()
      .then((c) => active && c.length && setCatalog(c))
      .catch(() => undefined)
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);
  return { catalog, loaded };
}

export type LessonBody = {
  body_md: string;
  video_url: string | null;
  video_signed_url: string | null;
  resources: LessonResource[];
};

/** Returns null when row level security says this viewer may not read the lesson. */
export async function fetchLessonBody(lessonId: string): Promise<LessonBody | null> {
  const db = supabase();
  const [{ data: content }, { data: resources }] = await Promise.all([
    db.from('lesson_content').select('body_md, video_url, video_path').eq('lesson_id', lessonId).maybeSingle(),
    db.from('lesson_resources').select('id, title, kind, storage_path, external_url, position').eq('lesson_id', lessonId).order('position'),
  ]);
  if (!content) return null;
  const signed = async (path: string | null) => {
    if (!path) return null;
    const { data } = await db.storage.from('course-files').createSignedUrl(path, 60 * 60);
    return data?.signedUrl ?? null;
  };
  return {
    body_md: content.body_md,
    video_url: content.video_url,
    video_signed_url: await signed(content.video_path),
    resources: await Promise.all(
      ((resources ?? []) as LessonResource[]).map(async (r) => ({ ...r, url: r.external_url || (await signed(r.storage_path)) }))
    ),
  };
}

export type Progress = { completed: Set<string>; recent: { lesson_id: string; visited_at: string }[] };

export async function fetchProgress(userId: string): Promise<Progress> {
  const db = supabase();
  const [{ data: done }, { data: visits }] = await Promise.all([
    db.from('lesson_progress').select('lesson_id').eq('user_id', userId),
    db.from('lesson_visits').select('lesson_id, visited_at').eq('user_id', userId).order('visited_at', { ascending: false }).limit(20),
  ]);
  return {
    completed: new Set((done ?? []).map((r) => r.lesson_id as string)),
    recent: (visits ?? []) as Progress['recent'],
  };
}

export async function setLessonComplete(userId: string, lessonId: string, complete: boolean) {
  const db = supabase();
  const { error } = complete
    ? await db.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id', ignoreDuplicates: true })
    : await db.from('lesson_progress').delete().eq('user_id', userId).eq('lesson_id', lessonId);
  if (error) throw new Error('Could not save your progress. Please try again.');
}

export async function recordVisit(userId: string, lessonId: string) {
  await supabase()
    .from('lesson_visits')
    .upsert({ user_id: userId, lesson_id: lessonId, visited_at: new Date().toISOString() }, { onConflict: 'user_id,lesson_id' });
}

export type CheckoutResult = { url: string } | { alreadyPurchased: true } | { error: string };

/** Asks the create-checkout Edge Function (server side) for a Stripe Checkout URL. */
export async function startCheckout(): Promise<CheckoutResult> {
  const { data, error } = await supabase().functions.invoke('create-checkout', { body: {} });
  if (error) {
    let code = 'stripe';
    try {
      const body = await (error as { context?: Response }).context?.json();
      if (body?.error) code = body.error;
    } catch {
      // keep default
    }
    if (/Failed to send|fetch/i.test(String(error.message)) && code === 'stripe') code = 'not_deployed';
    return { error: code };
  }
  return data as CheckoutResult;
}
