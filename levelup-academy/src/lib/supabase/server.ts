import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { supabaseConfig } from '@/lib/env';

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Runs as the signed-in user, so every query is subject to row level security.
 */
export async function createClient() {
  const config = supabaseConfig();
  if (!config) throw new Error('Supabase is not configured. See .env.example.');
  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // The proxy refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}
