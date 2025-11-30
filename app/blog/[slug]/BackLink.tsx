import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function BackLink() {
  return (
    <Link
      href="/blog"
      className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>All posts</span>
    </Link>
  )
}
