import 'server-only';
import { createClient } from '@supabase/supabase-js';

import { supabaseConfig, supabaseSecretKey } from '@/lib/env';

/**
 * Service-role client. Bypasses row level security, so it is ONLY used by the
 * Stripe webhook to record verified payments. Never import it in client code.
 */
export function createAdminClient() {
  const config = supabaseConfig();
  const secret = supabaseSecretKey();
  if (!config || !secret) throw new Error('Supabase service credentials are not configured.');
  return createClient(config.url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
