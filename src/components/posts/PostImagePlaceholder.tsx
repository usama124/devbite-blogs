import { Atom, CircuitBoard, Shapes, type LucideIcon } from 'lucide-react'

import type { Post } from '@/payload-types'

type PostImagePlaceholderProps = {
  category: Post['category']
  compact?: boolean
  title: string
}

const categoryVisuals: Record<
  Post['category'],
  { Icon: LucideIcon; label: string; glow: string; icon: string }
> = {
  science: {
    Icon: Atom,
    label: 'Science',
    glow: 'bg-sky-400/25',
    icon: 'bg-sky-500/15 text-sky-700 ring-sky-500/20 dark:text-sky-300',
  },
  tech: {
    Icon: CircuitBoard,
    label: 'Technology',
    glow: 'bg-emerald-400/25',
    icon: 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  },
  others: {
    Icon: Shapes,
    label: 'Others',
    glow: 'bg-violet-400/25',
    icon: 'bg-violet-500/15 text-violet-700 ring-violet-500/20 dark:text-violet-300',
  },
}

export function PostImagePlaceholder({
  category,
  compact = false,
  title,
}: PostImagePlaceholderProps) {
  const { Icon, label, glow, icon } = categoryVisuals[category]

  return (
    <div
      className="relative isolate flex h-full w-full overflow-hidden bg-gradient-to-br from-accent-soft via-card to-muted"
      role="img"
      aria-label={`Placeholder artwork for ${title}`}
    >
      <span
        className={`absolute -top-1/3 -right-1/4 aspect-square w-3/4 rounded-full blur-3xl ${glow}`}
        aria-hidden="true"
      />
      <span
        className="absolute -bottom-1/2 -left-1/4 aspect-square w-3/4 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: compact ? '24px 24px' : '36px 36px',
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 flex w-full flex-col justify-between ${compact ? 'p-4' : 'p-7 sm:p-10'}`}
      >
        <div className="flex items-center justify-between gap-3 font-ui">
          <span
            className={`grid rounded-2xl ring-1 ring-inset ${compact ? 'size-10' : 'size-14'} ${icon}`}
          >
            <Icon
              className="m-auto"
              aria-hidden="true"
              size={compact ? 20 : 27}
              strokeWidth={1.8}
            />
          </span>
          <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase backdrop-blur-sm">
            {label}
          </span>
        </div>

        {!compact && (
          <div className="max-w-2xl">
            <p className="font-ui text-xs font-black tracking-[0.18em] text-accent uppercase">
              DevBite Blogs
            </p>
            <p className="mt-3 line-clamp-2 text-2xl leading-tight font-black tracking-[-0.035em] text-foreground sm:text-4xl">
              {title}
            </p>
          </div>
        )}

        {compact && (
          <span className="font-ui text-xs font-black tracking-[0.14em] text-accent uppercase">
            DevBite
          </span>
        )}
      </div>
    </div>
  )
}
