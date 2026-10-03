import type { Metadata } from 'next';

import { CoursesView } from '@/components/course/courses-view';
import { staticCatalog } from '@/lib/catalog-static';

export const metadata: Metadata = {
  title: 'Course Library',
  description: 'Browse every course, module and lesson in the library. All courses are included in one lifetime purchase.',
};

export default function CoursesPage() {
  return <CoursesView initial={staticCatalog()} />;
}
