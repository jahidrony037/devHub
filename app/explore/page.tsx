"use client";

/**
 * app/explore/page.tsx — EXPLORE (Search)
 *
 * ─── Rendering Strategy: CSR (Client-Side Rendering) ─────────────────────────
 * Pagination resets to page 1 whenever the query or tab changes.
 * All filtering and pagination happen in-memory — no server round-trips.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import apiClient from "@/lib/axios";
import type { Post, User } from "@/lib/types";

type Tab = "posts" | "users";
const PAGE_SIZE = 10;

export default function ExplorePage() {
  const [tab, setTab]             = useState<Tab>("posts");
  const [query, setQuery]         = useState("");
  const [posts, setPosts]         = useState<Post[]>([]);
  const [users, setUsers]         = useState<User[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [page, setPage]           = useState(1);

  const abortRef = useRef<AbortController | null>(null);

  // Reset to page 1 when query or tab changes
  useEffect(() => { setPage(1); }, [query, tab]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const [postsRes, usersRes] = await Promise.all([
        apiClient.get<Post[]>("/posts", { signal: abortRef.current.signal }),
        apiClient.get<User[]>("/users", { signal: abortRef.current.signal }),
      ]);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
      setHasLoaded(true);
    } catch (err) {
      if (!axios.isCancel(err)) setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
    return () => abortRef.current?.abort();
  }, [loadAll]);

  const q = query.toLowerCase().trim();

  const filteredPosts = posts.filter(
    (p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
  );
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q)
  );

  const activeResults = tab === "posts" ? filteredPosts : filteredUsers;
  const totalPages    = Math.max(1, Math.ceil(activeResults.length / PAGE_SIZE));
  const safePage      = Math.min(page, totalPages);
  const pageItems     = activeResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-8 animate-slide-up">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="tag tag-green">CSR</span>
          <span className="mono text-xs text-slate-600">Axios + useState</span>
        </div>
        <h1 className="mono text-2xl font-bold text-white">Explore</h1>
        <p className="text-sm text-slate-500 mt-1">
          Client-side search across all posts and users. Powered by Axios with request
          interceptors, abort-on-unmount, and parallel fetching.
        </p>
      </div>

      {/* CSR callout */}
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
        <p className="mono text-xs text-emerald-400 mb-1">// CSR: Axios client instance</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          This page uses <code className="mono text-emerald-400">lib/axios.ts</code> — a
          configured Axios instance with request/response interceptors. Open your browser
          console to see every Axios log. Filtering and pagination happen instantly in-memory.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          {loading ? (
            <svg className="h-4 w-4 text-cyan-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          )}
        </div>
        <input
          type="text"
          placeholder={`Search ${tab}…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all mono"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-3.5 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--border)]">
        {(["posts", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-all capitalize border-b-2 -mb-px ${
              tab === t
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t}
            <span className="ml-2 mono text-[10px] text-slate-600">
              ({t === "posts" ? filteredPosts.length : filteredUsers.length})
            </span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={loadAll} className="shrink-0 tag tag-red hover:opacity-80 transition-opacity cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Skeleton — always 10 to match PAGE_SIZE */}
      {loading && !hasLoaded && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3 animate-pulse">
              <div className="h-3 w-16 rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="space-y-1.5">
                <div className="h-3 rounded bg-white/5" />
                <div className="h-3 w-5/6 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {hasLoaded && !loading && activeResults.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-4xl">🔍</p>
          <p className="text-slate-400 text-sm">No {tab} match &ldquo;{query}&rdquo;</p>
          <button onClick={() => setQuery("")} className="tag mt-2 cursor-pointer hover:opacity-80">
            Clear search
          </button>
        </div>
      )}

      {/* Results */}
      {hasLoaded && !loading && pageItems.length > 0 && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tab === "posts"
              ? (pageItems as Post[]).map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="block group">
                    <div className="card p-4 h-full flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="tag text-[9px]">post #{post.id}</span>
                        <span className="mono text-[10px] text-slate-600">user_{post.userId}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200 capitalize leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {highlightMatch(post.title, q)}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 flex-1">{post.body}</p>
                    </div>
                  </Link>
                ))
              : (pageItems as User[]).map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`} className="block group">
                    <div className="card p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-cyan-400/15 text-cyan-400 flex items-center justify-center text-xs font-bold mono shrink-0">
                          {user.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                            {user.name}
                          </p>
                          <p className="mono text-[10px] text-slate-500">@{user.username}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-xs text-slate-600 truncate">{user.company.name}</p>
                    </div>
                  </Link>
                ))}
          </div>

          {/* Client-side pagination */}
          {totalPages > 1 && (
            <ClientPagination currentPage={safePage} totalPages={totalPages} onChange={setPage} />
          )}

          <p className="text-center mono text-xs text-slate-600">
            Page {safePage} of {totalPages} · showing {pageItems.length} of {activeResults.length} {tab}
          </p>
        </>
      )}
    </div>
  );
}

// ── Client-side pagination (button-based, no URL change) ─────────────────────
function ClientPagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm font-medium mono border border-[var(--border)] disabled:text-slate-700 disabled:cursor-not-allowed text-slate-400 hover:enabled:bg-white/5 hover:enabled:text-slate-200 transition-colors"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e-${i}`} className="px-2 text-slate-600 mono text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm mono font-medium transition-colors ${
                p === currentPage
                  ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                  : "text-slate-400 border border-[var(--border)] hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm font-medium mono border border-[var(--border)] disabled:text-slate-700 disabled:cursor-not-allowed text-slate-400 hover:enabled:bg-white/5 hover:enabled:text-slate-200 transition-colors"
      >
        Next →
      </button>
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-cyan-400/20 text-cyan-300 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
