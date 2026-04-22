/**
 * PostCardSkeleton — Server Component
 * Matches the exact layout of PostCard so there's no layout shift.
 */
export function PostCardSkeleton() {
  return (
    <div className="card p-5 h-full flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 w-20 rounded-full bg-white/5 animate-pulse" />
        <div className="h-4 w-8 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="space-y-1 flex-1">
        <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-10 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

/**
 * UserCardSkeleton — Server Component
 * Matches the exact layout of UserCard.
 */
export function UserCardSkeleton() {
  return (
    <div className="card border-l-2 border-white/10 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-white/5 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-4 w-32 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-40 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="pt-1 border-t border-white/5 flex items-center justify-between">
        <div className="h-4 w-24 rounded-full bg-white/5 animate-pulse" />
        <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

/** Renders N skeleton cards in a grid — used by loading.tsx / Suspense */
export function PostSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function UserSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}
