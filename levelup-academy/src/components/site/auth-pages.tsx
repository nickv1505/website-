'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { AuthShell } from '@/components/site/auth-shell';
import { ForgotPasswordForm, NewPasswordForm, SignInForm, SignUpForm } from '@/components/site/auth-forms';
import { offer } from '@/config/site';
import { safeNext, useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

function useNext() {
  return safeNext(useSearchParams().get('next'));
}

/** Signed-in visitors skip the sign-in/up pages. */
function useRedirectIfSignedIn(next: string) {
  const { viewer, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && viewer) router.replace(next);
  }, [loading, viewer, next, router]);
}

export function LoginView() {
  const next = useNext();
  const error = useSearchParams().get('error');
  useRedirectIfSignedIn(next);
  return (
    <AuthShell
      title="Welcome back"
      subtitle={error === 'link' ? 'That link is invalid or has expired. Please try again.' : 'Sign in to continue learning.'}
      footer={
        <>
          New here?{' '}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-fg underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm next={next} />
    </AuthShell>
  );
}

export function SignUpView() {
  const next = useNext();
  useRedirectIfSignedIn(next);
  return (
    <AuthShell
      title="Create your account"
      subtitle={next === '/checkout' ? `Next, you'll complete your one-time ${offer.priceLabelLong} payment with Stripe.` : 'Free to create. Read the preview lessons and track your progress.'}
      footer={
        <>
          Already have an account?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-fg underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm next={next} />
    </AuthShell>
  );
}

export function ForgotPasswordView() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure link to choose a new password."
      footer={<Link href="/login" className="text-fg underline underline-offset-4">Back to sign in</Link>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

export function ResetPasswordView() {
  const { viewer, loading } = useAuth();
  if (loading) return <AuthShell title="Choose a new password"><p className="text-muted">Loading…</p></AuthShell>;
  if (!viewer) {
    return (
      <AuthShell title="Link expired" subtitle="This password reset link is invalid or has expired.">
        <Link href="/forgot-password" className="text-accent underline underline-offset-4">Request a new link</Link>
      </AuthShell>
    );
  }
  return (
    <AuthShell title="Choose a new password" subtitle={`Signed in as ${viewer.email}`} footer={<Link href="/dashboard" className="text-fg underline underline-offset-4">Go to dashboard</Link>}>
      <NewPasswordForm />
    </AuthShell>
  );
}

/** Handles email confirmation and password reset links (PKCE code or token hash). */
export function AuthCallbackView() {
  const params = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const next = safeNext(params.get('next'));
      const code = params.get('code');
      const tokenHash = params.get('token_hash');
      const type = params.get('type');
      const db = supabase();
      let ok = false;
      if (code) ok = !(await db.auth.exchangeCodeForSession(code)).error;
      else if (tokenHash && type) ok = !(await db.auth.verifyOtp({ type: type as 'signup', token_hash: tokenHash })).error;
      else ok = Boolean((await db.auth.getSession()).data.session);
      await refresh();
      router.replace(ok ? next : '/login?error=link');
    })();
  }, [params, refresh, router]);
  return (
    <AuthShell title="Signing you in…">
      <p className="flex items-center gap-2 text-muted" role="status">
        <span className="size-4 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden /> One moment…
      </p>
    </AuthShell>
  );
}
