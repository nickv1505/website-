'use client';
import { createBrowserClient } from '@supabase/ssr';

/** Browser client (used for admin file uploads). Subject to row level security. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!
  );
}
