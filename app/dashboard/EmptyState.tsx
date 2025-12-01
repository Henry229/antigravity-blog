import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface EmptyStateProps {
  filter?: "draft" | "published";
}

export function EmptyState({ filter }: EmptyStateProps) {
  const message = filter
    ? filter === "draft"
      ? "No drafts yet. Start writing!"
      : "No published posts yet. Publish your first post!"
    : "No posts yet. Create your first post!"

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
      <FileText className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        {filter ? `No ${filter} posts` : "No posts"}
      </h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {message}
      </p>
      <Button asChild>
        <Link href="/dashboard/new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Create Post</span>
        </Link>
      </Button>
    </div>
  )
}
