"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Logo } from "@/components/ui/Logo"
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
      {/* Simple client-safe header for error boundary */}
      <header className="sticky top-0 z-10 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo icon="article" size="md" />
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

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
