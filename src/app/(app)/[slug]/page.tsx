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

const categoryStyles = {
  science: 'bg-blue-50 text-blue-700 ring-blue-200',
  tech: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  others: 'bg-violet-50 text-violet-700 ring-violet-200',
}

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
    <div className="mx-auto max-w-4xl px-0 pt-10 sm:pt-16">
      <Link
        className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        href="/"
      >
        <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
          ←
        </span>
        All posts
      </Link>

      <article>
        <header className="border-b border-slate-200 pb-10 sm:pb-14">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ring-1 ring-inset ${categoryStyles[post.category]}`}
            >
              {post.category}
            </span>
            <span aria-hidden="true" className="size-1 rounded-full bg-slate-300" />
            <time className="text-sm font-medium text-slate-500" dateTime={post.publishedAt}>
              {dateFormatter.format(new Date(post.publishedAt))}
            </time>
          </div>
          <h1 className="max-w-3xl text-4xl leading-[1.08] font-black tracking-[-0.045em] text-slate-950 sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            {post.summary}
          </p>
        </header>
        <div className="py-10 text-[1.0625rem] leading-8 text-slate-700 sm:py-14 sm:text-lg [&_a]:font-medium [&_a]:text-emerald-700 [&_a]:underline [&_a]:decoration-emerald-300 [&_a]:underline-offset-4 hover:[&_a]:decoration-emerald-600 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-50/70 [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:text-slate-700 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-2xl [&_h3]:leading-tight [&_h3]:font-bold [&_h3]:text-slate-900 [&_img]:my-10 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_img]:shadow-lg [&_li]:my-2 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-7 [&_p]:my-6 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-slate-950 [&_pre]:p-6 [&_pre]:text-slate-100 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-7">
          <RichText data={post.content} />
        </div>
      </article>

      <section
        className="scroll-mt-8 border-t border-slate-200 pt-12 sm:pt-16"
        id="comments"
        aria-labelledby="comments-title"
      >
        <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="mb-1 text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase">
              Discussion
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950" id="comments-title">
              Comments
            </h2>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
            {comments.length}
          </span>
        </div>

        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-10 text-center text-slate-500">
            <p className="font-medium">No comments yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {comments.map((comment) => (
              <article
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                key={comment.id}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <strong className="font-bold text-slate-900">{comment.authorName}</strong>
                  <time className="text-xs font-medium text-slate-400" dateTime={comment.createdAt}>
                    {dateFormatter.format(new Date(comment.createdAt))}
                  </time>
                </div>
                <p className="mt-3 leading-7 whitespace-pre-wrap text-slate-600">
                  {comment.content}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] sm:p-10">
          <h3 className="text-2xl font-bold tracking-tight text-slate-950">Leave a comment</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your email won’t be published. Comments appear after approval.
          </p>
          {query.comment === 'submitted' && (
            <p
              className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
              role="status"
            >
              Comment submitted for approval!
            </p>
          )}
          {query.comment === 'failed' && (
            <p
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              role="alert"
            >
              We couldn’t submit your comment. Please try again.
            </p>
          )}
          <form className="mt-8 grid gap-6" action={handleSubmit}>
            <input name="postId" type="hidden" value={post.id} />
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Name
                <input
                  className="min-h-12 rounded-xl border border-slate-300 bg-slate-50/50 px-4 text-base font-normal text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none"
                  autoComplete="name"
                  maxLength={120}
                  name="authorName"
                  placeholder="Jane Doe"
                  required
                  type="text"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-700">
                Email
                <input
                  className="min-h-12 rounded-xl border border-slate-300 bg-slate-50/50 px-4 text-base font-normal text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none"
                  autoComplete="email"
                  maxLength={320}
                  name="authorEmail"
                  placeholder="jane@example.com"
                  required
                  type="email"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Comment
              <textarea
                className="min-h-36 resize-y rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-base font-normal text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100 focus:outline-none"
                maxLength={5000}
                name="content"
                placeholder="Share your thoughts…"
                required
                rows={6}
              />
            </label>
            <button
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 active:translate-y-px sm:w-fit"
              type="submit"
            >
              Submit comment
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
