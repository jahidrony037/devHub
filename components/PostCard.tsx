import Link from "next/link";
import { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
}

/**
 * PostCard — Server Component (no "use client" needed)
 * Pure presentational component; receives data as props from the page.
 */
export default function PostCard({ post }: PostCardProps) {
  // Derive a faux category from the post id for visual variety
  const categories = ["Frontend", "Backend", "DevOps", "AI/ML", "Security"];
  const category = categories[post.id % categories.length];
  const readTime = Math.max(1, Math.floor(post.body.length / 200));

  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <article className="card p-5 h-full flex flex-col gap-3 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <span className="tag">{category}</span>
          <span className="mono text-xs text-slate-600">#{post.id}</span>
        </div>

        {/* Title */}
        <h2 className="text-sm font-semibold text-slate-200 capitalize leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Body excerpt */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {post.body}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-xs text-slate-600 mono">
            user_{post.userId}
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readTime} min
          </span>
        </div>
      </article>
    </Link>
  );
}
