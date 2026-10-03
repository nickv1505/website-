import type { Metadata } from 'next';

import { LessonView } from '@/components/course/lesson-view';
import { staticCatalog } from '@/lib/catalog-static';
import { allLessons } from '@/lib/catalog-utils';

export const dynamicParams = false;
export function generateStaticParams() {
  return [
    ...staticCatalog().flatMap((c) => allLessons(c).map((l) => ({ course: c.slug, lesson: l.slug }))),
    { course: '__fallback__', lesson: '__fallback__' },
  ];
}

export async function generateMetadata({ params }: PageProps<'/courses/[course]/[lesson]'>): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const course = staticCatalog().find((c) => c.slug === courseSlug);
  const lesson = course && allLessons(course).find((l) => l.slug === lessonSlug);
  if (!course || !lesson) return { title: 'Lesson' };
  return {
    title: `${lesson.title} · ${course.title}`,
    description: lesson.summary,
    robots: lesson.is_preview ? undefined : { index: false },
  };
}

export default async function LessonPage({ params }: PageProps<'/courses/[course]/[lesson]'>) {
  const { course: slug } = await params;
  return <LessonView initial={staticCatalog().find((c) => c.slug === slug) ?? null} />;
}
