/**
 * app/posts/page.tsx — POSTS LIST
 *
 * ─── Rendering Strategy: ISR (Incremental Static Regeneration) ────────────────
 *
 * WHY ISR?
 * Blog posts change infrequently but DO change. ISR is the sweet spot:
 * serve a cached static response instantly, regenerate in the background
 * every 60 seconds. Visitors always get a fast response.
 *
 * Pagination via URL searchParams: ?page=1, ?page=2, …
 * Each unique page URL gets its own static snapshot — still ISR.
 */

import type { Metadata } from "next";
import { getAllPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Posts",
  description: "ISR-powered blog posts, revalidated every 60 seconds.",
};

const PAGE_SIZE = 10;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function PostsPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, totalPages);

  const posts = allPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-8 animate-slide-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="tag">ISR</span>
            <span className="mono text-xs text-slate-600">revalidate: 60s</span>
          </div>
          <h1 className="mono text-2xl font-bold text-white">Posts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Statically generated and re-validated every 60 seconds in the background.
          </p>
        </div>
        <div className="tag tag-amber shrink-0 self-start sm:self-auto">
          {allPosts.length} posts
        </div>
      </div>

      {/* ISR explanation card */}
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
        <p className="mono text-xs text-amber-400 mb-1">// ISR: stale-while-revalidate</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          This page was statically generated and cached. After 60 s a background
          re-fetch is triggered. Visitors always get a fast cached response — the
          regeneration happens silently behind the scenes.
        </p>
      </div>

      {/* Posts grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={safePage} totalPages={totalPages} basePath="/posts" />

      <p className="text-center mono text-xs text-slate-600">
        Page {safePage} of {totalPages} · showing {posts.length} of {allPosts.length} posts
      </p>

    </div>
  );
}
