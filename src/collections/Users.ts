import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  defaultPopulate: {
    name: true,
    avatar: true,
    jobTitle: true,
    bio: true,
    location: true,
    website: true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'jobTitle', 'updatedAt'],
    group: 'People',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'DevBite Author',
      maxLength: 120,
      saveToJWT: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A square image works best across article cards and author profiles.',
      },
    },
    {
      name: 'jobTitle',
      label: 'Job title',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 600,
    },
    {
      name: 'location',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'website',
      type: 'text',
      maxLength: 240,
      admin: {
        placeholder: 'https://example.com',
      },
    },
  ],
}
