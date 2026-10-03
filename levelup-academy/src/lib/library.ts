import type { LibraryItem } from '@/components/course/course-library';
import { allLessons, courseProgress } from '@/lib/catalog-utils';
import type { CourseWithModules } from '@/lib/types';

export function toLibraryItems(catalog: CourseWithModules[], completed?: Set<string>): LibraryItem[] {
  return catalog.map((c) => {
    const lessons = allLessons(c);
    const minutes = lessons.reduce((n, l) => n + l.duration_minutes, 0);
    const p = completed ? courseProgress(c, completed) : null;
    return {
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      category: c.category,
      icon: c.icon,
      modules: c.modules.length,
      lessons: lessons.length,
      hours: Math.max(1, Math.round(minutes / 60)),
      searchText: [c.title, c.subtitle, c.category, ...c.modules.map((m) => m.title), ...lessons.map((l) => l.title)].join(' ').toLowerCase(),
      progress: p ? { percent: p.percent, done: p.done, total: p.total } : undefined,
      href: `/courses/${c.slug}`,
    };
  });
}
