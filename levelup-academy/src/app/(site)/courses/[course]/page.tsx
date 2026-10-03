import type { Metadata } from 'next';

import { CourseView } from '@/components/course/course-view';
import { staticCatalog } from '@/lib/catalog-static';

// Every seeded course is pre-rendered. "__fallback__" serves courses added later
// in the admin area (Netlify rewrites unknown /courses/* URLs to it).
export const dynamicParams = false;
export function generateStaticParams() {
  return [...staticCatalog().map((c) => ({ course: c.slug })), { course: '__fallback__' }];
}

export async function generateMetadata({ params }: PageProps<'/courses/[course]'>): Promise<Metadata> {
  const { course: slug } = await params;
  const course = staticCatalog().find((c) => c.slug === slug);
  if (!course) return { title: 'Course' };
  return { title: course.title, description: course.subtitle, openGraph: { title: course.title, description: course.subtitle } };
}

export default async function CoursePage({ params }: PageProps<'/courses/[course]'>) {
  const { course: slug } = await params;
  return <CourseView initial={staticCatalog().find((c) => c.slug === slug) ?? null} />;
}
