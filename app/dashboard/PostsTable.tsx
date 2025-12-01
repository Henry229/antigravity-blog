import { Post } from "@/types"
import { PostRow } from "./PostRow"

export interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Title
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Updated
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
