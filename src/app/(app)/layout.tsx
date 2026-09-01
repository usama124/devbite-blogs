import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import './styles.css'

const categoryLinks = [
  { href: '/?category=science#latest-posts', label: 'Science' },
  { href: '/?category=tech#latest-posts', label: 'Tech' },
  { href: '/?category=others#latest-posts', label: 'Others' },
]

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
          <div className="site-header-inner">
            <Link className="brand" href="/" aria-label="DevBite Blogs home">
              DevBite <span>Blogs</span>
            </Link>

            <nav className="category-nav" aria-label="Post categories">
              {categoryLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <Link className="footer-brand" href="/">
                DevBite Blogs
              </Link>
              <p>Small reads. Big ideas.</p>
            </div>

            <nav className="footer-nav" aria-label="Footer categories">
              {categoryLinks.map((link) => (
                <Link href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="copyright">© {new Date().getFullYear()} DevBite</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
