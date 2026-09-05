import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const remotePatterns: NonNullable<NonNullable<NextConfig['images']>['remotePatterns']> = [
  {
    protocol: 'https',
    hostname: 'media.devbite.dev',
    pathname: '/**',
  },
]

if (process.env.R2_PUBLIC_URL) {
  try {
    const publicMediaURL = new URL(process.env.R2_PUBLIC_URL)
    const protocol = publicMediaURL.protocol.replace(':', '')

    if (protocol === 'http' || protocol === 'https') {
      remotePatterns.push({
        protocol,
        hostname: publicMediaURL.hostname,
        port: publicMediaURL.port,
        pathname: `${publicMediaURL.pathname.replace(/\/$/, '') || ''}/**`,
      })
    }
  } catch {
    // Payload reports an invalid public URL when it generates a media URL.
  }
}

const nextConfig: NextConfig = {
  agentRules: false,
  experimental: {
    // The CLI-based checker can fail to parse `tsc --showConfig` output in some
    // build environments. Next's TypeScript API checker provides the same gate.
    serverActions: {
      bodySizeLimit: '10mb',
    },
    useTypeScriptCli: false,
  },
  images: {
    remotePatterns,
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
