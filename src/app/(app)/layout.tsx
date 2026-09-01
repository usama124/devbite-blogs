import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import './styles.css'

export const metadata: Metadata = {
  title: {
    default: 'DevBite Blogs',
    template: '%s | DevBite Blogs',
  },
  description: 'Daily articles about science, technology, and everything in between.',
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            DevBite <span>Blogs</span>
          </Link>
          <p>Small reads. Big ideas.</p>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">© {new Date().getFullYear()} DevBite</footer>
      </body>
    </html>
  )
}
