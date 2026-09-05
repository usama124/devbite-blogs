import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, Clock3, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@payload-config'
import { CommentForm } from '@/components/comments/CommentForm'
import { ArticleViewCounter } from '@/components/posts/ArticleViewCounter'
import { PostAuthor } from '@/components/posts/PostAuthor'
import { PostImagePlaceholder } from '@/components/posts/PostImagePlaceholder'
import { ShareBar } from '@/components/posts/ShareBar'
import {
  categoryStyles,
  formatCategory,
  getMediaAlt,
  getMediaPath,
  getMediaURL,
  getPostAuthor,
  getPostImage,
  getReadTime,
  siteURL,
} from '@/lib/posts'

export const dynamic = 'force-dynamic'

type PostPageProps = {
  params: Promise<{ slug: string }>
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const findPost = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { slug: { equals: slug } },
        { publishedAt: { less_than_equal: new Date().toISOString() } },
      ],
    },
    depth: 2,
    limit: 1,
    // Trusted server render: the UI exposes only curated public profile fields.
    overrideAccess: true,
  })

  return docs[0] ?? null
})

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await findPost(slug)

  if (!post) return { title: 'Post not found', robots: { index: false, follow: false } }

  const canonicalURL = `${siteURL}/${post.slug}`
  const imageURL = getMediaURL(getPostImage(post)) ?? `${canonicalURL}/opengraph-image`
  const author = getPostAuthor(post)

  return {
    title: post.title,
    description: post.summary,
    authors: [{ name: author.name }],
    alternates: { canonical: canonicalURL },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: canonicalURL,
      siteName: 'DevBite Blogs',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [author.name],
      section: formatCategory(post.category),
      images: [{ url: imageURL, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [imageURL],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
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

  const canonicalURL = `${siteURL}/${post.slug}`
  const postImage = getPostImage(post)
  const imageURL = getMediaURL(postImage) ?? `${canonicalURL}/opengraph-image`
  const imagePath = getMediaPath(postImage)
  const author = getPostAuthor(post)
  const readTime = getReadTime(post.content)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: imageURL,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.website ? { url: author.website } : {}),
      ...(getMediaURL(author.avatar) ? { image: getMediaURL(author.avatar) } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevBite',
      url: 'https://devbite.dev',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalURL,
    },
    articleSection: formatCategory(post.category),
  }

  return (
    <div className="mx-auto max-w-5xl pt-8 pb-6 sm:pt-12">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
        type="application/ld+json"
      />

      <Link
        className="group inline-flex items-center gap-2 rounded-lg font-ui text-sm font-semibold text-muted-foreground transition hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        href="/"
      >
        <ArrowLeft
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-1"
          size={17}
        />
        Back to all stories
      </Link>

      <article className="mt-10">
        <header className="mx-auto max-w-4xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-3 font-ui text-sm text-muted-foreground">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ring-1 ring-inset ${categoryStyles[post.category]}`}
            >
              {formatCategory(post.category)}
            </span>
            <span aria-hidden="true" className="size-1 rounded-full bg-border" />
            <time dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
            <span aria-hidden="true" className="size-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" size={15} /> {readTime} min read
            </span>
            <span aria-hidden="true" className="size-1 rounded-full bg-border" />
            <ArticleViewCounter initialCount={post.viewCount} postId={post.id} />
          </div>

          <h1 className="mt-7 text-4xl leading-[1.06] font-black tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
            {post.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
            {post.summary}
          </p>

          <div className="mt-8 flex justify-center">
            <PostAuthor post={post} showRole />
          </div>
        </header>

        <div className="relative mt-10 aspect-[16/8.5] overflow-hidden rounded-2xl border border-border bg-muted shadow-xl shadow-slate-950/5 sm:mt-14 sm:rounded-3xl dark:shadow-black/20">
          {imagePath ? (
            <Image
              alt={getMediaAlt(postImage)}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              src={imagePath}
            />
          ) : (
            <PostImagePlaceholder category={post.category} title={post.title} />
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[3rem_minmax(0,46rem)] lg:justify-center lg:gap-10">
          <ShareBar title={post.title} url={canonicalURL} />
          <div className="prose prose-slate max-w-none font-reading prose-headings:font-body prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:decoration-accent/35 prose-a:underline-offset-4 prose-blockquote:border-accent prose-blockquote:bg-accent-soft/60 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:not-italic prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-foreground prose-img:rounded-2xl prose-img:shadow-lg dark:prose-invert sm:prose-lg">
            <RichText data={post.content} />
          </div>
        </div>
      </article>

      <section
        className="mx-auto mt-16 max-w-3xl scroll-mt-24 border-t border-border pt-12 sm:mt-20 sm:pt-16"
        id="comments"
        aria-labelledby="comments-title"
      >
        <div className="mb-8 flex items-end justify-between border-b border-border pb-5">
          <div>
            <p className="font-ui text-xs font-bold tracking-[0.18em] text-accent uppercase">
              Discussion
            </p>
            <h2
              className="mt-1 text-3xl font-black tracking-tight text-foreground"
              id="comments-title"
            >
              Comments
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 font-ui text-xs font-bold text-muted-foreground">
            <MessageCircle aria-hidden="true" size={14} /> {comments.length}
          </span>
        </div>

        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent">
              <MessageCircle aria-hidden="true" size={20} />
            </span>
            <h3 className="mt-4 font-bold text-foreground">Start the conversation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to share a thoughtful response.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {comments.map((comment) => {
              const commentInitial = comment.authorName.trim().charAt(0).toUpperCase()
              return (
                <article
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
                  key={comment.id}
                >
                  <header className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-ui text-sm font-black text-accent">
                      {commentInitial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-ui text-sm font-bold text-foreground">
                        {comment.authorName}
                      </p>
                      <time
                        className="font-ui text-xs text-muted-foreground"
                        dateTime={comment.createdAt}
                        title={new Date(comment.createdAt).toISOString()}
                      >
                        {dateFormatter.format(new Date(comment.createdAt))}
                      </time>
                    </div>
                  </header>
                  <p className="mt-4 leading-7 whitespace-pre-wrap text-muted-foreground">
                    {comment.content}
                  </p>
                </article>
              )
            })}
          </div>
        )}

        <CommentForm postId={post.id} />
      </section>
    </div>
  )
}
