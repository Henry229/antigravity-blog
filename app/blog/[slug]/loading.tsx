import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header variant="public" />
      <main className="flex-1 px-4 py-8 sm:py-16 lg:py-20">
        <article className="mx-auto max-w-[680px]">
          {/* Back Link Skeleton */}
          <div className="mb-8 h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          {/* Title Skeleton */}
          <div className="mb-8">
            <div className="mb-3 h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
