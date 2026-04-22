/**
 * app/posts/[id]/page.tsx — POST DETAIL
 *
 * ─── Rendering Strategy: ISR + generateStaticParams ───────────────────────────
 *
 * WHY generateStaticParams?
 * We pre-build the first 10 post pages at build time so visitors hitting popular
 * posts get instant HTML. Post IDs 11-100 are NOT pre-built — they are rendered
 * on-demand on first request, then cached and revalidated (ISR).
 *
 * This is the "partial pre-rendering" mindset: pre-build what you know will be
 * hit often; lazily build the long tail.
 *
 * dynamicParams = true (default) means "if a param wasn't pre-built, render it
 * on demand instead of 404-ing."
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostById, getCommentsByPost } from "@/lib/api";
import type { PageProps } from "@/lib/types";

export const revalidate = 60;          // ISR: rebuild this page every 60 s
export const dynamicParams = true;     // Render unknown ids on-demand (don't 404)

// ─── Pre-build first 10 post pages at build time ─────────────────────────────

export async function generateStaticParams() {
  // Only pre-render posts 1-10; the rest are on-demand ISR
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));
}

// ─── Dynamic metadata per post ───────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getPostById(Number(id));
    return {
      title: post.title,
      description: post.body.slice(0, 120),
    };
  } catch {
    return { title: "Post not found" };
  }
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId) || numId < 1 || numId > 100) notFound();

  // Both fetches use ISR cache (revalidate: 60), run in parallel
  const [post, comments] = await Promise.all([
    getPostById(numId),
    getCommentsByPost(numId),
  ]);

  const isPreBuilt = numId <= 10;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">

      {/* Back link */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-400 transition-colors mono"
      >
        ← Posts
      </Link>

      {/* Status badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="tag">ISR</span>
        {isPreBuilt ? (
          <span className="tag tag-green">Pre-built at build time</span>
        ) : (
          <span className="tag tag-amber">Rendered on-demand (then cached)</span>
        )}
        <span className="mono text-xs text-slate-600">revalidate: 60s</span>
      </div>

      {/* Article */}
      <article className="card p-6 sm:p-8 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white capitalize leading-snug">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="mono">post #{post.id}</span>
          <span>·</span>
          <span className="mono">user_{post.userId}</span>
        </div>
        <p className="text-slate-400 leading-relaxed">{post.body}</p>
      </article>

      {/* Comments */}
      <section>
        <h2 className="mono text-sm font-semibold text-slate-400 mb-4">
          // {comments.length} comments
        </h2>
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="card p-4 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-slate-300 capitalize">{c.name}</p>
                <span className="mono text-[10px] text-slate-600 shrink-0">{c.email}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {numId > 1 && (
          <Link
            href={`/posts/${numId - 1}`}
            className="tag hover:text-cyan-300 transition-colors"
          >
            ← Post {numId - 1}
          </Link>
        )}
        {numId < 100 && (
          <Link
            href={`/posts/${numId + 1}`}
            className="tag ml-auto hover:text-cyan-300 transition-colors"
          >
            Post {numId + 1} →
          </Link>
        )}
      </div>

    </div>
  );
}
