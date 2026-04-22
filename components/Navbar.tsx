"use client";

/**
 * Navbar — Client Component
 * Needs "use client" because it reads window.location for active link styling
 * and manages a mobile-menu state with useState.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/",                 label: "Home",        badge: "SSG" },
  { href: "/posts",            label: "Posts",       badge: "ISR" },
  { href: "/users",            label: "Users",       badge: "SSR" },
  { href: "/explore",          label: "Explore",     badge: "CSR" },
  { href: "/cors",             label: "CORS",        badge: "SSG" },
  { href: "/http-only-cookie", label: "HTTP Cookie", badge: "SSG" },
  { href: "/ppr",              label: "PPR",         badge: "SSG" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="mono text-lg font-bold text-cyan-400 group-hover:glow-text transition-all">
              Dev<span className="text-white">Hub</span>
            </span>
            <span className="hidden sm:block tag text-[10px] px-1.5 py-0.5">
              Next 15
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, badge }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {label}
                  <span
                    className={`tag text-[9px] px-1 py-0 ${
                      badge === "SSR"
                        ? "tag-amber"
                        : badge === "CSR"
                        ? "tag-green"
                        : ""
                    }`}
                  >
                    {badge}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1 animate-fade-in">
            {NAV_LINKS.map(({ href, label, badge }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {label}
                  <span className={`tag text-[9px] px-1 py-0 ${badge === "SSR" ? "tag-amber" : badge === "CSR" ? "tag-green" : ""}`}>
                    {badge}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
