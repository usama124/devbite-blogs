import { ArrowRight, Clock3, SearchX, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload, type Where } from 'payload'

import config from '@payload-config'
import { PostAuthor } from '@/components/posts/PostAuthor'
import { PostImagePlaceholder } from '@/components/posts/PostImagePlaceholder'
import { categoryStyles, formatCategory, getMediaPath, getReadTime } from '@/lib/posts'

export const dynamic = 'force-dynamic'

const categories = ['science', 'tech', 'others'] as const
type Category = (typeof categories)[number]

type PostsPageProps = {
  searchParams: Promise<{ category?: string; q?: string }>
}

const dateFormatter = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const filterLinks: Array<{ label: string; value?: Category }> = [
  { label: 'All' },
  { label: 'Science', value: 'science' },
  { label: 'Tech', value: 'tech' },
  { label: 'Others', value: 'others' },
]

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const requestedCategory = params.category
  const category = categories.includes(requestedCategory as Category)
    ? (requestedCategory as Category)
    : undefined
  const search = params.q?.trim().slice(0, 120) || undefined

  const filters: Where[] = [{ publishedAt: { less_than_equal: new Date().toISOString() } }]
  if (category) filters.push({ category: { equals: category } })
  if (search) {
    filters.push({
      or: [{ title: { contains: search } }, { summary: { contains: search } }],
    })
  }

  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 100,
    // Trusted server render: populate only the safe author profile values used below.
    overrideAccess: true,
    sort: ['-featured', '-publishedAt'],
    where: { and: filters },
  })

  const featuredPost = posts[0]
  const remainingPosts = featuredPost ? posts.slice(1) : []
  const featuredImagePath = featuredPost ? getMediaPath(featuredPost.featuredImage) : null

  return (
    <div className="pb-8">
      <section
        className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
        aria-labelledby="hero-title"
      >
        <div
          className="pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-[min(90vw,56rem)] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 font-ui text-xs font-bold tracking-wide text-accent uppercase">
            <Sparkles aria-hidden="true" size={14} /> Fresh ideas, thoughtfully explained
          </div>
          <h1
            className="text-4xl leading-[1.05] font-black tracking-[-0.055em] text-foreground sm:text-6xl lg:text-7xl"
            id="hero-title"
          >
            Knowledge for the
            <span className="block bg-gradient-to-r from-accent to-violet-400 bg-clip-text text-transparent">
              endlessly curious.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover clear, useful stories about science, technology, and the ideas moving our world
            forward.
          </p>
        </div>
      </section>

      {featuredPost && (
        <section className="mb-16" aria-labelledby="featured-title">
          <p className="mb-4 font-ui text-xs font-bold tracking-[0.18em] text-accent uppercase">
            {featuredPost.featured ? 'Editor’s pick' : 'Latest story'}
          </p>
          <article className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid-cols-[1.1fr_0.9fr]">
            <Link
              className="relative min-h-64 overflow-hidden bg-muted md:min-h-[25rem]"
              href={`/${featuredPost.slug}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              {featuredImagePath ? (
                <>
                  <Image
                    alt={
                      typeof featuredPost.featuredImage === 'object' &&
                      featuredPost.featuredImage?.alt
                        ? featuredPost.featuredImage.alt
                        : ''
                    }
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 55vw"
                    src={featuredImagePath}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent md:bg-gradient-to-r" />
                </>
              ) : (
                <PostImagePlaceholder category={featuredPost.category} title={featuredPost.title} />
              )}
            </Link>
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <div className="flex flex-wrap items-center gap-3 font-ui text-xs font-semibold text-muted-foreground">
                <span
                  className={`rounded-full px-3 py-1 tracking-wider uppercase ring-1 ring-inset ${categoryStyles[featuredPost.category]}`}
                >
                  {formatCategory(featuredPost.category)}
                </span>
                <time dateTime={featuredPost.publishedAt}>
                  {dateFormatter.format(new Date(featuredPost.publishedAt))}
                </time>
                <span className="inline-flex items-center gap-1">
                  <Clock3 aria-hidden="true" size={14} /> {getReadTime(featuredPost.content)} min
                  read
                </span>
              </div>
              <h2
                className="mt-5 text-3xl leading-tight font-black tracking-[-0.035em] text-foreground sm:text-4xl"
                id="featured-title"
              >
                <Link
                  className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  href={`/${featuredPost.slug}`}
                >
                  {featuredPost.title}
                </Link>
              </h2>
              <p className="mt-4 line-clamp-3 leading-7 text-muted-foreground">
                {featuredPost.summary}
              </p>
              <div className="mt-6">
                <PostAuthor post={featuredPost} showRole />
              </div>
              <Link
                className="mt-7 inline-flex items-center gap-2 self-start font-ui text-sm font-bold text-accent hover:text-accent-hover"
                href={`/${featuredPost.slug}`}
              >
                Read the full story <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
          </article>
        </section>
      )}

      <section className="scroll-mt-24" id="latest-posts" aria-labelledby="latest-title">
        <div className="mb-8 flex flex-col gap-5 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-ui text-xs font-bold tracking-[0.18em] text-accent uppercase">
              The latest
            </p>
            <h2
              className="mt-1 text-3xl font-black tracking-tight text-foreground"
              id="latest-title"
            >
              {search
                ? `Results for “${search}”`
                : category
                  ? `${formatCategory(category)} stories`
                  : 'More from DevBite'}
            </h2>
          </div>
          <nav
            className="flex max-w-full gap-1 overflow-x-auto pb-1 font-ui"
            aria-label="Filter posts by category"
          >
            {filterLinks.map((filter) => {
              const active = category === filter.value
              const query = new URLSearchParams()
              if (filter.value) query.set('category', filter.value)
              if (search) query.set('q', search)
              const href = query.size ? `/?${query.toString()}#latest-posts` : '/#latest-posts'

              return (
                <Link
                  className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-accent text-white shadow-sm shadow-accent/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  href={href}
                  key={filter.label}
                  aria-current={active ? 'page' : undefined}
                >
                  {filter.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {posts.length === 0 ? (
          <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
            <div className="max-w-sm">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
                <SearchX aria-hidden="true" size={26} />
              </span>
              <h3 className="mt-5 text-xl font-bold text-foreground">No stories found</h3>
              <p className="mt-2 leading-6 text-muted-foreground">
                Try another category or clear your search to explore everything we’ve published.
              </p>
              <Link className="primary-button mt-6" href="/#latest-posts">
                View all posts
              </Link>
            </div>
          </div>
        ) : remainingPosts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-8 text-center text-sm text-muted-foreground">
            That’s the only story here for now. More is on the way.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => {
              const imagePath = getMediaPath(post.featuredImage)

              return (
                <article
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  key={post.id}
                >
                  <Link
                    className="relative aspect-[16/9] overflow-hidden bg-muted"
                    href={`/${post.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {imagePath ? (
                      <Image
                        alt={
                          typeof post.featuredImage === 'object' && post.featuredImage?.alt
                            ? post.featuredImage.alt
                            : ''
                        }
                        className="object-cover transition duration-500 group-hover:scale-105"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        src={imagePath}
                      />
                    ) : (
                      <PostImagePlaceholder category={post.category} compact title={post.title} />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 font-ui text-xs text-muted-foreground">
                      <span
                        className={`rounded-full px-2.5 py-1 font-bold tracking-wide uppercase ring-1 ring-inset ${categoryStyles[post.category]}`}
                      >
                        {formatCategory(post.category)}
                      </span>
                      <span>{getReadTime(post.content)} min</span>
                    </div>
                    <h3 className="mt-4 text-xl leading-snug font-bold tracking-tight text-foreground">
                      <Link
                        className="rounded outline-none after:absolute focus-visible:ring-2 focus-visible:ring-accent"
                        href={`/${post.slug}`}
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {post.summary}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-6 font-ui text-xs text-muted-foreground">
                      <PostAuthor compact post={post} />
                      <time dateTime={post.publishedAt}>
                        {dateFormatter.format(new Date(post.publishedAt))}
                      </time>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
