import { ImageResponse } from 'next/og'
import { getPayload } from 'payload'

import config from '@payload-config'
import { formatCategory } from '@/lib/posts'

export const runtime = 'nodejs'
export const alt = 'DevBite Blogs article cover'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
    depth: 0,
    limit: 1,
    overrideAccess: false,
  })
  const post = docs[0]

  const title = post?.title ?? 'Ideas worth a bite.'
  const category = post ? formatCategory(post.category) : 'Science · Tech · Curiosity'

  return new ImageResponse(
    <div
      style={{
        alignItems: 'stretch',
        background: 'linear-gradient(135deg, #0b1020 0%, #20104b 55%, #4c1d95 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '70px 76px',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          background: 'rgba(167, 139, 250, 0.24)',
          borderRadius: 999,
          height: 420,
          position: 'absolute',
          right: -80,
          top: -120,
          width: 420,
        }}
      />
      <div style={{ alignItems: 'center', display: 'flex', fontSize: 30, fontWeight: 800 }}>
        <span
          style={{
            alignItems: 'center',
            background: '#8b5cf6',
            borderRadius: 14,
            display: 'flex',
            height: 52,
            justifyContent: 'center',
            marginRight: 16,
            width: 52,
          }}
        >
          D
        </span>
        DevBite Blogs
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
        <div
          style={{
            color: '#c4b5fd',
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: '0.12em',
            marginBottom: 22,
            textTransform: 'uppercase',
          }}
        >
          {category}
        </div>
        <div style={{ fontSize: title.length > 70 ? 55 : 67, fontWeight: 900, lineHeight: 1.08 }}>
          {title}
        </div>
      </div>

      <div
        style={{ color: '#d8d9e2', display: 'flex', fontSize: 22, justifyContent: 'space-between' }}
      >
        <span>Small reads. Big ideas.</span>
        <span>blogs.devbite.dev</span>
      </div>
    </div>,
    size,
  )
}
