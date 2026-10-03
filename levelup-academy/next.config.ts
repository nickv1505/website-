import type { NextConfig } from 'next';

/**
 * Static export: `npm run build` writes a plain folder (out/) that can be
 * dragged onto Netlify Drop or any static host. Accounts, lessons and progress
 * talk to Supabase directly from the browser (protected by row level security);
 * payments run in Supabase Edge Functions (supabase/functions).
 */
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
