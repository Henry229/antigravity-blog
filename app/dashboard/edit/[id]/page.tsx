import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPostById, createPost, updatePost, publishPost } from "@/actions/posts"
import { PostEditor } from "../../(editor)/PostEditor"

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Post | SimpleBlog",
  description: "Edit your blog post",
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  // Only allow editing own posts
  if (post.author_id !== user.id) {
    redirect("/dashboard")
  }

  return (
    <PostEditor
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content,
      }}
      createPostAction={createPost}
      updatePostAction={updatePost}
      publishPostAction={publishPost}
    />
  )
}
