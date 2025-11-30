import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date | null;
  readTime?: number;
}

export function PostCard({
  title,
  slug,
  excerpt,
  publishedAt,
  readTime = 5
}: PostCardProps) {
  return (
    <article className="rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-2">
        <Link
          href={`/blog/${slug}`}
          className="text-2xl font-bold text-primary hover:underline"
        >
          {title}
        </Link>
        <p className="text-base leading-relaxed text-gray-800 line-clamp-2 dark:text-gray-300">
          {excerpt}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(publishedAt)}{publishedAt && ' · '}{readTime} min read
        </p>
      </div>
    </article>
  )
}
