'use client';
import Link from 'next/link';
import { useActionState } from 'react';

import { requestPasswordReset, signIn, signUp, updatePassword, updateProfile, type FormState } from '@/app/actions/auth';
import { SubmitButton } from '@/components/ui/submit-button';

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

export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert state={state} />
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} className="input" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="label">Password</label>
          <Link href="/forgot-password" className="mb-1.5 text-sm text-muted hover:text-fg">Forgot password?</Link>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      <SubmitButton className="w-full" pendingText="Signing in…">Sign in</SubmitButton>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUp, undefined);
  if (state?.message) return <Alert state={state} />;
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert state={state} />
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="fullName" className="label">Full name</label>
        <input id="fullName" name="fullName" autoComplete="name" required defaultValue={state?.fields?.fullName} className="input" />
      </div>
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} className="input" />
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
      <SubmitButton className="w-full" pendingText="Creating account…">Create account</SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, undefined);
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="input" />
      </div>
      <SubmitButton className="w-full" pendingText="Sending…">Send reset link</SubmitButton>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePassword, undefined);
  return (
    <form action={action} className="space-y-5" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="password" className="label">New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="input" />
      </div>
      <div>
        <label htmlFor="confirm" className="label">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className="input" />
      </div>
      <SubmitButton className="w-full" pendingText="Saving…">Update password</SubmitButton>
    </form>
  );
}

export function ProfileForm({ fullName }: { fullName: string }) {
  const [state, action] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="space-y-4" noValidate>
      <Alert state={state} />
      <div>
        <label htmlFor="fullName" className="label">Full name</label>
        <input id="fullName" name="fullName" defaultValue={fullName} autoComplete="name" required className="input" />
      </div>
      <SubmitButton variant="secondary" pendingText="Saving…">Save changes</SubmitButton>
    </form>
  );
}
