/**
 * app/page.tsx — HOME PAGE
 *
 * ─── Rendering Strategy: SSG (Static Site Generation) ────────────────────────
 *
 * WHY SSG here?
 * The home page is mostly marketing/hero content that never changes at runtime.
 * We fetch total post count once at BUILD TIME and bake it into the HTML.
 * Result: zero server work per visitor, instant TTFB, perfect Lighthouse score.
 *
 * HOW Next.js does it:
 * When there are no dynamic functions (cookies(), headers(), searchParams) and
 * fetch uses `cache: 'force-cache'` (the default), Next generates a static HTML
 * file at build time.  No Node.js process runs per request.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getStaticStats } from "@/lib/api";

export const metadata: Metadata = {
  title: "Home",
  description: "DevHub — Next.js rendering strategies showcase",
};

const FEATURES = [
  {
    href: "/posts",
    label: "Posts",
    badge: "ISR",
    badgeClass: "",
    icon: "📝",
    desc: "Blog posts revalidated every 60 s. Content stays fresh without a full rebuild.",
    detail: "fetch + next: { revalidate: 60 }",
  },
  {
    href: "/users",
    label: "Users",
    badge: "SSR",
    badgeClass: "tag-amber",
    icon: "👥",
    desc: "User profiles fetched fresh on every request. Perfect for auth-gated, personalised data.",
    detail: "fetch + cache: 'no-store'",
  },
  {
    href: "/explore",
    label: "Explore",
    badge: "CSR",
    badgeClass: "tag-green",
    icon: "🔍",
    desc: "Client-side search powered by Axios. Interceptors handle logging and errors globally.",
    detail: "Axios client instance + React state",
  },
  {
    href: "/cors",
    label: "CORS",
    badge: "SSG",
    badgeClass: "",
    icon: "🌐",
    desc: "What is CORS? When does it happen and how do you fix it? A complete visual guide.",
    detail: "Static educational page — zero server cost",
  },
  {
    href: "/http-only-cookie",
    label: "HTTP-Only Cookie",
    badge: "SSG",
    badgeClass: "",
    icon: "🍪",
    desc: "What is an HttpOnly cookie, when should you use it, and what security benefits does it give?",
    detail: "Static educational page — zero server cost",
  },
  {
    href: "/ppr",
    label: "PPR",
    badge: "SSG",
    badgeClass: "",
    icon: "⚡",
    desc: "Partial Pre-Rendering — Next.js 15's hybrid strategy that combines static shells with dynamic islands.",
    detail: "Static educational page — zero server cost",
  },
];

export default async function HomePage() {
  // SSG: fetch runs once at build time. `getStaticStats` uses cache: 'force-cache'
  const posts = await getStaticStats();
  const totalPosts = posts.length;

  return (
    <div className="space-y-16 animate-slide-up">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-12 grid-dots">
        {/* Glow orb */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="tag">Next.js</span>
            <span className="tag tag-amber">App Router</span>
            <span className="tag tag-green">TypeScript</span>
          </div>

          <h1 className="mono text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Dev<span className="text-cyan-400 glow-text">Hub</span>
          </h1>

          <p className="max-w-xl text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
            A production-quality Next.js showcase demonstrating{" "}
            <span className="text-slate-200 font-medium">SSG</span>,{" "}
            <span className="text-slate-200 font-medium">ISR</span>,{" "}
            <span className="text-slate-200 font-medium">SSR</span>, and{" "}
            <span className="text-slate-200 font-medium">CSR</span> — all in one
            App Router project with native <code className="mono text-cyan-400">fetch</code> and{" "}
            <code className="mono text-cyan-400">axios</code>.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              Explore Posts
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-colors"
            >
              Try Live Search
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats row (data from SSG fetch) ──────────────────────────────── */}
      <section>
        <p className="mono text-xs text-slate-600 mb-4">
          // These numbers were fetched at BUILD TIME (SSG)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Posts",  value: totalPosts,    note: "from build" },
            { label: "Rendering Modes", value: 4,          note: "SSG·ISR·SSR·CSR" },
            { label: "ISR Revalidate", value: "60s",       note: "stale-while-revalidate" },
            { label: "API Client",   value: "Axios",       note: "interceptors ✓" },
          ].map(({ label, value, note }) => (
            <div key={label} className="card p-4 text-center">
              <p className="mono text-2xl font-bold text-cyan-400 glow-text">{value}</p>
              <p className="text-xs text-slate-300 font-medium mt-1">{label}</p>
              <p className="text-[10px] text-slate-600 mono mt-0.5">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mono text-lg font-semibold text-slate-200 mb-6">
          // Pages &amp; Strategies
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {FEATURES.map(({ href, label, badge, badgeClass, icon, desc, detail }) => (
            <Link key={href} href={href} className="block group">
              <div className="card p-6 h-full flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{icon}</span>
                  <span className={`tag ${badgeClass}`}>{badge}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {label}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
                </div>
                <code className="mono text-[10px] text-slate-600 mt-auto">{detail}</code>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SSG explanation callout ───────────────────────────────────────── */}
      <section className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
        <p className="mono text-xs text-cyan-400 mb-1">// This page uses SSG</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          This entire page — including the post count above — was rendered to static HTML at{" "}
          <strong className="text-slate-200">build time</strong>. The server doesn&apos;t run any code
          when you visit. This is the fastest possible delivery: CDN-edge cached HTML,
          zero database calls per request.
        </p>
      </section>

    </div>
  );
}
