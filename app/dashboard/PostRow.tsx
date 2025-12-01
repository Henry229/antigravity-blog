"use client"

import { useState } from "react"
import Link from "next/link"
import { PenLine, Trash2, Loader2 } from "lucide-react"
import { Post } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"
import { handleDelete } from "./actions"

export interface PostRowProps {
  post: Post;
}

export function PostRow({ post }: PostRowProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function onDelete() {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    setIsDeleting(true)
    await handleDelete(post.id)
    // revalidatePath가 자동으로 UI 업데이트
    setIsDeleting(false)
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
      {/* Title */}
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
        {post.title || "Untitled"}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant={post.status === "published" ? "success" : "default"}>
          {post.status === "published" ? "Published" : "Draft"}
        </Badge>
      </td>

      {/* Updated Date */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
        {formatDate(post.updated_at)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Edit */}
          <Link
            href={`/dashboard/edit/${post.id}`}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
          >
            <PenLine className="h-5 w-5" />
          </Link>

          {/* Delete */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
