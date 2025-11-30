export interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

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
  // TODO: Supabase 연동 후 실제 구현
  // const supabase = createClient()
  // const { data, error } = await supabase
  //   .from('posts')
  //   .select('*, profiles(name)')
  //   .eq('slug', slug)
  //   .single()

  // Mock data for development
  const posts = await getPublishedPosts()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return null
  }

  // Calculate read time based on content
  const wordsPerMinute = 200
  const wordCount = post.content.trim().split(/\s+/).length
  const readTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))

  return {
    ...post,
    author_name: "John Doe",
    read_time: readTime,
  }
}

/**
 * Get all published posts, ordered by published_at DESC
 */
export async function getPublishedPosts(): Promise<Post[]> {
  // TODO: Supabase 연동 후 실제 구현
  // const supabase = createClient()
  // const { data, error } = await supabase
  //   .from('posts')
  //   .select('*')
  //   .eq('status', 'published')
  //   .order('published_at', { ascending: false })

  // Mock data for development
  return [
    {
      id: "1",
      user_id: "user-1",
      title: "The Art of Minimalist Design",
      slug: "art-of-minimalist-design",
      content: "Discover how less can be more. In this post, we explore the principles of minimalist design and how they can be applied to create beautiful, functional interfaces. Minimalism is not about removing elements, but about finding the right balance between form and function.",
      excerpt: "Discover how less can be more. In this post, we explore the principles of minimalist design...",
      status: "published",
      published_at: new Date("2023-10-26"),
      created_at: new Date("2023-10-25"),
      updated_at: new Date("2023-10-26"),
    },
    {
      id: "2",
      user_id: "user-1",
      title: "Building Better APIs",
      slug: "building-better-apis",
      content: "A comprehensive guide to designing and building APIs that developers love. Learn about REST principles, error handling, versioning, and documentation best practices.",
      excerpt: "A comprehensive guide to designing and building APIs that developers love...",
      status: "published",
      published_at: new Date("2023-10-20"),
      created_at: new Date("2023-10-19"),
      updated_at: new Date("2023-10-20"),
    },
    {
      id: "3",
      user_id: "user-1",
      title: "Getting Started with Next.js 15",
      slug: "getting-started-nextjs-15",
      content: "Next.js 15 brings exciting new features including improved server components, better caching, and enhanced developer experience. Let's explore what's new and how to get started.",
      excerpt: "Next.js 15 brings exciting new features including improved server components...",
      status: "published",
      published_at: new Date("2023-10-15"),
      created_at: new Date("2023-10-14"),
      updated_at: new Date("2023-10-15"),
    },
  ]
}
