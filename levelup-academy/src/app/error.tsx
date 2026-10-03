'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main id="main" className="container-page flex flex-1 flex-col items-center justify-center py-28 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">We couldn&apos;t load this page. Please try again. If the problem continues, contact support.</p>
      <button onClick={reset} className="mt-8 rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink">
        Try again
      </button>
    </main>
  );
}
