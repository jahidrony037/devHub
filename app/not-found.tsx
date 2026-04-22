import Link from "next/link";

/**
 * app/not-found.tsx — 404 Page
 *
 * Rendered by Next.js when `notFound()` is called inside a Server Component,
 * or when no route matches the URL.  This is a static page (SSG by default).
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-fade-in">
      <p className="mono text-7xl font-bold text-white/5">404</p>
      <div className="space-y-2 -mt-8">
        <h1 className="mono text-2xl font-bold text-cyan-400">Not Found</h1>
        <p className="text-sm text-slate-500">
          This route doesn&apos;t exist or the resource was removed.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
        >
          ← Home
        </Link>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-[var(--border)] px-5 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-colors"
        >
          Browse Posts
        </Link>
      </div>
    </div>
  );
}
