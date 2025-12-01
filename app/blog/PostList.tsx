import { PostCard } from "./PostCard"
import { calculateReadTime } from "@/lib/utils"
import type { Post } from "@/types"

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No posts yet. Check back soon!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt || (post.content.length > 150 ? post.content.slice(0, 150) + "..." : post.content)}
          publishedAt={post.published_at}
          readTime={calculateReadTime(post.content)}
        />
      ))}
    </div>
  )
}
