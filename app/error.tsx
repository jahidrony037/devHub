"use client";

/**
 * app/error.tsx — Error Boundary
 *
 * Next.js wraps every page in a React Error Boundary automatically.
 * When a Server Component throws (e.g., API is down), this UI is shown.
 * Must be a Client Component so it can use the `reset` function.
 */

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DevHub Error]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-fade-in">
      <div className="h-16 w-16 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-2xl">
        ⚠
      </div>
      <div className="space-y-2">
        <h2 className="mono text-lg font-semibold text-red-400">Something went wrong</h2>
        <p className="text-sm text-slate-500 max-w-sm">{error.message}</p>
        {error.digest && (
          <p className="mono text-[10px] text-slate-700">digest: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-[var(--border)] px-5 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-colors"
      >
        ↺ Try again
      </button>
    </div>
  );
}
