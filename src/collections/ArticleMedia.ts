import type { CollectionConfig } from 'payload'

export const ArticleMedia: CollectionConfig = {
  slug: 'article-media',
  lockDocuments: false,
  admin: {
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    group: 'Article',
    useAsTitle: 'alt',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data

        data.prefix = 'article'
        if (typeof data.alt === 'string' && data.alt.trim()) return data

        const uploadedName = req.file?.name
        if (uploadedName) {
          data.alt = uploadedName
            .replace(/\.[^.]+$/, '')
            .replace(/[-_]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'prefix',
      type: 'text',
      defaultValue: 'article',
      admin: { hidden: true, readOnly: true },
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 320,
        position: 'centre',
      },
      {
        name: 'card',
        width: 1200,
        height: 675,
        position: 'centre',
      },
    ],
  },
}
