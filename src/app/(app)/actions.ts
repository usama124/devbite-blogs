'use server'

import config from '@payload-config'
import { createClient, type Client } from '@libsql/client'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

export type CommentActionState = {
  success: boolean
  message?: string
  error?: string
}

export type ArticleViewActionResult =
  { success: true; count: number } | { success: false; count: number }

let viewsDatabase: Client | null = null

const getViewsDatabase = () => {
  if (viewsDatabase) return viewsDatabase

  const url = process.env.TURSO_DATABASE_URL
  if (!url) throw new Error('TURSO_DATABASE_URL is required to record article views.')

  viewsDatabase = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })

  return viewsDatabase
}

export async function recordArticleView(postId: number): Promise<ArticleViewActionResult> {
  if (!Number.isSafeInteger(postId) || postId < 1) return { success: false, count: 0 }

  try {
    const result = await getViewsDatabase().execute({
      sql: `UPDATE posts
        SET view_count = COALESCE(view_count, 0) + 1
        WHERE id = ? AND published_at <= ?
        RETURNING view_count`,
      args: [postId, new Date().toISOString()],
    })

    const count = result.rows[0]?.view_count
    if (typeof count !== 'number') return { success: false, count: 0 }

    return { success: true, count }
  } catch (error) {
    console.error('Failed to record article view', error)
    return { success: false, count: 0 }
  }
}

const readRequiredString = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

export async function submitComment(formData: FormData): Promise<CommentActionState> {
  const postId = readRequiredString(formData, 'postId')
  const authorName = readRequiredString(formData, 'authorName')
  const authorEmail = readRequiredString(formData, 'authorEmail')
  const content = readRequiredString(formData, 'content')
  const website = readRequiredString(formData, 'website')

  if (!postId || !authorName || !authorEmail || !content) {
    return { success: false, error: 'All fields are required.' }
  }

  if (website) {
    return { success: true, message: 'Comment submitted for approval!' }
  }

  if (authorName.length < 2 || authorName.length > 120) {
    return { success: false, error: 'Please enter a valid name.' }
  }

  if (authorEmail.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  if (content.length < 3 || content.length > 5000) {
    return { success: false, error: 'Comments must be between 3 and 5,000 characters.' }
  }

  try {
    const payload = await getPayload({ config })
    const post = await payload.findByID({
      collection: 'posts',
      id: postId,
      depth: 0,
      overrideAccess: false,
    })

    await payload.create({
      collection: 'comments',
      data: {
        post: post.id,
        authorName,
        authorEmail,
        content,
      },
      overrideAccess: false,
    })

    revalidatePath(`/${post.slug}`)

    return { success: true, message: 'Comment submitted for approval!' }
  } catch (error) {
    console.error('Failed to submit comment', error)
    return { success: false, error: 'Failed to submit comment.' }
  }
}
