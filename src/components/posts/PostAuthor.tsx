import Image from 'next/image'

import { getAvatarPath, getPostAuthor } from '@/lib/posts'
import type { Post } from '@/payload-types'

type PostAuthorProps = {
  compact?: boolean
  post: Post
  showRole?: boolean
}

export function PostAuthor({ compact = false, post, showRole = false }: PostAuthorProps) {
  const author = getPostAuthor(post)
  const avatarPath = getAvatarPath(author.avatar)
  const initials = author.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-w-0 items-center gap-2.5 font-ui">
      <span
        className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft font-black text-accent ring-1 ring-accent/15 ${compact ? 'size-8 text-[10px]' : 'size-11 text-sm'}`}
      >
        {avatarPath ? (
          <Image
            alt={`${author.name}'s profile picture`}
            className="object-cover"
            fill
            sizes={compact ? '32px' : '44px'}
            src={avatarPath}
          />
        ) : (
          <span aria-hidden="true">{initials || 'DB'}</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-foreground">{author.name}</span>
        {showRole && (
          <span className="block truncate text-xs text-muted-foreground">{author.jobTitle}</span>
        )}
      </span>
    </div>
  )
}
