'use client'

import { Eye } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { recordArticleView } from '@/app/(app)/actions'

type ArticleViewCounterProps = {
  initialCount: number
  postId: number
}

export function ArticleViewCounter({ initialCount, postId }: ArticleViewCounterProps) {
  const [count, setCount] = useState(initialCount)
  const hasRecordedView = useRef(false)

  useEffect(() => {
    if (hasRecordedView.current) return
    hasRecordedView.current = true

    let isActive = true

    void recordArticleView(postId).then((result) => {
      if (isActive && result.success) setCount(result.count)
    })

    return () => {
      isActive = false
    }
  }, [postId])

  return (
    <span
      aria-label={`${count.toLocaleString()} article ${count === 1 ? 'view' : 'views'}`}
      className="inline-flex items-center gap-1.5"
      title="Article views"
    >
      <Eye aria-hidden="true" size={15} />
      <span aria-live="polite">{count.toLocaleString()}</span>
      <span aria-hidden="true">{count === 1 ? 'view' : 'views'}</span>
    </span>
  )
}
