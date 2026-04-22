import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/**
 * Pagination — Server Component
 * Uses URL search params so it works with SSR/ISR pages without any JS.
 */
export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  // Show a window of pages: always first, last, current ±1, and ellipsis
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Prev */}
      {prev ? (
        <Link
          href={`${basePath}?page=${prev}`}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 border border-[var(--border)] hover:bg-white/5 hover:text-slate-200 transition-colors mono"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 border border-white/5 mono cursor-not-allowed">
          ← Prev
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-600 mono text-sm">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={`${basePath}?page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm mono font-medium transition-colors ${
                p === currentPage
                  ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                  : "text-slate-400 border border-[var(--border)] hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {p}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {next ? (
        <Link
          href={`${basePath}?page=${next}`}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 border border-[var(--border)] hover:bg-white/5 hover:text-slate-200 transition-colors mono"
        >
          Next →
        </Link>
      ) : (
        <span className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 border border-white/5 mono cursor-not-allowed">
          Next →
        </span>
      )}
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [];

  pages.push(1);
  if (current > 3) pages.push("...");

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}
