/**
 * app/users/[id]/page.tsx — USER DETAIL
 *
 * ─── Rendering Strategy: SSR ──────────────────────────────────────────────────
 *
 * Dynamic user profile page. We intentionally do NOT use generateStaticParams
 * here because: (a) user data can change at any time (last login, bio, role),
 * (b) in production this would be behind an auth check, and (c) we want to
 * demonstrate the contrast with the ISR post pages.
 *
 * All three fetches (user, posts, todos) are fired in parallel with
 * Promise.all — this is important for SSR performance since sequential awaits
 * would add each request's latency to the TTFB.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserById, getPostsByUser, getTodosByUser } from "@/lib/api";
import type { PageProps } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const user = await getUserById(Number(id));
    return { title: user.name, description: `Profile of ${user.name} · ${user.company.name}` };
  } catch {
    return { title: "User not found" };
  }
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId) || numId < 1 || numId > 10) notFound();

  // ✅ Parallel data fetching — minimises SSR latency
  const [user, posts, todos] = await Promise.all([
    getUserById(numId),
    getPostsByUser(numId),
    getTodosByUser(numId),
  ]);

  const completedTodos = todos.filter((t) => t.completed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">

      {/* Back */}
      <Link href="/users" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-cyan-400 transition-colors mono">
        ← Users
      </Link>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="tag tag-amber">SSR</span>
        <span className="tag tag-green">Parallel fetch (Promise.all)</span>
      </div>

      {/* Profile card */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-6 sm:col-span-2 space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold mono shrink-0 bg-cyan-400/15 text-cyan-400">
              {user.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <p className="mono text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Email",   value: user.email },
              { label: "Phone",   value: user.phone },
              { label: "Website", value: user.website },
              { label: "City",    value: `${user.address.city}, ${user.address.zipcode}` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-white/5 px-3 py-2">
                <p className="mono text-[10px] text-slate-600 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-slate-300 mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company + todos sidebar */}
        <div className="space-y-3">
          <div className="card p-4 space-y-2">
            <p className="mono text-[10px] text-slate-600 uppercase tracking-wider">Company</p>
            <p className="text-sm font-semibold text-slate-200">{user.company.name}</p>
            <p className="text-xs text-slate-500 italic">&ldquo;{user.company.catchPhrase}&rdquo;</p>
          </div>
          <div className="card p-4 space-y-2">
            <p className="mono text-[10px] text-slate-600 uppercase tracking-wider">Todos</p>
            <p className="mono text-2xl font-bold text-cyan-400">
              {completedTodos}
              <span className="text-slate-600 text-sm font-normal"> / {todos.length}</span>
            </p>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${(completedTodos / todos.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-600">completed</p>
          </div>
        </div>
      </div>

      {/* Posts */}
      <section>
        <h2 className="mono text-sm font-semibold text-slate-400 mb-4">
          // {posts.length} posts by {user.name}
        </h2>
        <div className="space-y-3">
          {posts.slice(0, 5).map((p) => (
            <Link key={p.id} href={`/posts/${p.id}`} className="block group">
              <div className="card px-4 py-3 flex items-center gap-3">
                <span className="mono text-xs text-slate-600 shrink-0">#{p.id}</span>
                <p className="text-sm text-slate-300 capitalize group-hover:text-cyan-400 transition-colors truncate">
                  {p.title}
                </p>
                <span className="mono text-xs text-slate-600 shrink-0 ml-auto">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
