// Grants the admin role to an existing account. Runs with the service-role key,
// which only you have. Users can never make themselves admins from the website.
// Usage: npm run make-admin -- you@example.com
import { createClient } from '@supabase/supabase-js';

const email = process.argv[2];
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!email) {
  console.error('Usage: npm run make-admin -- you@example.com');
  process.exit(1);
}
if (!url || !key) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (e.g. in .env.local).');
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });
const { data, error } = await db.from('profiles').update({ role: 'admin' }).ilike('email', email).select('id, email, role');
if (error) {
  console.error('Failed:', error.message);
  process.exit(1);
}
if (!data.length) {
  console.error(`No account found for ${email}. Sign up on the website first, then run this again.`);
  process.exit(1);
}
console.log(`✓ ${data[0].email} is now an admin. Sign out and back in, then open /admin.`);
