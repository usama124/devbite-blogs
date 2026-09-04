import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@payload-config'
import { siteURL } from '@/lib/posts'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { publishedAt: { less_than_equal: new Date().toISOString() } },
    depth: 0,
    limit: 1000,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return [
    {
      url: siteURL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${siteURL}/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
