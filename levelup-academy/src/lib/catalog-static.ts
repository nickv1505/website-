import 'server-only';
import path from 'node:path';

// Build-time catalog read from content/courses (metadata only, no lesson bodies).
// Used to pre-render public pages; the live catalog is refreshed from Supabase in the browser.
import { loadCourses, stableId } from '../../scripts/lib/content.mjs';
import type { CourseWithModules } from '@/lib/types';

type Raw = {
  slug: string; title: string; subtitle: string; description: string; category: string; icon: string; position: number;
  modules: { position: number; title: string; slug: string; summary: string; minutes: number; preview: boolean; status: string }[];
};

let cache: CourseWithModules[] | null = null;

export function staticCatalog(): CourseWithModules[] {
  if (cache) return cache;
  const raw = loadCourses(path.join(process.cwd(), 'content', 'courses')) as Raw[];
  cache = raw.map((c) => {
    const courseId = stableId('course', c.slug);
    return {
      id: courseId, slug: c.slug, title: c.title, subtitle: c.subtitle, description: c.description, category: c.category,
      icon: c.icon, thumbnail_url: null, position: c.position, is_published: true,
      modules: c.modules
        .filter((m) => m.status === 'published')
        .map((m) => {
          const moduleId = stableId('module', c.slug, m.slug);
          return {
            id: moduleId, course_id: courseId, title: m.title, summary: m.summary, position: m.position, is_published: true,
            lessons: [{
              id: stableId('lesson', c.slug, m.slug), module_id: moduleId, course_id: courseId, slug: m.slug, title: m.title,
              summary: m.summary, duration_minutes: m.minutes, position: 1, is_preview: m.preview, status: 'published' as const,
            }],
          };
        }),
    };
  });
  return cache;
}
