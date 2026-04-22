import Link from "next/link";
import { User } from "@/lib/types";

interface UserCardProps {
  user: User;
}

/** UserCard — Server Component */
export default function UserCard({ user }: UserCardProps) {
  // Generate a colour accent per user for visual identity
  const accents = [
    "border-cyan-400/40",
    "border-violet-400/40",
    "border-amber-400/40",
    "border-emerald-400/40",
    "border-rose-400/40",
    "border-sky-400/40",
    "border-fuchsia-400/40",
    "border-orange-400/40",
    "border-teal-400/40",
    "border-indigo-400/40",
  ];
  const accent = accents[user.id % accents.length];

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <Link href={`/users/${user.id}`} className="block group">
      <article className={`card border-l-2 ${accent} p-5 flex flex-col gap-3 animate-fade-in`}>
        {/* Avatar + Name */}
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold mono shrink-0"
            style={{ background: "var(--cyan-dim)", color: "var(--cyan)" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 mono truncate">@{user.username}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-1">
          <MetaRow icon="✉" label={user.email} />
          <MetaRow icon="🏢" label={user.company.name} />
          <MetaRow icon="📍" label={user.address.city} />
        </div>

        {/* Footer */}
        <div className="pt-1 border-t border-white/5 flex items-center justify-between">
          <span className="tag tag-green text-[9px]">View Profile →</span>
          <span className="mono text-[10px] text-slate-600">{user.website}</span>
        </div>
      </article>
    </Link>
  );
}

function MetaRow({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="text-[10px]">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
