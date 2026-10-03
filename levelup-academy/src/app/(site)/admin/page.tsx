import Link from 'next/link';

import { CourseForm } from '@/components/admin/forms';
import { CourseIcon } from '@/components/ui/icons';
import { createClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ data: courses }, { count: students }, { count: paid }] = await Promise.all([
    supabase.from('courses').select('id, slug, title, category, icon, is_published, modules(id, lessons(id, status))').order('position'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('entitlements').select('id', { count: 'exact', head: true }).eq('status', 'active'),
  ]);

  return (
    <div className="space-y-10">
      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          ['Courses', courses?.length ?? 0],
          ['Registered accounts', students ?? 0],
          ['Active lifetime access', paid ?? 0],
        ].map(([k, v]) => (
          <div key={k} className="card p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="mt-1 text-3xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <ul className="mt-5 divide-y divide-line rounded-[1.25rem] border border-line">
          {(courses ?? []).map((c) => {
            const lessons = c.modules.flatMap((m) => m.lessons);
            const drafts = lessons.filter((l) => l.status === 'draft').length;
            return (
              <li key={c.id}>
                <Link href={`/admin/courses/${c.id}`} className="flex items-center gap-4 p-4 hover:bg-white/3">
                  <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-accent">
                    <CourseIcon name={c.icon} size={18} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{c.title}</span>
                    <span className="text-xs text-subtle">
                      {c.modules.length} modules · {lessons.length} lessons{drafts ? ` · ${drafts} drafts` : ''}
                    </span>
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${c.is_published ? 'bg-accent/10 text-accent' : 'bg-white/5 text-muted'}`}>
                    {c.is_published ? 'Published' : 'Hidden'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="mb-5 text-lg font-semibold">Create a course</h2>
        <CourseForm />
      </section>
    </div>
  );
}
