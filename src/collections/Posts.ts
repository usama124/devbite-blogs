import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Article',
    plural: 'Articles',
  },
  // Turso cannot apply Payload's development-mode table rebuild when a new
  // collection is added to the polymorphic document-lock relationship.
  lockDocuments: false,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'viewCount', 'publishedAt'],
    group: 'Article',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc, req }) => {
        const user = req.user as {
          collection?: string
          email?: string
          id: number | string
          name?: string
        } | null

        if (!user || user.collection !== 'users') return data

        if (operation === 'create') {
          data.author = user.id
          data.authorName = user.name?.trim() || user.email || 'DevBite Author'
        }

        if (operation === 'update') {
          data.author =
            originalDoc?.author && typeof originalDoc.author === 'object'
              ? originalDoc.author.id
              : (originalDoc?.author ?? user.id)
          data.authorName =
            originalDoc?.authorName || user.name?.trim() || user.email || 'DevBite Author'
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Science', value: 'science' },
        { label: 'Tech', value: 'tech' },
        { label: 'Others', value: 'others' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this post prominently on the public homepage.',
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        hidden: true,
        readOnly: true,
      },
    },
    {
      name: 'articleImage',
      label: 'Featured image',
      type: 'upload',
      relationTo: 'article-media',
      admin: {
        description: 'Recommended aspect ratio: 16:9. New uploads are stored under article/ in R2.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Automatically assigned to the user who creates the article.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      defaultValue: 'DevBite Editorial',
      maxLength: 120,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'viewCount',
      label: 'Article views',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      access: {
        update: () => false,
      },
      admin: {
        description: 'Updated atomically when a reader opens this article.',
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
