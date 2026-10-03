'use client';
import type { Session } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { supabase, supabaseConfigured } from '@/lib/supabase';

export type Viewer = {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin';
  hasAccess: boolean;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  viewer: Viewer | null;
  refresh: () => Promise<Viewer | null>;
};

const AuthContext = createContext<AuthState>({ loading: true, session: null, viewer: null, refresh: async () => null });

async function loadViewer(session: Session | null): Promise<Viewer | null> {
  if (!session) return null;
  const db = supabase();
  const [{ data: profile }, { data: entitlement }] = await Promise.all([
    db.from('profiles').select('full_name, role').eq('id', session.user.id).maybeSingle(),
    db.from('entitlements').select('status').eq('user_id', session.user.id).maybeSingle(),
  ]);
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    fullName: profile?.full_name ?? '',
    role: profile?.role === 'admin' ? 'admin' : 'student',
    hasAccess: entitlement?.status === 'active',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AuthState, 'refresh'>>({ loading: true, session: null, viewer: null });

  const refresh = useCallback(async () => {
    if (!supabaseConfigured()) {
      setState({ loading: false, session: null, viewer: null });
      return null;
    }
    const { data } = await supabase().auth.getSession();
    const viewer = await loadViewer(data.session);
    setState({ loading: false, session: data.session, viewer });
    return viewer;
  }, []);

  useEffect(() => {
    let active = true;
    if (!supabaseConfigured()) {
      queueMicrotask(() => active && setState({ loading: false, session: null, viewer: null }));
      return;
    }
    const db = supabase();
    db.auth.getSession().then(async ({ data }) => {
      const viewer = await loadViewer(data.session);
      if (active) setState({ loading: false, session: data.session, viewer });
    });
    const { data: sub } = db.auth.onAuthStateChange((_event, session) => {
      // Defer database calls out of the auth callback (recommended by Supabase).
      setTimeout(async () => {
        const viewer = await loadViewer(session);
        if (active) setState({ loading: false, session, viewer });
      }, 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ ...state, refresh }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

let signingOut = false;

/** Signs out and goes home (without bouncing through the sign-in page). */
export async function signOutAndGoHome() {
  signingOut = true;
  await supabase().auth.signOut();
  // Full reload on purpose: clears every bit of in-memory account state.
  window.location.assign('/'); // eslint-disable-line @next/next/no-location-assign-relative-destination
}

/** Redirects to sign-in when signed out. Returns the viewer once known. */
export function useRequireViewer(): { loading: boolean; viewer: Viewer | null } {
  const { loading, viewer } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!loading && !viewer && !signingOut) {
      const next = pathname + (typeof window !== 'undefined' ? window.location.search : '');
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [loading, viewer, pathname, router]);
  return { loading: loading || !viewer, viewer };
}

/** Only allow same-site relative redirects (prevents open redirects). */
export function safeNext(next: unknown, fallback = '/dashboard'): string {
  const value = typeof next === 'string' ? next : '';
  return value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : fallback;
}
