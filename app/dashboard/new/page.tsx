import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PostEditor } from "../(editor)/PostEditor"
import { createPost, updatePost, publishPost } from "@/actions/posts"

export const metadata: Metadata = {
  title: "New Post | SimpleBlog",
  description: "Create a new blog post",
}

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <PostEditor
      mode="create"
      createPostAction={createPost}
      updatePostAction={updatePost}
      publishPostAction={publishPost}
    />
  )
}
