/**
 * app/cors/page.tsx — CORS GUIDE
 *
 * ─── Rendering Strategy: SSG (Static Site Generation) ────────────────────────
 *
 * WHY SSG?
 * This is purely educational content — it never changes at runtime.
 * No user data, no dynamic queries. SSG bakes this into static HTML at
 * build time: zero server work per visitor, instant TTFB, perfect for SEO.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CORS Policy",
  description: "What is CORS, when does it happen, and how do you fix it?",
};

// ─── Static data — defined at module level, never re-evaluated at runtime ────

const WHEN_IT_HAPPENS = [
  {
    title: "Different Origin",
    icon: "🌐",
    desc: "Your frontend is on https://app.com but fetches from https://api.com — different origin triggers CORS.",
  },
  {
    title: "Different Port",
    icon: "🔌",
    desc: "localhost:3000 calling localhost:8080 — same host but different port counts as a cross-origin request.",
  },
  {
    title: "Different Protocol",
    icon: "🔒",
    desc: "http:// calling https:// is cross-origin even if the domain and port are identical.",
  },
  {
    title: "Preflight Requests",
    icon: "✈️",
    desc: "Non-simple methods (PUT, DELETE, PATCH) or custom headers trigger an OPTIONS preflight before the real request.",
  },
];

const HOW_TO_SOLVE = [
  {
    label: "Server sets headers",
    badge: "Recommended",
    badgeClass: "tag-green",
    code: `// Express / Node.js
res.setHeader('Access-Control-Allow-Origin', 'https://app.com');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');`,
    note: "The correct fix. The server explicitly whitelists allowed origins.",
  },
  {
    label: "Next.js API Route",
    badge: "App Router",
    badgeClass: "",
    code: `// app/api/data/route.ts
export async function GET() {
  return Response.json({ ok: true }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
    },
  });
}`,
    note: "Set headers directly in the Response from your Route Handler.",
  },
  {
    label: "Next.js next.config",
    badge: "Config",
    badgeClass: "tag-amber",
    code: `// next.config.ts
const config = {
  async headers() {
    return [{
      source: '/api/:path*',
      headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
    }];
  },
};`,
    note: "Apply CORS headers globally to all matching routes via config.",
  },
  {
    label: "Dev Proxy (avoid in prod)",
    badge: "Dev Only",
    badgeClass: "tag-red",
    code: `// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}`,
    note: "Proxy rewrites the origin so the browser never sees a cross-origin request. Only works in dev.",
  },
];

const HEADERS_TABLE = [
  { header: "Access-Control-Allow-Origin", desc: "Which origins are allowed. Use * for public APIs or a specific domain for private ones." },
  { header: "Access-Control-Allow-Methods", desc: "HTTP methods the browser is permitted to use (GET, POST, PUT, DELETE, PATCH)." },
  { header: "Access-Control-Allow-Headers", desc: "Request headers the client is allowed to send (e.g. Authorization, Content-Type)." },
  { header: "Access-Control-Allow-Credentials", desc: "Set to true if cookies / auth headers should be included. Cannot be combined with * origin." },
  { header: "Access-Control-Max-Age", desc: "How long (seconds) the browser can cache the preflight response before sending another OPTIONS." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CorsPage() {
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
            CORS <span className="text-cyan-400 glow-text">Policy</span>
          </h1>
          <p className="max-w-2xl text-slate-400 text-base leading-relaxed">
            Cross-Origin Resource Sharing — the browser security mechanism that controls
            which domains can read responses from your server.
          </p>
        </div>
      </section>

      {/* ── What is CORS ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="01" title="What is CORS?" />
        <div className="card p-6 space-y-4">
          <p className="text-sm text-slate-400 leading-relaxed">
            CORS (Cross-Origin Resource Sharing) is a <strong className="text-slate-200">browser security policy</strong> that
            blocks JavaScript on one origin from reading responses sent by a different origin — unless that
            server explicitly allows it.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            An <strong className="text-slate-200">origin</strong> is the combination of protocol + domain + port.
            Two URLs are the same origin only if all three parts match exactly.
          </p>

          {/* Origin visual */}
          <div className="rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] p-4 overflow-x-auto">
            <p className="mono text-xs text-slate-600 mb-3">// Origin = protocol + domain + port</p>
            <div className="flex flex-wrap gap-1 items-center mono text-sm">
              <span className="px-2 py-1 rounded bg-cyan-400/15 text-cyan-400 border border-cyan-400/20">https://</span>
              <span className="px-2 py-1 rounded bg-violet-400/15 text-violet-400 border border-violet-400/20">app.example.com</span>
              <span className="px-2 py-1 rounded bg-amber-400/15 text-amber-400 border border-amber-400/20">:443</span>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              {[
                { url: "https://app.example.com/data",        result: "✅ Same origin", ok: true },
                { url: "https://api.example.com/data",        result: "❌ Different subdomain", ok: false },
                { url: "http://app.example.com/data",         result: "❌ Different protocol", ok: false },
                { url: "https://app.example.com:8080/data",   result: "❌ Different port", ok: false },
                { url: "https://other.com/data",              result: "❌ Different domain", ok: false },
              ].map(({ url, result, ok }) => (
                <div key={url} className="flex items-center gap-3">
                  <code className="mono text-slate-500 flex-1 truncate">{url}</code>
                  <span className={`shrink-0 ${ok ? "text-emerald-400" : "text-rose-400"}`}>{result}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
            <p className="mono text-xs text-cyan-400 mb-1">// Key insight</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              CORS is enforced by the <strong className="text-slate-200">browser</strong>, not the server.
              The request still reaches the server — the browser just refuses to give the response to your
              JavaScript if the server doesn&apos;t include the correct headers.
              Server-to-server calls (Node.js, curl) are never blocked by CORS.
            </p>
          </div>
        </div>
      </section>

      {/* ── When does CORS happen ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="02" title="When Does CORS Happen?" />
        <div className="grid sm:grid-cols-2 gap-4">
          {WHEN_IT_HAPPENS.map(({ title, icon, desc }) => (
            <div key={title} className="card p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <h3 className="font-semibold text-slate-200 text-sm">{title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Preflight flow */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <span className="tag">Preflight Flow</span>
            <span className="text-slate-500 font-normal text-xs">OPTIONS request before the real one</span>
          </h3>
          <div className="space-y-2 mono text-xs">
            {[
              { step: "1", arrow: "→", who: "Browser", msg: "OPTIONS /api/data (preflight check)" },
              { step: "2", arrow: "→", who: "Server",  msg: "200 OK + Access-Control-Allow-* headers" },
              { step: "3", arrow: "→", who: "Browser", msg: "Real request: POST /api/data" },
              { step: "4", arrow: "→", who: "Server",  msg: "200 OK + response body" },
            ].map(({ step, who, msg }) => (
              <div key={step} className="flex items-start gap-3 p-2 rounded bg-[var(--bg-raised)]">
                <span className="text-slate-600 shrink-0">0{step}.</span>
                <span className="text-cyan-400 shrink-0 w-14">{who}</span>
                <span className="text-slate-400">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to solve ────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="03" title="How to Solve CORS Errors" />
        <div className="space-y-4">
          {HOW_TO_SOLVE.map(({ label, badge, badgeClass, code, note }) => (
            <div key={label} className="card p-5 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-slate-200 text-sm">{label}</h3>
                <span className={`tag ${badgeClass}`}>{badge}</span>
              </div>
              <pre className="rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] p-4 text-xs text-slate-300 mono overflow-x-auto leading-relaxed">
                <code>{code}</code>
              </pre>
              <p className="text-xs text-slate-500 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Response headers reference ───────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="04" title="CORS Response Headers" />
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-raised)]">
                  <th className="text-left px-4 py-3 text-slate-400 mono font-medium">Header</th>
                  <th className="text-left px-4 py-3 text-slate-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {HEADERS_TABLE.map(({ header, desc }, i) => (
                  <tr
                    key={header}
                    className={`border-b border-white/5 ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                  >
                    <td className="px-4 py-3 mono text-cyan-400 whitespace-nowrap">{header}</td>
                    <td className="px-4 py-3 text-slate-400 leading-relaxed">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Common mistakes ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle index="05" title="Common Mistakes" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              mistake: "Wildcard + credentials",
              detail: "Access-Control-Allow-Origin: * cannot be used with Access-Control-Allow-Credentials: true. Specify the exact origin instead.",
              color: "border-rose-400/30 bg-rose-400/5",
              label: "tag-red",
            },
            {
              mistake: "CORS in the browser",
              detail: "You can't bypass CORS from the browser side. Browser extensions that 'disable CORS' only work for your own browser — never ship that as a fix.",
              color: "border-amber-400/30 bg-amber-400/5",
              label: "tag-amber",
            },
            {
              mistake: "Forgetting OPTIONS",
              detail: "If your server only handles GET/POST but not OPTIONS, preflight requests fail. Always add an OPTIONS handler or use middleware like cors npm package.",
              color: "border-rose-400/30 bg-rose-400/5",
              label: "tag-red",
            },
          ].map(({ mistake, detail, color, label }) => (
            <div key={mistake} className={`card border ${color} p-5 space-y-2`}>
              <div className="flex items-center gap-2">
                <span className={`tag ${label}`}>⚠ Avoid</span>
              </div>
              <h3 className="font-semibold text-slate-200 text-sm">{mistake}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SSG note ────────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">
        <p className="mono text-xs text-cyan-400 mb-1">// This page uses SSG</p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Educational content like this is a perfect fit for Static Site Generation.
          The content never changes at runtime, so we bake it into HTML at build time.
          Zero server compute per request, instant TTFB, and perfect Lighthouse scores.
        </p>
      </section>

    </div>
  );
}

// ─── Shared sub-component ─────────────────────────────────────────────────────

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mono text-xs text-slate-600">{index}</span>
      <h2 className="mono text-lg font-semibold text-slate-200">{title}</h2>
    </div>
  );
}
