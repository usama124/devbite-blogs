'use client'

import { Check, Copy, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const openShareWindow = (target: string) => {
    window.open(target, '_blank', 'noopener,noreferrer,width=720,height=620')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      window.prompt('Copy this article link:', url)
    }
  }

  return (
    <aside
      className="flex items-center gap-2 lg:sticky lg:top-24 lg:flex-col"
      aria-label="Share this article"
    >
      <span className="mr-1 font-ui text-xs font-bold tracking-widest text-muted-foreground uppercase lg:mr-0 lg:mb-1">
        Share
      </span>
      <button
        className="icon-button border border-border bg-card shadow-sm"
        onClick={() =>
          openShareWindow(
            `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          )
        }
        type="button"
        aria-label="Share on X"
      >
        <span aria-hidden="true" className="font-ui text-sm font-black">
          𝕏
        </span>
      </button>
      <button
        className="icon-button border border-border bg-card shadow-sm"
        onClick={() =>
          openShareWindow(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          )
        }
        type="button"
        aria-label="Share on LinkedIn"
      >
        <span aria-hidden="true" className="font-ui text-xs font-black">
          in
        </span>
      </button>
      <button
        className="icon-button border border-border bg-card shadow-sm"
        onClick={copyLink}
        type="button"
        aria-label={copied ? 'Link copied' : 'Copy article link'}
      >
        {copied ? <Check aria-hidden="true" size={17} /> : <Copy aria-hidden="true" size={17} />}
      </button>
      <button
        className="icon-button border border-border bg-card shadow-sm lg:hidden"
        onClick={async () => {
          try {
            if (navigator.share) await navigator.share({ title, url })
            else await copyLink()
          } catch {
            // The native share sheet rejects when the visitor dismisses it.
          }
        }}
        type="button"
        aria-label="Open share menu"
      >
        <Share2 aria-hidden="true" size={17} />
      </button>
    </aside>
  )
}
