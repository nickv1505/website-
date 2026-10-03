'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { CourseIcon, Icons } from '@/components/ui/icons';
import { ProgressBar } from '@/components/ui/progress';

export type LibraryItem = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  icon: string;
  modules: number;
  lessons: number;
  hours: number;
  searchText: string; // course + module + lesson titles, lowercased
  progress?: { percent: number; done: number; total: number };
  href: string;
};

export function CourseLibrary({ items, showProgress = false }: { items: LibraryItem[]; showProgress?: boolean }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.category)))], [items]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter(
      (i) => (category === 'All' || i.category === category) && words.every((w) => i.searchText.includes(w))
    );
  }, [items, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search courses and lessons</span>
          <Icons.search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses and lessons…"
            className="input pl-10"
          />
        </label>
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                category === c ? 'border-accent/40 bg-accent/10 text-accent' : 'border-line text-muted hover:border-line-strong hover:text-fg'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-subtle" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'course' : 'courses'}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line-strong p-10 text-center">
          <p className="font-medium">No courses match your search.</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-3 text-sm text-accent hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <li key={c.slug}>
              <Link href={c.href} className="card card-hover group flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-2xl border border-line-strong bg-surface-2 text-accent">
                    <CourseIcon name={c.icon} size={20} />
                  </span>
                  <span className="rounded-full border border-line px-2.5 py-1 text-[11px] uppercase tracking-[.12em] text-subtle">{c.category}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{c.subtitle}</p>
                <div className="mt-auto pt-6">
                  {showProgress && c.progress ? (
                    <>
                      <div className="mb-2 flex justify-between text-xs text-muted">
                        <span>
                          {c.progress.done}/{c.progress.total} lessons
                        </span>
                        <span className="text-fg">{c.progress.percent}%</span>
                      </div>
                      <ProgressBar percent={c.progress.percent} label={`${c.title} progress`} />
                    </>
                  ) : (
                    <p className="text-xs text-subtle">
                      {c.modules} modules · {c.lessons} lessons · ~{c.hours} hrs
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
