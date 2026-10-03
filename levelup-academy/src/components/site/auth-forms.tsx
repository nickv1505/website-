'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { z } from 'zod';

import { buttonClass } from '@/components/ui/button';
import { safeNext, useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

type FormState = { error?: string; message?: string } | undefined;

const emailSchema = z.email('Enter a valid email address.').max(254);
const passwordSchema = z.string().min(8, 'Use at least 8 characters.').max(72, 'Use 72 characters or fewer.');

function friendly(message: string) {
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/email not confirmed/i.test(message)) return 'Please confirm your email address first. Check your inbox.';
  if (/already registered|already exists/i.test(message)) return 'An account with this email already exists. Try signing in.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a minute and try again.';
  if (/different from the old/i.test(message)) return 'Choose a password you have not used before.';
  return 'Something went wrong. Please try again.';
}

function Alert({ state }: { state: FormState }) {
  if (state?.error)
    return (
      <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
        {state.error}
      </p>
    );
  if (state?.message)
    return (
      <p role="status" className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
        {state.message}
      </p>
    );
  return null;
}

function Submit({ pending, children, pendingText, variant = 'primary', full = true }: { pending: boolean; children: ReactNode; pendingText: string; variant?: 'primary' | 'secondary'; full?: boolean }) {
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={buttonClass(variant, 'md', full ? 'w-full' : '')}>
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Small helper: runs an async handler with pending/error state. */
function useSubmit(handler: (form: FormData) => Promise<FormState | void>) {
  const [state, setState] = useState<FormState>();
  const [pending, setPending] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setState(undefined);
    try {
      const result = await handler(new FormData(e.currentTarget));
      if (result) setState(result);
    } catch (err) {
      setState({ error: err instanceof Error ? friendly(err.message) : 'Something went wrong.' });
    } finally {
      setPending(false);
    }
  }
  return { state, pending, onSubmit };
}

export function SignInForm({ next }: { next: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const { state, pending, onSubmit } = useSubmit(async (form) => {
    const parsed = z.object({ email: emailSchema, password: z.string().min(1, 'Enter your password.') }).safeParse({
      email: form.get('email'),
      password: form.get('password'),
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const { error } = await supabase().auth.signInWithPassword(parsed.data);
    if (error) return { error: friendly(error.message) };
    await refresh();
    router.replace(safeNext(next));
  });
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="label">Password</label>
          <Link href="/forgot-password" className="mb-1.5 text-sm text-muted hover:text-fg">Forgot password?</Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      <Submit pending={pending} pendingText="Signing in…">Sign in</Submit>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const { state, pending, onSubmit } = useSubmit(async (form) => {
    const parsed = z
      .object({ fullName: z.string().trim().min(1, 'Enter your name.').max(120), email: emailSchema, password: passwordSchema })
      .safeParse({ fullName: form.get('fullName'), email: form.get('email'), password: form.get('password') });
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    if (form.get('terms') !== 'on') return { error: 'Please accept the Terms and Privacy Policy.' };
    const target = safeNext(next);
    const { data, error } = await supabase().auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`,
      },
    });
    if (error) return { error: friendly(error.message) };
    if (!data.session) return { message: `We sent a confirmation link to ${parsed.data.email}. Open it to activate your account.` };
    await refresh();
    router.replace(target);
  });
  if (state?.message) return <Alert state={state} />;
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="fullName" className="label">Full name</label>
        <input id="fullName" name="fullName" autoComplete="name" required className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required aria-describedby="pw-hint" className="input" />
        <p id="pw-hint" className="mt-1.5 text-xs text-subtle">At least 8 characters.</p>
      </div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="terms" required className="mt-0.5 size-4 accent-[var(--color-accent)]" />
        <span>
          I agree to the <Link href="/terms" className="text-fg underline underline-offset-4">Terms</Link> and{' '}
          <Link href="/privacy" className="text-fg underline underline-offset-4">Privacy Policy</Link>.
        </span>
      </label>
      <Submit pending={pending} pendingText="Creating account…">Create account</Submit>
    </form>
  );
}

export function ForgotPasswordForm() {
  const { state, pending, onSubmit } = useSubmit(async (form) => {
    const parsed = emailSchema.safeParse(form.get('email'));
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    await supabase().auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    return { message: 'If an account exists for that email, a reset link is on its way.' };
  });
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <Submit pending={pending} pendingText="Sending…">Send reset link</Submit>
    </form>
  );
}

export function NewPasswordForm() {
  const { state, pending, onSubmit } = useSubmit(async (form) => {
    const parsed = passwordSchema.safeParse(form.get('password'));
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    if (form.get('password') !== form.get('confirm')) return { error: 'Passwords do not match.' };
    const { error } = await supabase().auth.updateUser({ password: parsed.data });
    if (error) return { error: friendly(error.message) };
    return { message: 'Your password has been updated.' };
  });
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="password" className="label">New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="input" />
      </div>
      <div>
        <label htmlFor="confirm" className="label">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className="input" />
      </div>
      <Submit pending={pending} pendingText="Saving…">Update password</Submit>
    </form>
  );
}

export function ProfileForm({ userId, fullName }: { userId: string; fullName: string }) {
  const { refresh } = useAuth();
  const { state, pending, onSubmit } = useSubmit(async (form) => {
    const parsed = z.string().trim().min(1, 'Enter your name.').max(120).safeParse(form.get('fullName'));
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    // Only full_name is writable by users (enforced by column privileges in the database).
    const { error } = await supabase()
      .from('profiles')
      .update({ full_name: parsed.data, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) return { error: 'Could not save your changes.' };
    await refresh();
    return { message: 'Profile saved.' };
  });
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="fullName" className="label">Full name</label>
        <input id="fullName" name="fullName" defaultValue={fullName} autoComplete="name" required className="input" />
      </div>
      <Submit pending={pending} pendingText="Saving…" variant="secondary" full={false}>Save changes</Submit>
    </form>
  );
}
