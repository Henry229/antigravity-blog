import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header variant="public" />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Post Not Found
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </main>
      <Footer />
    </div>
  )
}
