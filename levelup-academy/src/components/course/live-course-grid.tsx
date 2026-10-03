'use client';
import { CourseCard } from '@/components/course/course-card';
import { useCatalog } from '@/lib/data';
import type { CourseWithModules } from '@/lib/types';

export function LiveCourseGrid({ initial }: { initial: CourseWithModules[] }) {
  const { catalog } = useCatalog(initial);
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {catalog.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
