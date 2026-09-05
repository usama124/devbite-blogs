import type { Post, User } from '@/payload-types'

export const siteURL = 'https://blogs.devbite.dev'

const collectText = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''

  if (Array.isArray(value)) {
    return value.map(collectText).join(' ')
  }

  const node = value as Record<string, unknown>
  const ownText = typeof node.text === 'string' ? node.text : ''
  const childText = collectText(node.children)

  return `${ownText} ${childText}`.trim()
}

export const getReadTime = (content: Post['content']) => {
  const words = collectText(content).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

type MediaValue =
  | {
      alt?: null | string
      sizes?: null | {
        thumbnail?: null | { url?: null | string }
      }
      url?: null | string
    }
  | number
  | string
  | null
  | undefined

export const getMediaURL = (image: MediaValue) => {
  if (!image || typeof image !== 'object' || !image.url) return null

  return new URL(image.url, siteURL).toString()
}

export const getMediaPath = (image: MediaValue) => {
  if (!image || typeof image !== 'object') return null
  return image.url ?? null
}

export const getMediaAlt = (image: MediaValue) =>
  image && typeof image === 'object' ? (image.alt ?? '') : ''

export const getPostImage = (post: Post) => post.articleImage ?? post.featuredImage

export const getAvatarPath = (image: User['avatar'] | User['profileAvatar']) => {
  if (!image || typeof image !== 'object') return null
  return image.sizes?.thumbnail?.url ?? image.url ?? null
}

export const getPostAuthor = (post: Post) => {
  const user = post.author && typeof post.author === 'object' ? post.author : null

  return {
    avatar: user?.profileAvatar ?? user?.avatar,
    bio: user?.bio?.trim() || null,
    jobTitle: user?.jobTitle?.trim() || 'DevBite contributor',
    name: user?.name?.trim() || post.authorName || 'DevBite Author',
    website: user?.website?.trim() || null,
  }
}

export const formatCategory = (category: Post['category']) =>
  category === 'tech' ? 'Technology' : category.charAt(0).toUpperCase() + category.slice(1)

export const categoryStyles: Record<Post['category'], string> = {
  science: 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300',
  tech: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  others: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
}
