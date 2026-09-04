import type { Media, Post } from '@/payload-types'

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

export const getMediaURL = (image: Post['featuredImage']) => {
  if (!image || typeof image === 'number') return null

  const media = image as Media
  if (!media.url) return null

  return new URL(media.url, siteURL).toString()
}

export const getMediaPath = (image: Post['featuredImage']) => {
  if (!image || typeof image === 'number') return null
  return (image as Media).url ?? null
}

export const formatCategory = (category: Post['category']) =>
  category === 'tech' ? 'Technology' : category.charAt(0).toUpperCase() + category.slice(1)

export const categoryStyles: Record<Post['category'], string> = {
  science: 'bg-sky-500/10 text-sky-700 ring-sky-500/20 dark:text-sky-300',
  tech: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  others: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
}
