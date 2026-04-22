/**
 * app/http-only-cookie/page.tsx — HTTP-ONLY COOKIE GUIDE
 *
 * ─── Rendering Strategy: SSG (Static Site Generation) ────────────────────────
 *
 * WHY SSG?
 * Pure educational content — never changes at runtime. No fetching needed.
 * Built once at compile time into static HTML. Fastest possible delivery.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP-Only Cookie",
  description: "What is an HttpOnly cookie, when to use it, and the security benefits it provides.",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const WHEN_TO_USE = [
  {
    icon: "🔑",
    title: "Session tokens",
    desc: "Auth session IDs (e.g. from NextAuth, Passport) should always be HttpOnly. JS never needs to read them.",
  },
  {
    icon: "🎫",
    title: "JWT refresh tokens",
    desc: "Refresh tokens are long-lived and high value. Store them in HttpOnly cookies, never in localStorage.",
  },
  {
    icon: "🛒",
    title: "Shopping cart IDs",
    desc: "Server-managed cart identifiers that the backend reads on every request — JS has no reason to access these.",
  },
  {
    icon: "👤",
    title: "Remember-me tokens",
    desc: "Persistent login tokens should be HttpOnly. Stolen tokens are XSS gold — don't expose them to scripts.",
  },
];

const WHEN_NOT_TO_USE = [
  {
    icon: "🎨",
    title: "UI preferences",
    desc: "Theme, language, layout settings. Your JS needs to read these to render the correct UI — HttpOnly would block that.",
  },
  {
    icon: "📊",
    title: "Client-side feature flags",
    desc: "If your frontend JS conditionally renders components based on a flag, it must be able to read the cookie.",
  },
  {
    icon: "🔍",
    title: "Analytics / tracking IDs",
    desc: "Third-party scripts (GA, Segment) need to read their own cookies. HttpOnly would break them entirely.",
  },
];

const BENEFITS = [
  {
    title: "XSS protection",
    icon: "🛡️",
    color: "border-emerald-400/30 bg-emerald-400/5",
    labelClass: "tag-green",
    desc: "document.cookie cannot read HttpOnly cookies. Even if an attacker injects malicious script, they cannot steal the session token.",
  },
  {
    title: "Credential isolation",
    icon: "🔒",
    color: "border-cyan-400/20 bg-cyan-400/5",
    labelClass: "",
    desc: "Auth cookies are silently attached by the browser on every request without any JavaScript involvement. Your app code never touches them.",
  },
  {
    title: "Defense in depth",
    icon: "🧱",
    color: "border-violet-400/30 bg-violet-400/5",
    labelClass: "tag",
    desc: "HttpOnly is one layer in a security stack: pair it with Secure (HTTPS-only), SameSite=Strict/Lax, and short expiry for maximum protection.",
  },
];

const ATTRIBUTES = [
  { attr: "HttpOnly",             effect: "JS cannot read via document.cookie",             important: true },
  { attr: "Secure",               effect: "Only sent over HTTPS connections",                important: true },
  { attr: "SameSite=Strict",      effect: "Never sent on cross-site requests",               important: false },
  { attr: "SameSite=Lax",         effect: "Sent on top-level navigations, not sub-requests", important: false },
  { attr: "SameSite=None",        effect: "Sent on all requests — requires Secure",          important: false },
  { attr: "Path=/",               effect: "Cookie available for all paths on this domain",   important: false },
  { attr: "Max-Age=<seconds>",    effect: "How long the cookie persists (omit for session)",  important: false },
  { attr: "Domain=example.com",   effect: "Which (sub)domains receive the cookie",           important: false },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HttpOnlyCookiePage() {
  return (
    <div className="space-y-12 animate-slide-up">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 sm:p-10 grid-dots">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }}
        />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2">
            <span className="tag">SSG</span>
            <span className="mono text-xs text-slate-600">static — built at compile time</span>
          </div>
          <h1 className="mono text-3xl sm:text-4xl font-bold text-white">
            HTTP-Only <span className="text-cyan-400 glow-text">Cookie</span>
          </h1>
          <p className="max-w-2xl text-slate-400 text-base leading-relaxed">
            A browser cookie with the <code className="mono text-cyan-400">HttpOnly</code> attribute
            set — the most important defence against session hijacking via XSS.
          </p>
        </div>
      </section>

      {/* ── What is it ──────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="01" title="What is an HttpOnly Cookie?" />
        <div className="card p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            A cookie is a small piece of data the server sends to the browser.
            When it carries the <code className="mono text-cyan-400">HttpOnly</code> attribute,
            the browser <strong className="text-slate-200">refuses to expose it to JavaScript</strong>.
            It is still sent automatically on every matching HTTP request — the browser handles that — but
            your JS code cannot read, modify, or steal it.
          </p>

          {/* Code comparison */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] p-4">
              <p className="mono text-xs text-rose-400 mb-2">// Without HttpOnly — DANGEROUS</p>
              <pre className="mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
{`Set-Cookie: sessionId=abc123

// Attacker can run:
document.cookie
// → "sessionId=abc123"  ← stolen!`}
              </pre>
            </div>
            <div className="rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] p-4">
              <p className="mono text-xs text-emerald-400 mb-2">// With HttpOnly — SAFE</p>
              <pre className="mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
{`Set-Cookie: sessionId=abc123; HttpOnly

// Attacker tries:
document.cookie
// → ""  ← cookie is invisible to JS`}
              </pre>
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="mono text-xs text-cyan-400 mb-1">// How the server sets it</p>
            <pre className="mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
{`// Express / Node.js
res.cookie('sessionId', token, {
  httpOnly: true,   // JS cannot read
  secure: true,     // HTTPS only
  sameSite: 'lax',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

// Next.js App Router (Route Handler)
cookies().set('sessionId', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="02" title="Security Benefits" />
        <div className="grid sm:grid-cols-3 gap-4">
          {BENEFITS.map(({ title, icon, color, desc }) => (
            <div key={title} className={`card border ${color} p-5 space-y-2`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── When to use ─────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="03" title="When Should You Use It?" />
        <div className="grid sm:grid-cols-2 gap-4">
          {WHEN_TO_USE.map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
                <span className="tag tag-green text-[9px] ml-auto">Use HttpOnly</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── When NOT to use ─────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="04" title="When Should You NOT Use It?" />
        <div className="grid sm:grid-cols-3 gap-4">
          {WHEN_NOT_TO_USE.map(({ icon, title, desc }) => (
            <div key={title} className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
                <span className="tag tag-amber text-[9px] ml-auto">Skip HttpOnly</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cookie attributes reference ──────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="05" title="Cookie Attributes Reference" />
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-raised)]">
                  <th className="text-left px-4 py-3 text-slate-400 mono font-medium">Attribute</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Effect</th>
                </tr>
              </thead>
              <tbody>
                {ATTRIBUTES.map(({ attr, effect, important }, i) => (
                  <tr
                    key={attr}
                    className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                  >
                    <td className={`px-4 py-3 mono whitespace-nowrap ${important ? "text-cyan-400" : "text-slate-400"}`}>
                      {attr}
                      {important && <span className="ml-2 tag text-[8px]">key</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 leading-relaxed">{effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Quick rule ──────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
        <p className="mono text-xs text-emerald-400 mb-2">// The simple rule</p>
        <p className="text-sm text-slate-300 font-medium leading-relaxed">
          If JavaScript has no reason to read the cookie → set <code className="mono text-cyan-400">HttpOnly</code>.
        </p>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Auth tokens, session IDs, refresh tokens — your JS code never needs to read these.
          The browser handles attaching them to requests automatically.
          Always pair <code className="mono text-slate-400">HttpOnly</code> with{" "}
          <code className="mono text-slate-400">Secure</code> and <code className="mono text-slate-400">SameSite</code> for full protection.
        </p>
      </section>

      {/* ── SSG note ────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
        <p className="mono text-xs text-cyan-400 mb-1">// This page uses SSG</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          No dynamic data — pure educational content baked into HTML at build time.
          Zero server compute per visitor, served directly from the CDN edge.
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
