import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export default async function PostsPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    sort: '-publishedAt',
  })

  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">Science · Tech · Curiosity</p>
        <h1>Ideas worth a bite.</h1>
        <p>Fresh perspectives and practical insights, published by DevBite.</p>
      </section>

      <section aria-labelledby="latest-posts">
        <div className="section-heading">
          <h2 id="latest-posts">Latest posts</h2>
          <span>
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Check back soon for the first DevBite article.</p>
          </div>
        ) : (
          <div className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-meta">
                  <span className={`category category-${post.category}`}>{post.category}</span>
                  <time dateTime={post.publishedAt}>
                    {dateFormatter.format(new Date(post.publishedAt))}
                  </time>
                </div>
                <h3>
                  <Link href={`/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.summary}</p>
                <Link className="read-more" href={`/${post.slug}`}>
                  Read article <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
