import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getMyPosts } from "@/actions/posts"
import { DashboardHeader } from "./DashboardHeader"
import { StatsBar } from "./StatsBar"
import { PostsTable } from "./PostsTable"
import { EmptyState } from "./EmptyState"

export const metadata: Metadata = {
  title: "Dashboard | SimpleBlog",
  description: "Manage your blog posts",
}

interface PageProps {
  searchParams: Promise<{ status?: "draft" | "published" }>
}

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const { status } = searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 포스트 조회
  const posts = await getMyPosts()

  // 필터링
  const filteredPosts = status
    ? posts.filter((p) => p.status === status)
    : posts

  // 통계 계산
  const publishedCount = posts.filter((p) => p.status === "published").length
  const draftCount = posts.filter((p) => p.status === "draft").length

  // 페이지 제목
  const pageTitle = status
    ? status === "draft"
      ? "Drafts"
      : "Published"
    : "All Posts"

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader
        userEmail={user?.email || ""}
        userAvatar={user?.user_metadata?.avatar_url}
      />
      <main className="flex-1 p-6 pt-20">
        {/* Page Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {pageTitle}
        </h1>

        {/* Stats */}
        <StatsBar
          publishedCount={publishedCount}
          draftCount={draftCount}
        />

        {/* Posts Table or Empty State */}
        {filteredPosts.length > 0 ? (
          <PostsTable posts={filteredPosts} />
        ) : (
          <EmptyState filter={status} />
        )}
      </main>
    </div>
  )
}
