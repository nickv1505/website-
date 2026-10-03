import type { CourseWithModules, LessonMeta } from '@/lib/types';

export function allLessons(course: CourseWithModules): LessonMeta[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function catalogStats(catalog: CourseWithModules[]) {
  const lessons = catalog.flatMap(allLessons);
  return {
    courses: catalog.length,
    modules: catalog.reduce((n, c) => n + c.modules.length, 0),
    lessons: lessons.length,
    minutes: lessons.reduce((n, l) => n + l.duration_minutes, 0),
  };
}

export function courseProgress(course: CourseWithModules, completed: Set<string>) {
  const lessons = allLessons(course);
  const done = lessons.filter((l) => completed.has(l.id)).length;
  const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[0] ?? null;
  return { total: lessons.length, done, percent: lessons.length ? Math.round((done / lessons.length) * 100) : 0, next };
}

/** Keeps only published modules/lessons, sorted by position. */
export function shapeCourse(course: CourseWithModules, includeDrafts = false): CourseWithModules {
  const modules = [...(course.modules ?? [])]
    .filter((m) => includeDrafts || m.is_published)
    .sort((a, b) => a.position - b.position)
    .map((m) => ({
      ...m,
      lessons: [...(m.lessons ?? [])]
        .filter((l) => includeDrafts || l.status === 'published')
        .sort((a, b) => a.position - b.position),
    }))
    .filter((m) => includeDrafts || m.lessons.length > 0);
  return { ...course, modules };
}
