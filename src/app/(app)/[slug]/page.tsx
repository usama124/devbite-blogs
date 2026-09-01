import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { submitComment } from '../actions'

export const dynamic = 'force-dynamic'

type PostPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ comment?: string }>
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

async function findPost(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    overrideAccess: false,
  })

  return docs[0] ?? null
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await findPost(slug)

  return post ? { title: post.title, description: post.summary } : { title: 'Post not found' }
}

export default async function PostPage({ params, searchParams }: PostPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const post = await findPost(slug)

  if (!post) notFound()

  const payload = await getPayload({ config })
  const { docs: comments } = await payload.find({
    collection: 'comments',
    where: {
      and: [{ post: { equals: post.id } }, { isApproved: { equals: true } }],
    },
    depth: 0,
    limit: 100,
    overrideAccess: false,
    sort: 'createdAt',
  })

  async function handleSubmit(formData: FormData) {
    'use server'
    const result = await submitComment(formData)
    redirect(`/${slug}?comment=${result.success ? 'submitted' : 'failed'}#comments`)
  }

  return (
    <div className="page-shell article-shell">
      <Link className="back-link" href="/">
        ← All posts
      </Link>

      <article>
        <header className="article-header">
          <div className="post-meta">
            <span className={`category category-${post.category}`}>{post.category}</span>
            <time dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
          </div>
          <h1>{post.title}</h1>
          <p>{post.summary}</p>
        </header>
        <div className="rich-text">
          <RichText data={post.content} />
        </div>
      </article>

      <section className="comments" id="comments" aria-labelledby="comments-title">
        <div className="section-heading">
          <h2 id="comments-title">Comments</h2>
          <span>{comments.length}</span>
        </div>

        {comments.length === 0 ? (
          <p className="muted">No comments yet. Start the conversation.</p>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <article className="comment" key={comment.id}>
                <div>
                  <strong>{comment.authorName}</strong>
                  <time dateTime={comment.createdAt}>
                    {dateFormatter.format(new Date(comment.createdAt))}
                  </time>
                </div>
                <p>{comment.content}</p>
              </article>
            ))}
          </div>
        )}

        <div className="comment-form-wrap">
          <h3>Leave a comment</h3>
          <p className="muted">Your email won’t be published. Comments appear after approval.</p>
          {query.comment === 'submitted' && (
            <p className="form-success" role="status">
              Comment submitted for approval!
            </p>
          )}
          {query.comment === 'failed' && (
            <p className="form-error" role="alert">
              We couldn’t submit your comment. Please try again.
            </p>
          )}
          <form className="comment-form" action={handleSubmit}>
            <input name="postId" type="hidden" value={post.id} />
            <div className="form-row">
              <label>
                Name
                <input autoComplete="name" maxLength={120} name="authorName" required type="text" />
              </label>
              <label>
                Email
                <input
                  autoComplete="email"
                  maxLength={320}
                  name="authorEmail"
                  required
                  type="email"
                />
              </label>
            </div>
            <label>
              Comment
              <textarea maxLength={5000} name="content" required rows={6} />
            </label>
            <button type="submit">Submit comment</button>
          </form>
        </div>
      </section>
    </div>
  )
}
