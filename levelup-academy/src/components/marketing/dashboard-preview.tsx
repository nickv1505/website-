import { CourseIcon, Icons } from '@/components/ui/icons';
import type { CourseWithModules } from '@/lib/types';

/** Illustration of the student dashboard (uses real course titles; progress values are illustrative). */
export function DashboardPreview({ courses }: { courses: CourseWithModules[] }) {
  const sample = courses.slice(0, 4);
  const demoProgress = [72, 38, 15, 0];
  const lessonCount = courses.reduce((n, c) => n + c.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);

  return (
    <figure className="relative" aria-label="Preview of the student dashboard">
      <div className="absolute -inset-x-10 -top-10 -bottom-16 -z-10 bg-[radial-gradient(closest-side,rgb(61_252_143/.13),transparent)] blur-2xl" />
      <div className="overflow-hidden rounded-[1.5rem] border border-line-strong bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="ml-3 rounded-md bg-white/5 px-3 py-1 font-mono text-[11px] text-subtle">levelup.academy/dashboard</span>
        </div>
        <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-line p-4 sm:block">
            <p className="text-[11px] font-medium uppercase tracking-[.14em] text-subtle">Library</p>
            <ul className="mt-3 space-y-1 text-[13px]">
              {['Dashboard', 'All courses', 'Continue', 'Resources', 'Account'].map((l, i) => (
                <li key={l} className={`rounded-lg px-2.5 py-1.5 ${i === 0 ? 'bg-white/6 text-fg' : 'text-muted'}`}>
                  {l}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-accent/25 bg-accent/5 p-3">
              <p className="text-[11px] text-accent">Lifetime access</p>
              <p className="mt-1 text-[12px] text-muted">{lessonCount || 'All'} lessons unlocked</p>
            </div>
          </aside>
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[.14em] text-subtle">Continue learning</p>
                <p className="mt-1 text-sm font-semibold">{sample[0]?.modules[2]?.title ?? 'Your next lesson'}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-ink">
                Resume <Icons.arrowRight size={13} />
              </span>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {sample.map((c, i) => (
                <li key={c.id} className="rounded-xl border border-line bg-surface-2 p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-white/5 text-accent">
                      <CourseIcon name={c.icon} size={16} />
                    </span>
                    <p className="line-clamp-1 text-[13px] font-medium">{c.title}</p>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${demoProgress[i]}%` }} />
                  </div>
                  <p className="mt-2 text-[11px] text-subtle">
                    {c.modules.length} modules · {demoProgress[i]}% complete
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Illustration of the dashboard. Progress values are examples.</figcaption>
    </figure>
  );
}
