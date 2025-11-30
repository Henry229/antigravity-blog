import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-3">
        <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="public" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[720px]">
          {/* Title Skeleton */}
          <div className="mb-8 h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          {/* Post Cards Skeleton */}
          <div className="space-y-6">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
