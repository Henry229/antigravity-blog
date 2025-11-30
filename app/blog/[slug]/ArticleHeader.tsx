import { formatDate } from "@/lib/utils"

export interface ArticleHeaderProps {
  title: string;
  publishedAt: Date | null;
  readTime: number;
}

export function ArticleHeader({ title, publishedAt, readTime }: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[36px]">
        {title}
      </h1>
      <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
        {publishedAt && (
          <>Published on {formatDate(publishedAt)} · </>
        )}
        {readTime} min read
      </p>
    </header>
  )
}
