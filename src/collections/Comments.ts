import type { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  // Comments are moderated rather than collaboratively edited, so document
  // locking is unnecessary and excluding it avoids Turso's schema-push issue.
  lockDocuments: false,
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'post', 'isApproved', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => (user ? true : { isApproved: { equals: true } }),
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      index: true,
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'authorEmail',
      type: 'email',
      required: true,
      access: {
        read: ({ req: { user } }) => Boolean(user),
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 5000,
    },
    {
      name: 'isApproved',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
      },
    },
  ],
}
