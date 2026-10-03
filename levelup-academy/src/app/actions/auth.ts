'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { siteUrl } from '@/config/site';
import { getViewer, safeNext } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export type FormState = { error?: string; message?: string; fields?: Record<string, string> } | undefined;

const email = z.email('Enter a valid email address.').max(254);
const password = z.string().min(8, 'Use at least 8 characters.').max(72, 'Use 72 characters or fewer.');

function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/email not confirmed/i.test(message)) return 'Please confirm your email address first. Check your inbox.';
  if (/already registered|already exists/i.test(message)) return 'An account with this email already exists. Try signing in.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a minute and try again.';
  return 'Something went wrong. Please try again.';
}

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const parsed = z.object({ email, password: z.string().min(1, 'Enter your password.') }).safeParse({
    email: form.get('email'),
    password: form.get('password'),
  });
  const fields = { email: String(form.get('email') ?? '') };
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: friendly(error.message), fields };

  revalidatePath('/', 'layout');
  redirect(safeNext(form.get('next')));
}

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const parsed = z
    .object({ fullName: z.string().trim().min(1, 'Enter your name.').max(120), email, password })
    .safeParse({ fullName: form.get('fullName'), email: form.get('email'), password: form.get('password') });
  const fields = { fullName: String(form.get('fullName') ?? ''), email: String(form.get('email') ?? '') };
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };
  if (form.get('terms') !== 'on') return { error: 'Please accept the Terms and Privacy Policy.', fields };

  const next = safeNext(form.get('next'));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: friendly(error.message), fields };

  if (!data.session) {
    return { message: `We sent a confirmation link to ${parsed.data.email}. Open it to activate your account.` };
  }
  revalidatePath('/', 'layout');
  redirect(next);
}

export async function requestPasswordReset(_: FormState, form: FormData): Promise<FormState> {
  const parsed = email.safeParse(form.get('email'));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl()}/auth/callback?next=/reset-password`,
  });
  // Same response whether or not the account exists.
  return { message: 'If an account exists for that email, a reset link is on its way.' };
}

export async function updatePassword(_: FormState, form: FormData): Promise<FormState> {
  const parsed = password.safeParse(form.get('password'));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (form.get('password') !== form.get('confirm')) return { error: 'Passwords do not match.' };
  const viewer = await getViewer();
  if (!viewer) return { error: 'Your reset link has expired. Please request a new one.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { error: /different from the old/i.test(error.message) ? 'Choose a password you have not used before.' : friendly(error.message) };
  return { message: 'Your password has been updated.' };
}

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const parsed = z.string().trim().min(1, 'Enter your name.').max(120).safeParse(form.get('fullName'));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const viewer = await getViewer();
  if (!viewer) return { error: 'Please sign in again.' };
  const supabase = await createClient();
  // Only full_name is writable by users (enforced by column privileges in the database).
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: parsed.data, updated_at: new Date().toISOString() })
    .eq('id', viewer.id);
  if (error) return { error: 'Could not save your changes.' };
  revalidatePath('/account');
  return { message: 'Profile saved.' };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
