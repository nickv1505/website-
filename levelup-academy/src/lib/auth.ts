import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';

import { supabaseConfig } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export type Viewer = {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin';
  hasAccess: boolean;
};

/** The signed-in user (verified with Supabase Auth) or null. Cached per request. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!supabaseConfig()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const [{ data: profile }, { data: entitlement }] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', data.user.id).maybeSingle(),
    supabase.from('entitlements').select('status').eq('user_id', data.user.id).maybeSingle(),
  ]);

  return {
    id: data.user.id,
    email: data.user.email ?? '',
    fullName: profile?.full_name ?? '',
    role: profile?.role === 'admin' ? 'admin' : 'student',
    hasAccess: entitlement?.status === 'active',
  };
});

export async function requireViewer(next = '/dashboard'): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect(`/login?next=${encodeURIComponent(next)}`);
  return viewer;
}

/** Admin check done on the server from the database role. Non-admins get a 404. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer || viewer.role !== 'admin') notFound();
  return viewer;
}

/** Only allow same-site relative redirects (prevents open redirects). */
export function safeNext(next: unknown, fallback = '/dashboard'): string {
  const value = typeof next === 'string' ? next : '';
  return value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback;
}
