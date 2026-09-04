'use client'

import { CheckCircle2, Loader2, MessageSquareText, Send } from 'lucide-react'
import { useActionState, useState } from 'react'

import { submitComment, type CommentActionState } from '@/app/(app)/actions'

const initialState: CommentActionState = { success: false }

async function submit(_previousState: CommentActionState, formData: FormData) {
  return submitComment(formData)
}

export function CommentForm({ postId }: { postId: number }) {
  const [state, formAction, pending] = useActionState(submit, initialState)
  const [commentLength, setCommentLength] = useState(0)

  return (
    <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.45)] sm:p-9">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent">
          <MessageSquareText aria-hidden="true" size={21} />
        </span>
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Join the conversation
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Your email stays private. Comments are reviewed before appearing publicly.
          </p>
        </div>
      </div>

      {state.success && (
        <div
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
          <span>{state.message}</span>
        </div>
      )}

      {!state.success && state.error && (
        <p
          className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-8 grid gap-6">
        <input name="postId" type="hidden" value={postId} />
        <label className="absolute -left-[10000px]" aria-hidden="true">
          Website
          <input autoComplete="off" name="website" tabIndex={-1} type="text" />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="grid gap-2 font-ui text-sm font-semibold text-foreground">
            Name
            <input
              className="h-12 rounded-xl border border-border bg-background px-4 text-base font-normal text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-accent/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
              autoComplete="name"
              maxLength={120}
              minLength={2}
              name="authorName"
              placeholder="Jane Doe"
              required
              type="text"
            />
          </label>
          <label className="grid gap-2 font-ui text-sm font-semibold text-foreground">
            Email
            <input
              className="h-12 rounded-xl border border-border bg-background px-4 text-base font-normal text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-accent/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
              autoComplete="email"
              maxLength={320}
              name="authorEmail"
              placeholder="jane@example.com"
              required
              type="email"
            />
          </label>
        </div>

        <label className="grid gap-2 font-ui text-sm font-semibold text-foreground">
          Comment
          <textarea
            className="min-h-40 resize-y rounded-xl border border-border bg-background px-4 py-3 text-base font-normal text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-accent/50 focus:border-accent focus:ring-4 focus:ring-accent/10"
            maxLength={5000}
            minLength={3}
            name="content"
            onChange={(event) => setCommentLength(event.target.value.length)}
            placeholder="What stood out to you?"
            required
            rows={6}
          />
          <span className="text-right text-xs font-normal text-muted-foreground">
            {commentLength.toLocaleString()} / 5,000
          </span>
        </label>

        <button
          className="primary-button min-h-12 w-full px-6 sm:w-fit"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" size={17} /> Submitting…
            </>
          ) : (
            <>
              <Send aria-hidden="true" size={17} /> Submit comment
            </>
          )}
        </button>
      </form>
    </div>
  )
}
