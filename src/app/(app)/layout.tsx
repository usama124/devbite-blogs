import type { Metadata } from 'next'
import { Suspense } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader, SiteHeaderFallback } from '@/components/layout/SiteHeader'
import { AppProviders } from '@/components/theme/AppProviders'
import { ThemeBootScript } from '@/components/theme/ThemeBootScript'
import { siteURL } from '@/lib/posts'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: {
    default: 'DevBite Blogs — Science, Technology & Ideas',
    template: '%s | DevBite Blogs',
  },
  description:
    'Thoughtful stories and practical insights about science, technology, and the ideas shaping what comes next.',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DevBite Blogs',
    title: 'DevBite Blogs — Science, Technology & Ideas',
    description:
      'Thoughtful stories and practical insights about science, technology, and the ideas shaping what comes next.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevBite Blogs — Science, Technology & Ideas',
    description: 'Small reads. Big ideas. Explore science, technology, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeBootScript />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProviders>
          <Suspense fallback={<SiteHeaderFallback />}>
            <SiteHeader />
          </Suspense>
          <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  )
}
