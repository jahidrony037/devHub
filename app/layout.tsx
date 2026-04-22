import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "DevHub", template: "%s | DevHub" },
  description:
    "A Next.js  App Router showcase: SSG, ISR, SSR, and Client-Side Rendering.",
};

/**
 * RootLayout — Server Component
 *
 * The layout wraps every page. Because it's a Server Component it runs on the
 * server, sets HTML metadata, and renders the shared <Navbar>.
 *
 * Navbar is "use client" because it needs usePathname (client hook), but this
 * layout itself stays on the server — Next.js handles the boundary for us.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-[var(--border)] mt-16 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="mono text-xs text-slate-600">
              DevHub — Next.js · App Router · TypeScript · Tailwind
            </p>
            <div className="flex items-center gap-3">
              {["SSG", "ISR", "SSR", "CSR", "PPR"].map((t) => (
                <span key={t} className="tag text-[9px] px-1.5 py-0.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
