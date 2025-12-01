"use server"

import { revalidatePath } from "next/cache"
import { deletePost } from "@/actions/posts"

export async function handleDelete(id: string) {
  await deletePost(id)
  revalidatePath("/dashboard")
}
