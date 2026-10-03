import type { MetadataRoute } from 'next';
import { unstable_rethrow } from 'next/navigation';

import { siteUrl } from '@/config/site';
import { allLessons, getCatalog } from '@/lib/data/catalog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ['', '/courses', '/terms', '/privacy', '/refunds', '/disclaimer', '/contact'].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.6,
  }));
  let courses: MetadataRoute.Sitemap = [];
  try {
    const catalog = await getCatalog();
    courses = catalog.flatMap((c) => [
      { url: `${base}/courses/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 },
      // Only free preview lessons are useful to search engines.
      ...allLessons(c)
        .filter((l) => l.is_preview)
        .map((l) => ({ url: `${base}/courses/${c.slug}/${l.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ]);
  } catch (err) {
    unstable_rethrow(err);
    // Database unavailable: fall back to static pages.
  }
  return [...pages, ...courses];
}
