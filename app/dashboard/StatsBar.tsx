export interface StatsBarProps {
  publishedCount: number;
  draftCount: number;
}

export function StatsBar({ publishedCount, draftCount }: StatsBarProps) {
  return (
    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-medium text-green-600 dark:text-green-400">
        {publishedCount} Published
      </span>
      {", "}
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {draftCount} Drafts
      </span>
    </p>
  )
}
