import type { MetadataRoute } from 'next'

import { siteURL } from '@/lib/posts'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${siteURL}/sitemap.xml`,
  }
}
