/**
 * app/loading.tsx — Global Loading UI (Suspense boundary)
 *
 * Next.js automatically wraps every page in a <Suspense> boundary and shows
 * this component while the page's async data is being fetched on the server.
 * This enables instant navigation — the shell renders immediately and the
 * content streams in, replacing this skeleton.
 */
export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-20 rounded bg-white/10" />
        <div className="h-7 w-48 rounded bg-white/10" />
        <div className="h-3 w-72 rounded bg-white/5" />
      </div>

      {/* Card grid skeleton — always 10 to match PAGE_SIZE */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="h-4 w-14 rounded bg-white/10" />
            <div className="h-4 w-5/6 rounded bg-white/10" />
            <div className="space-y-2">
              <div className="h-3 rounded bg-white/5" />
              <div className="h-3 w-4/5 rounded bg-white/5" />
            </div>
            <div className="h-3 w-1/3 rounded bg-white/5 mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
