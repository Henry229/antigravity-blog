export interface ArticleFooterProps {
  authorName?: string;
}

export function ArticleFooter({ authorName = "Anonymous" }: ArticleFooterProps) {
  return (
    <footer className="text-sm text-gray-500 dark:text-gray-400">
      Written by <span className="font-medium text-gray-700 dark:text-gray-300">{authorName}</span>
    </footer>
  )
}
