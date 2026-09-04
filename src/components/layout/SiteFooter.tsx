import { Code2, ExternalLink, Rss } from 'lucide-react'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-card/55" aria-labelledby="footer-heading">
      <h2 className="sr-only" id="footer-heading">
        DevBite Blogs footer
      </h2>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-md">
          <Link className="font-ui text-lg font-black tracking-tight text-foreground" href="/">
            DevBite <span className="text-accent">Blogs</span>
          </Link>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Thoughtful stories about science, technology, and the ideas shaping what comes next.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 font-ui text-sm sm:grid-cols-3">
          <div>
            <p className="mb-3 font-bold text-foreground">Explore</p>
            <nav className="grid gap-2 text-muted-foreground" aria-label="Footer navigation">
              <Link className="footer-link" href="/?category=science#latest-posts">
                Science
              </Link>
              <Link className="footer-link" href="/?category=tech#latest-posts">
                Tech
              </Link>
              <Link className="footer-link" href="/?category=others#latest-posts">
                Others
              </Link>
            </nav>
          </div>
          <div>
            <p className="mb-3 font-bold text-foreground">Follow</p>
            <div className="grid gap-2 text-muted-foreground">
              <a className="footer-link inline-flex items-center gap-2" href="/rss.xml">
                <Rss aria-hidden="true" size={15} /> RSS Feed
              </a>
              <a
                className="footer-link inline-flex items-center gap-2"
                href="https://x.com/intent/post?text=DevBite%20Blogs&url=https%3A%2F%2Fblogs.devbite.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="font-bold">
                  𝕏
                </span>{' '}
                Share on X
              </a>
              <a
                className="footer-link inline-flex items-center gap-2"
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fblogs.devbite.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span aria-hidden="true" className="font-bold">
                  in
                </span>{' '}
                Share on LinkedIn
              </a>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="mb-3 font-bold text-foreground">Built by</p>
            <a
              className="footer-link inline-flex items-center gap-2 text-muted-foreground"
              href="https://devbite.dev"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Code2 aria-hidden="true" size={15} /> DevBite
              <ExternalLink aria-hidden="true" size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 font-ui text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} DevBite. All rights reserved.</p>
          <p>Made for curious minds.</p>
        </div>
      </div>
    </footer>
  )
}
