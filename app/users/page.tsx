/**
 * app/users/page.tsx — USERS LIST
 *
 * ─── Rendering Strategy: SSR (Server-Side Rendering) ─────────────────────────
 *
 * WHY SSR?
 * Users represent dynamic, potentially personalised data. SSR ensures every
 * request gets fresh data. Pagination is handled via URL searchParams which
 * Next.js reads on the server — no JS needed for navigation.
 */

import type { Metadata } from "next";
import { getAllUsers } from "@/lib/api";
import UserCard from "@/components/UserCard";
import Pagination from "@/components/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Users",
  description: "SSR-rendered user directory — fresh data on every request.",
};

const PAGE_SIZE = 10;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function UsersPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const allUsers = await getAllUsers();
  const totalPages = Math.ceil(allUsers.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, totalPages);

  const users = allUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-8 animate-slide-up">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="tag tag-amber">SSR</span>
            <span className="mono text-xs text-slate-600">cache: no-store</span>
          </div>
          <h1 className="mono text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            This page is rendered fresh on the server for every request.
          </p>
        </div>
        <div className="tag shrink-0 self-start sm:self-auto">
          {allUsers.length} users
        </div>
      </div>

      {/* SSR explanation card */}
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
        <p className="mono text-xs text-amber-400 mb-1">// SSR: rendered per-request</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          No caching. The server fetches user data and renders HTML on every
          incoming HTTP request. This guarantees fresh data — essential for
          personalised or auth-gated pages. Use{" "}
          <code className="mono text-amber-400">cache: &apos;no-store&apos;</code> or{" "}
          <code className="mono text-amber-400">export const dynamic = &apos;force-dynamic&apos;</code>.
        </p>
      </div>

      {/* Users grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={safePage} totalPages={totalPages} basePath="/users" />

      <p className="text-center mono text-xs text-slate-600">
        Page {safePage} of {totalPages} · showing {users.length} of {allUsers.length} users
      </p>

    </div>
  );
}
