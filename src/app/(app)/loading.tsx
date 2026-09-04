export default function Loading() {
  return (
    <div className="animate-pulse pb-8" aria-label="Loading posts" aria-busy="true">
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="mx-auto h-6 w-48 rounded-full bg-muted" />
        <div className="mx-auto mt-6 h-14 w-4/5 rounded-2xl bg-muted sm:h-20" />
        <div className="mx-auto mt-4 h-6 w-3/5 rounded-lg bg-muted" />
      </div>
      <div className="grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
        <div className="min-h-72 bg-muted" />
        <div className="space-y-5 p-8 lg:p-12">
          <div className="h-5 w-36 rounded bg-muted" />
          <div className="h-10 w-full rounded-lg bg-muted" />
          <div className="h-10 w-4/5 rounded-lg bg-muted" />
          <div className="h-20 w-full rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div className="overflow-hidden rounded-2xl border border-border bg-card" key={item}>
            <div className="aspect-video bg-muted" />
            <div className="space-y-4 p-6">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-7 w-full rounded bg-muted" />
              <div className="h-16 w-full rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
