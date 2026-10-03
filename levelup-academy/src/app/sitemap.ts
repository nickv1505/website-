import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';
import { staticCatalog } from '@/lib/catalog-static';
import { allLessons } from '@/lib/catalog-utils';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const pages = ['', '/courses', '/terms', '/privacy', '/refunds', '/disclaimer', '/contact'].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.6,
  }));
  const courses = staticCatalog().flatMap((c) => [
    { url: `${base}/courses/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 },
    ...allLessons(c)
      .filter((l) => l.is_preview)
      .map((l) => ({ url: `${base}/courses/${c.slug}/${l.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]);
  return [...pages, ...courses];
}
