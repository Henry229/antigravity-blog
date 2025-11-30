import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BackLink } from "./BackLink"
import { ArticleHeader } from "./ArticleHeader"
import { MarkdownContent } from "./MarkdownContent"
import { ArticleFooter } from "./ArticleFooter"
import { getPostBySlug } from "@/actions/posts"

interface PageProps {
  params: Promise<{ slug: string }>
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: `${post.title} | SimpleBlog`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      type: "article",
      publishedTime: post.published_at?.toISOString(),
      authors: [post.author_name || "Anonymous"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
    },
  }
}

export default async function SinglePostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  // 포스트가 없거나 published 상태가 아니면 404
  if (!post || post.status !== "published") {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header variant="public" />
      <main className="flex-1 px-4 py-8 sm:py-16 lg:py-20">
        <article className="mx-auto max-w-[680px]">
          <BackLink />
          <ArticleHeader
            title={post.title}
            publishedAt={post.published_at}
            readTime={post.read_time}
          />
          <MarkdownContent content={post.content} />
          <hr className="my-8 border-gray-200 dark:border-gray-700" />
          <ArticleFooter authorName={post.author_name} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
