/**
 * lib/api.ts  — Server-side data helpers (used in Server Components only)
 *
 * WHY native `fetch` here (not Axios)?
 * Next.js EXTENDS the global `fetch` on the server so it can intercept and
 * inject caching behaviour via the `next` option.  Axios bypasses this layer,
 * so native fetch is the right tool for Server Components.
 *
 * Cache Strategies at a glance:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  cache: 'force-cache'              → SSG  (fetch once at build time)   │
 * │  next: { revalidate: N }           → ISR  (re-fetch every N seconds)   │
 * │  cache: 'no-store'                 → SSR  (fetch on every request)     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import { Post, User, Comment, Todo } from "./types";

const BASE = "https://jsonplaceholder.typicode.com";

// ─── Generic fetch wrapper ─────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

// ─── SSG helpers  (cache: 'force-cache' — default in Next 14/15) ──────────────

/** Fetched ONCE at build time → baked into the static HTML */
export const getStaticStats = () =>
  apiFetch<Post[]>("/posts", { cache: "force-cache" });

// ─── ISR helpers  (next: { revalidate: N }) ───────────────────────────────────

/** Re-validated every 60 s → stale content shown until background refresh */
export const getAllPosts = () =>
  apiFetch<Post[]>("/posts", { next: { revalidate: 60 } });

export const getPostById = (id: number) =>
  apiFetch<Post>(`/posts/${id}`, { next: { revalidate: 60 } });

export const getCommentsByPost = (postId: number) =>
  apiFetch<Comment[]>(`/posts/${postId}/comments`, {
    next: { revalidate: 60 },
  });

/** Pre-build route params for generateStaticParams */
export const getPostIds = async (): Promise<number[]> => {
  const posts = await apiFetch<Post[]>("/posts", { cache: "force-cache" });
  // Pre-render only first 10 posts; the rest are rendered on-demand (ISR)
  return posts.slice(0, 10).map((p) => p.id);
};

// ─── SSR helpers  (cache: 'no-store') ────────────────────────────────────────

/** Always fresh — fetched on every incoming HTTP request */
export const getAllUsers = () =>
  apiFetch<User[]>("/users", { cache: "no-store" });

export const getUserById = (id: number) =>
  apiFetch<User>(`/users/${id}`, { cache: "no-store" });

export const getPostsByUser = (userId: number) =>
  apiFetch<Post[]>(`/users/${userId}/posts`, { cache: "no-store" });

export const getTodosByUser = (userId: number) =>
  apiFetch<Todo[]>(`/users/${userId}/todos`, { cache: "no-store" });
