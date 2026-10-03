export type LessonStatus = 'draft' | 'published';

export type LessonMeta = {
  id: string;
  module_id: string;
  course_id: string;
  slug: string;
  title: string;
  summary: string;
  duration_minutes: number;
  position: number;
  is_preview: boolean;
  status: LessonStatus;
};

export type ModuleWithLessons = {
  id: string;
  course_id: string;
  title: string;
  summary: string;
  position: number;
  is_published: boolean;
  lessons: LessonMeta[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon: string;
  thumbnail_url: string | null;
  position: number;
  is_published: boolean;
};

export type CourseWithModules = Course & { modules: ModuleWithLessons[] };

export type LessonResource = {
  id: string;
  title: string;
  kind: 'pdf' | 'template' | 'worksheet' | 'link' | 'file';
  storage_path: string | null;
  external_url: string | null;
  position: number;
  url?: string | null;
};
