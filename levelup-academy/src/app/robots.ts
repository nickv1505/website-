import type { MetadataRoute } from 'next';

import { siteUrl } from '@/config/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/account', '/admin', '/checkout', '/api/', '/auth/', '/login', '/signup', '/forgot-password', '/reset-password'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
