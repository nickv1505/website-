'use client';
import { CourseLibrary } from '@/components/course/course-library';
import { ButtonLink } from '@/components/ui/button';
import { offer } from '@/config/site';
import { useAuth } from '@/lib/auth';
import { catalogStats } from '@/lib/catalog-utils';
import { useCatalog } from '@/lib/data';
import { toLibraryItems } from '@/lib/library';
import type { CourseWithModules } from '@/lib/types';

export function CoursesView({ initial }: { initial: CourseWithModules[] }) {
  const { catalog } = useCatalog(initial);
  const { viewer } = useAuth();
  const stats = catalogStats(catalog);
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="eyebrow">Course library</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Every course, one purchase.</h1>
          <p className="mt-4 text-lg text-muted">
            {stats.courses} courses, {stats.modules} modules and {stats.lessons} step-by-step lessons. Browse the outlines and read the
            free preview lesson in each course.
          </p>
        </div>
        {!viewer?.hasAccess && <ButtonLink href="/checkout">Unlock everything: {offer.priceLabel}</ButtonLink>}
      </div>
      <div className="mt-12">
        <CourseLibrary items={toLibraryItems(catalog)} />
      </div>
    </div>
  );
}
