import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Users } from './collections/Users' // Import Users
import { Media } from './collections/Media' // Import Media
import { Posts } from './collections/Posts'
import { Comments } from './collections/Comments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Comments],
  bodyParser: {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  },
  editor: lexicalEditor(),
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
