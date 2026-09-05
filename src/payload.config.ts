import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users' // Import Users
import { Media } from './collections/Media' // Import Media
import { ArticleMedia } from './collections/ArticleMedia'
import { ProfileMedia } from './collections/ProfileMedia'
import { Posts } from './collections/Posts'
import { Comments } from './collections/Comments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const r2Bucket = process.env.R2_BUCKET
const r2AccessKeyID = process.env.R2_ACCESS_KEY_ID
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY
const r2Endpoint = process.env.R2_ENDPOINT
const r2PublicURL = process.env.R2_PUBLIC_URL?.replace(/\/+$/, '')
const r2Configuration = [r2Bucket, r2AccessKeyID, r2SecretAccessKey, r2Endpoint, r2PublicURL]
const configuredR2Values = r2Configuration.filter(Boolean).length
const r2Enabled = configuredR2Values === r2Configuration.length

if (configuredR2Values > 0 && !r2Enabled) {
  throw new Error(
    'Cloudflare R2 is only partially configured. Set R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, and R2_PUBLIC_URL.',
  )
}

const encodeR2Key = (value: string) =>
  value
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')

const generateR2FileURL = ({ filename, prefix }: { filename: string; prefix?: string }) => {
  if (!r2PublicURL) {
    throw new Error('R2_PUBLIC_URL is required to generate public media URLs.')
  }

  const objectKey = encodeR2Key(prefix ? `${prefix}/${filename}` : filename)
  return `${r2PublicURL}/${objectKey}`
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, ArticleMedia, ProfileMedia, Posts, Comments],
  bodyParser: {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  },
  editor: lexicalEditor(),
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      bucket: r2Bucket || 'r2-not-configured',
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: generateR2FileURL,
        },
        'article-media': {
          disablePayloadAccessControl: true,
          prefix: 'article',
          generateFileURL: generateR2FileURL,
        },
        'profile-media': {
          disablePayloadAccessControl: true,
          prefix: 'profile',
          generateFileURL: generateR2FileURL,
        },
      },
      config: {
        region: 'auto',
        endpoint: r2Endpoint,
        forcePathStyle: true,
        credentials: {
          accessKeyId: r2AccessKeyID || '',
          secretAccessKey: r2SecretAccessKey || '',
        },
      },
    }),
  ],
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    // Turso/libSQL can leave development table-rebuild indexes behind when a
    // schema push is interrupted. The deployed schema is managed explicitly;
    // opt in only while applying a deliberate schema change.
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    client: {
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    },
  }),
})
