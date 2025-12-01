"use server"

import { createClient } from "@/lib/supabase/server"
import { Post } from "@/types"

/**
 * Get all published posts, ordered by published_at DESC
 */
export interface PostWithAuthor extends Post {
  author_name?: string;
  read_time: number;
}

/**
 * Get a single published post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('blogs')
    .select('*, profiles(first_name, last_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    console.error('Error fetching post:', error)
    return null
  }

  // Calculate read time based on content
  const wordsPerMinute = 200
  const wordCount = (post.content || '').trim().split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  const authorName = post.profiles 
    ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim()
    : 'Unknown Author'

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.meta_description,
    status: post.status as "draft" | "published",
    author_id: post.author_id,
    author_name: authorName || "Anonymous",
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
    published_at: post.published_at ? new Date(post.published_at) : null,
    read_time: readTime,
  }
}

/**
 * Get all published posts, ordered by published_at DESC
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data: posts, error } = await supabase
    .from('blogs')
    .select('*, profiles(first_name, last_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.meta_description,
    status: post.status as "draft" | "published",
    author_id: post.author_id,
    author_name: post.profiles 
      ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim()
      : undefined,
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
    published_at: post.published_at ? new Date(post.published_at) : null,
  }))
}

/**
 * Get current user's posts
 */
export async function getMyPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: posts, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching my posts:', error)
    return []
  }

  return posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.meta_description,
    status: post.status as "draft" | "published",
    author_id: post.author_id,
    created_at: new Date(post.created_at),
    updated_at: new Date(post.updated_at),
    published_at: post.published_at ? new Date(post.published_at) : null,
  }))
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
