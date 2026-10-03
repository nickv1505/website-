'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { getViewer } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const input = z.object({ lessonId: z.guid(), complete: z.boolean(), path: z.string().startsWith('/') });

export type ProgressResult = { ok: true; complete: boolean } | { ok: false; error: string };

/**
 * Marks a lesson complete or incomplete. Row level security only accepts the
 * insert when the user can open the lesson (preview, paid access, or admin).
 */
export async function setLessonComplete(raw: { lessonId: string; complete: boolean; path: string }): Promise<ProgressResult> {
  const parsed = input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Invalid request.' };
  const viewer = await getViewer();
  if (!viewer) return { ok: false, error: 'Please sign in to track progress.' };

  const supabase = await createClient();
  const { lessonId, complete, path } = parsed.data;
  const { error } = complete
    ? await supabase.from('lesson_progress').upsert({ user_id: viewer.id, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id', ignoreDuplicates: true })
    : await supabase.from('lesson_progress').delete().eq('user_id', viewer.id).eq('lesson_id', lessonId);

  if (error) return { ok: false, error: 'Could not save your progress. Please try again.' };
  revalidatePath(path);
  revalidatePath('/dashboard');
  return { ok: true, complete };
}
