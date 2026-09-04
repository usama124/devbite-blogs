import { getPayload } from 'payload'

import config from '@payload-config'
import { siteURL } from '@/lib/posts'

export const dynamic = 'force-dynamic'

const escapeXML = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    }
    return entities[character]
  })

export async function GET() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { publishedAt: { less_than_equal: new Date().toISOString() } },
    depth: 0,
    limit: 100,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  const items = posts
    .map(
      (post) => `
        <item>
          <title>${escapeXML(post.title)}</title>
          <link>${siteURL}/${encodeURIComponent(post.slug)}</link>
          <guid isPermaLink="true">${siteURL}/${encodeURIComponent(post.slug)}</guid>
          <description>${escapeXML(post.summary)}</description>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          <category>${escapeXML(post.category)}</category>
        </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>DevBite Blogs</title>
        <link>${siteURL}</link>
        <description>Thoughtful stories about science, technology, and the ideas shaping what comes next.</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`

  return new Response(xml, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
