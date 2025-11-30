import { Metadata } from "next"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PostList } from "./PostList"
import { getPublishedPosts } from "@/actions/posts"

export const metadata: Metadata = {
  title: "Latest Posts | SimpleBlog",
  description: "Read the latest blog posts on SimpleBlog",
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="public" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[720px]">
          {/* Page Title */}
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Latest Posts
          </h1>

          {/* Posts List */}
          <PostList posts={posts} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
