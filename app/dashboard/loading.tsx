export default function Loading() {
  return (
    <>
      {/* Header Skeleton */}
      <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </header>

      <main className="flex-1 p-6">
        {/* Title Skeleton */}
        <div className="mb-2 h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Rows */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-200 px-6 py-4 last:border-0 dark:border-gray-700"
            >
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
