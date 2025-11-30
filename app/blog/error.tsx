"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BlogError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등 사용)
    console.error("Blog page error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="public" />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Failed to load blog posts. Please try again.
          </p>
          <Button onClick={reset}>
            Try again
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
