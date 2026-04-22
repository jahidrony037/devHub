/**
 * app/ppr/page.tsx — PPR GUIDE
 *
 * ─── Rendering Strategy: SSG (Static Site Generation) ────────────────────────
 *
 * WHY SSG?
 * Documenting PPR as static content is intentionally ironic: the page about
 * dynamic rendering is itself perfectly static. Educational content = no
 * runtime data = SSG is the optimal choice.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPR — Partial Pre-Rendering",
  description: "What is Partial Pre-Rendering in Next.js and how do you use it?",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const STRATEGIES_COMPARISON = [
  { name: "SSG",  shell: "Static", dynamic: "None",    ttfb: "⚡ Instant", use: "Marketing, docs, blogs" },
  { name: "ISR",  shell: "Static", dynamic: "None",    ttfb: "⚡ Fast",    use: "Content that changes occasionally" },
  { name: "SSR",  shell: "Dynamic", dynamic: "Full page", ttfb: "🐢 Slower", use: "Auth pages, dashboards" },
  { name: "CSR",  shell: "Static", dynamic: "Client JS", ttfb: "⚡ Fast",   use: "Highly interactive UIs" },
  { name: "PPR",  shell: "Static", dynamic: "Islands",  ttfb: "⚡ Instant", use: "Hybrid — static + dynamic on one page" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Static shell is pre-rendered",
    desc: "At build time, Next.js renders everything outside Suspense boundaries into a static HTML file stored on the CDN.",
    code: null,
  },
  {
    step: "02",
    title: "Browser receives static HTML instantly",
    desc: "The user sees layout, nav, and static content with zero TTFB wait. Dynamic holes are placeholders (Suspense fallbacks).",
    code: null,
  },
  {
    step: "03",
    title: "Dynamic islands stream in",
    desc: "The server streams HTML for Suspense-wrapped dynamic components. They replace the fallbacks as they resolve.",
    code: `// Suspense boundary = PPR boundary
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      {/* Static — pre-rendered at build */}
      <h1>My Dashboard</h1>
      <StaticNav />

      {/* Dynamic — streamed per request */}
      <Suspense fallback={<CartSkeleton />}>
        <Cart />          {/* reads cookies → dynamic */}
      </Suspense>

      <Suspense fallback={<FeedSkeleton />}>
        <PersonalisedFeed /> {/* auth-gated → dynamic */}
      </Suspense>
    </div>
  );
}`,
  },
];

const USE_CASES = [
  {
    icon: "🛒",
    title: "E-commerce product pages",
    static: "Product images, title, description, specs",
    dynamic: "Stock level, personalised price, cart button",
  },
  {
    icon: "📰",
    title: "News / content sites",
    static: "Article body, author bio, related links",
    dynamic: "Like count, comments, subscription prompt",
  },
  {
    icon: "📊",
    title: "SaaS dashboards",
    static: "Layout, nav, empty chart shells",
    dynamic: "Live metrics, user-specific data, alerts",
  },
  {
    icon: "🏠",
    title: "Home / landing pages",
    static: "Hero, features, pricing table",
    dynamic: "Logged-in user greeting, personalised CTA",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PprPage() {
  return (
    <div className="space-y-12 animate-slide-up">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-10 grid-dots">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
        />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="tag">SSG</span>
            <span className="tag tag-amber">Next.js 15</span>
            <span className="mono text-xs text-slate-600">experimental feature</span>
          </div>
          <h1 className="mono text-3xl sm:text-4xl font-bold text-white">
            Partial Pre-<span className="text-cyan-400 glow-text">Rendering</span>
          </h1>
          <p className="max-w-2xl text-slate-400 text-base leading-relaxed">
            PPR is Next.js&apos;s hybrid rendering strategy — combine a{" "}
            <strong className="text-slate-200">static pre-rendered shell</strong> with{" "}
            <strong className="text-slate-200">dynamic streaming islands</strong> on a single route.
          </p>
        </div>
      </section>

      {/* ── What is PPR ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="01" title="What is PPR?" />
        <div className="card p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            PPR (Partial Pre-Rendering) was introduced as an experimental feature in Next.js 14 and
            stabilised in Next.js 15. It solves a longstanding trade-off: you used to have to choose
            between a <em>fast static page</em> and a <em>dynamic personalised page</em> —
            not both at once.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            With PPR, a single route can have a <strong className="text-slate-200">static outer shell</strong>{" "}
            (pre-rendered at build time, served instantly from the CDN) and{" "}
            <strong className="text-slate-200">dynamic inner islands</strong> (streamed from the
            server per request). The split is expressed using React&apos;s{" "}
            <code className="mono text-cyan-400">{"<Suspense>"}</code> boundaries — no new APIs to learn.
          </p>

          {/* Visual diagram */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-raised)] p-5 space-y-3">
            <p className="mono text-xs text-slate-600 mb-1">// Visual: one page, two rendering modes</p>
            <div className="rounded-lg border-2 border-dashed border-cyan-400/30 p-4 space-y-3">
              <div className="rounded-md bg-cyan-400/10 border border-cyan-400/20 p-3 text-center">
                <p className="text-xs font-semibold text-cyan-400">⚡ Static Shell (CDN-cached)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Navbar · Page title · Layout · Static sections</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-amber-400/10 border border-dashed border-amber-400/30 p-3 text-center">
                  <p className="text-xs font-semibold text-amber-400">🌊 Dynamic Island</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Cart — reads cookies</p>
                </div>
                <div className="rounded-md bg-amber-400/10 border border-dashed border-amber-400/30 p-3 text-center">
                  <p className="text-xs font-semibold text-amber-400">🌊 Dynamic Island</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Feed — auth-gated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="02" title="How Does PPR Work?" />
        <div className="space-y-4">
          {HOW_IT_WORKS_STEPS.map(({ step, title, desc, code }) => (
            <div key={step} className="card p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="mono text-xs text-slate-600 shrink-0 mt-0.5">{step}</span>
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
              {code && (
                <pre className="rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] p-4 text-xs text-slate-300 mono overflow-x-auto leading-relaxed">
                  <code>{code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* Enable PPR */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            Enable PPR
            <span className="tag tag-amber">Config</span>
          </h3>
          <pre className="rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] p-4 text-xs text-slate-300 mono overflow-x-auto leading-relaxed">
            <code>{`// next.config.ts  (Next.js 15)
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    ppr: true,          // enable globally
    // ppr: 'incremental' // or opt-in per route
  },
};

export default config;

// Per-route opt-in (incremental mode):
// app/dashboard/page.tsx
export const experimental_ppr = true;`}
            </code>
          </pre>
        </div>
      </section>

      {/* ── Comparison table ────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="03" title="PPR vs Other Strategies" />
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-raised)]">
                  {["Strategy", "Shell", "Dynamic part", "TTFB", "Best for"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STRATEGIES_COMPARISON.map(({ name, shell, dynamic, ttfb, use }, i) => (
                  <tr
                    key={name}
                    className={`border-b border-white/5 ${name === "PPR" ? "bg-cyan-400/5" : i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                  >
                    <td className={`px-4 py-3 mono font-semibold ${name === "PPR" ? "text-cyan-400" : "text-slate-300"}`}>
                      {name}
                      {name === "PPR" && <span className="ml-2 tag text-[8px]">new</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{shell}</td>
                    <td className="px-4 py-3 text-slate-400">{dynamic}</td>
                    <td className="px-4 py-3 text-slate-400">{ttfb}</td>
                    <td className="px-4 py-3 text-slate-500">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Use cases ───────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="04" title="Perfect Use Cases for PPR" />
        <div className="grid sm:grid-cols-2 gap-4">
          {USE_CASES.map(({ icon, title, static: stat, dynamic }) => (
            <div key={title} className="card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <span className="tag text-[9px] px-1.5 shrink-0 mt-0.5">Static</span>
                  <span className="text-slate-500">{stat}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <span className="tag tag-amber text-[9px] px-1.5 shrink-0 mt-0.5">Dynamic</span>
                  <span className="text-slate-500">{dynamic}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Key rules ───────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="05" title="Rules & Gotchas" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "Suspense = the boundary",
              desc: "Everything outside Suspense is static. Anything inside is dynamic. There's no special PPR API — just React Suspense.",
              color: "border-cyan-400/20 bg-cyan-400/5",
            },
            {
              title: "Dynamic functions trigger islands",
              desc: "cookies(), headers(), or fetch with cache: 'no-store' inside a Suspense boundary makes it a dynamic island automatically.",
              color: "border-cyan-400/20 bg-cyan-400/5",
            },
            {
              title: "Still requires a server",
              desc: "PPR pages cannot be fully static (they stream dynamic content). You need a Node.js server or an edge runtime — not static export.",
              color: "border-amber-400/20 bg-amber-400/5",
            },
            {
              title: "Experimental in v14, stable in v15",
              desc: "PPR was first shipped as experimental in Next.js 14. It became a stable, production-ready feature in Next.js 15.",
              color: "border-amber-400/20 bg-amber-400/5",
            },
          ].map(({ title, desc, color }) => (
            <div key={title} className={`card border ${color} p-5 space-y-2`}>
              <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SSG note ────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
        <p className="mono text-xs text-cyan-400 mb-1">// This page uses SSG</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Ironically, this page about PPR is itself fully static — there&apos;s no dynamic data here at all.
          SSG is always the right choice when content doesn&apos;t change at runtime.
          PPR shines when you have <em>both</em> static and dynamic content on the same page.
        </p>
      </section>

    </div>
  );
}

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mono text-xs text-slate-600">{index}</span>
      <h2 className="mono text-lg font-semibold text-slate-200">{title}</h2>
    </div>
  );
}
