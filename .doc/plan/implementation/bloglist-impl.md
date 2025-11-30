# Blog List Page 구현 계획

## 개요

SimpleBlog의 공개 블로그 글 목록 페이지 구현

- **User Flow Step**: 5 - 공개 URL 확인 (글 목록)
- **주요 기능**: 발행된 포스트 목록 표시, 개별 포스트 링크
- **인증 필요**: ❌ (Public 페이지)

---

## 페이지 구조 (plan-based-page에서)

```
- Header (공통, variant='public')
  - Logo (article 아이콘)
  - Nav: Home, Login links
- Main
  - Headline: "Latest Posts"
  - PostCards Container (max-w-[720px], centered)
    - PostCard (반복)
      - Title (링크, primary color)
      - Excerpt (2줄 제한)
      - Meta: date, read time
  - LoadMore Button (선택적)
- Footer (공통)
  - Copyright
  - Links: About, Contact, Privacy Policy
```

---

## 공통 컴포넌트 Import 경로

> 참조: `.doc/plan/implementation/shared-components-impl.md`

| 컴포넌트 | Import 경로 | Props |
|----------|-------------|-------|
| Header | `@/components/layout/Header` | `variant?: 'public' \| 'landing'` |
| Footer | `@/components/layout/Footer` | - |
| Button | `@/components/ui/Button` | `variant`, `size`, `loading`, `asChild` |
| Card | `@/components/ui/Card` | `hoverable?: boolean` |

---

## 의존성

이미 설치됨 (공통 컴포넌트에서):
- lucide-react
- clsx, tailwind-merge

추가 필요:
- 없음 (Server Action은 별도 구현)

---

## Task List

### 0. 페이지 라우트 생성

**상태:** - [ ] 미완료
**파일:** `app/blog/page.tsx`

**요구사항:**
- [ ] `app/blog/page.tsx` 생성
- [ ] metadata 설정 (title, description)
- [ ] Server Component로 구현 (데이터 fetching)

**기본 구조:**

```typescript
import { Metadata } from "next"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PostCard } from "./PostCard"
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
      <main className="flex-1">
        {/* Content */}
      </main>
      <Footer />
    </div>
  )
}
```

**완료 조건:**
- [ ] 페이지 접근 가능 (`/blog`)
- [ ] 메타데이터 설정 완료
- [ ] min-h-screen 레이아웃

---

### 1. PostCard 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/blog/PostCard.tsx`

**요구사항:**
- [ ] 제목 (primary 색상, hover 시 underline)
- [ ] 발췌문 (2줄 제한 - line-clamp-2)
- [ ] 메타 정보 (날짜, 읽기 시간)
- [ ] 클릭 시 상세 페이지 이동 (`/blog/[slug]`)
- [ ] 다크모드 지원

**Props Interface:**

```typescript
interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  readTime?: number;
}
```

**스타일 (HTML에서 추출):**

| 요소 | 값 |
|------|-----|
| Border | rounded-lg border border-gray-200/80 |
| Background | bg-white dark:bg-gray-800 |
| Shadow | shadow-sm |
| Padding | p-6 |
| Title | text-2xl font-bold text-primary hover:underline |
| Excerpt | text-base leading-relaxed text-gray-800 line-clamp-2 |
| Meta | text-sm text-gray-500 |

**기본 구조:**

```typescript
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  readTime?: number;
}

export function PostCard({
  title,
  slug,
  excerpt,
  publishedAt,
  readTime = 5
}: PostCardProps) {
  return (
    <article className="rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-2">
        <Link
          href={`/blog/${slug}`}
          className="text-2xl font-bold text-primary hover:underline"
        >
          {title}
        </Link>
        <p className="text-base leading-relaxed text-gray-800 line-clamp-2 dark:text-gray-300">
          {excerpt}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(publishedAt)} · {readTime} min read
        </p>
      </div>
    </article>
  )
}
```

**완료 조건:**
- [ ] 제목 클릭 시 상세 페이지 이동
- [ ] 발췌문 2줄 제한 동작
- [ ] 날짜 포맷 정상 표시
- [ ] 다크모드 스타일 적용

---

### 2. PostList 컴포넌트 (컨테이너)

**상태:** - [ ] 미완료
**파일:** `app/blog/PostList.tsx`

**요구사항:**
- [ ] PostCard 목록 렌더링
- [ ] 빈 상태 처리 (포스트 없을 때)
- [ ] 세로 간격 (gap-6)

**Props Interface:**

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: Date;
  content: string;
}

interface PostListProps {
  posts: Post[];
}
```

**기본 구조:**

```typescript
import { PostCard } from "./PostCard"
import { calculateReadTime } from "@/lib/utils"

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: Date;
  content: string;
}

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
          excerpt={post.excerpt || post.content.slice(0, 150) + "..."}
          publishedAt={post.published_at}
          readTime={calculateReadTime(post.content)}
        />
      ))}
    </div>
  )
}
```

**완료 조건:**
- [ ] 포스트 목록 정상 렌더링
- [ ] 빈 상태 메시지 표시
- [ ] 간격 정상 적용

---

### 3. Blog Page 조립

**상태:** - [ ] 미완료
**파일:** `app/blog/page.tsx`

**요구사항:**
- [ ] Header (variant='public') 배치
- [ ] 페이지 제목 "Latest Posts"
- [ ] PostList 배치 (max-w-[720px] centered)
- [ ] Footer 배치

**스타일:**

| 요소 | 값 |
|------|-----|
| Container | max-w-[720px] mx-auto |
| Padding | px-4 py-8 sm:px-6 lg:px-8 |
| Title | text-4xl font-bold tracking-tight |

**기본 구조:**

```typescript
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
```

**완료 조건:**
- [ ] Header/Footer 정상 표시
- [ ] 페이지 제목 스타일 일치
- [ ] 포스트 목록 중앙 정렬
- [ ] 반응형 패딩 동작

---

### 4. Loading State (선택적)

**상태:** - [ ] 미완료
**파일:** `app/blog/loading.tsx`

**요구사항:**
- [ ] 스켈레톤 UI 표시
- [ ] 레이아웃 유지 (Header, Footer)

**기본 구조:**

```typescript
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="space-y-3">
        <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

export default function BlogLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="public" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[720px]">
          {/* Title Skeleton */}
          <div className="mb-8 h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          {/* Post Cards Skeleton */}
          <div className="space-y-6">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
```

**완료 조건:**
- [ ] 로딩 중 스켈레톤 표시
- [ ] 레이아웃 shift 없음

---

### 5. 유틸리티 함수 추가

**상태:** - [ ] 미완료
**파일:** `lib/utils.ts`

**요구사항:**
- [ ] formatDate 함수
- [ ] calculateReadTime 함수

**기본 구조:**

```typescript
// lib/utils.ts에 추가

/**
 * Format a date to a readable string
 * @example formatDate(new Date()) // "November 30, 2025"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

/**
 * Calculate estimated read time based on content length
 * @param content - The content to calculate read time for
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated minutes to read
 */
export function calculateReadTime(content: string, wordsPerMinute = 200): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
```

**완료 조건:**
- [ ] formatDate: "October 26, 2023" 형식
- [ ] calculateReadTime: 최소 1분 반환

---

### 6. Server Action 연결 (Stub)

**상태:** - [ ] 미완료
**파일:** `actions/posts.ts`

**요구사항:**
- [ ] getPublishedPosts() 함수 생성
- [ ] 타입 정의
- [ ] Supabase 연동 (추후)

**기본 구조 (Stub):**

```typescript
// actions/posts.ts
"use server"

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
```

**완료 조건:**
- [ ] Mock 데이터로 개발 테스트 가능
- [ ] Post 타입 정의 완료
- [ ] Supabase 연동 준비 (주석)

---

## 구현 순서

1. `lib/utils.ts`에 유틸리티 함수 추가 (formatDate, calculateReadTime)
2. `actions/posts.ts` Server Action stub 생성
3. `app/blog/PostCard.tsx` 컴포넌트 구현
4. `app/blog/PostList.tsx` 컨테이너 구현
5. `app/blog/page.tsx` 페이지 조립
6. `app/blog/loading.tsx` 로딩 상태 구현 (선택)
7. 반응형 및 다크모드 테스트

---

## 파일 구조

```
app/
└── blog/
    ├── page.tsx              # Blog List Page (Server Component)
    ├── PostCard.tsx          # Post Card 컴포넌트
    ├── PostList.tsx          # Post List 컨테이너
    └── loading.tsx           # Loading state (Suspense)

actions/
└── posts.ts                  # Server Actions for posts

lib/
└── utils.ts                  # formatDate, calculateReadTime 추가
```

---

## 검증 체크리스트

### PostCard
- [ ] 제목 클릭 → `/blog/[slug]` 이동
- [ ] 발췌문 2줄 제한 (line-clamp-2)
- [ ] 날짜 포맷: "October 26, 2023"
- [ ] 읽기 시간 표시: "5 min read"
- [ ] 다크모드 스타일

### PostList
- [ ] 포스트 목록 렌더링
- [ ] 빈 상태 메시지 표시
- [ ] 간격 (gap-6) 정상

### Blog Page
- [ ] Header (public variant) 표시
- [ ] 페이지 제목 "Latest Posts"
- [ ] 컨텐츠 max-w-[720px] 중앙 정렬
- [ ] Footer 표시
- [ ] 반응형 패딩

### Loading State
- [ ] 스켈레톤 UI 표시
- [ ] 레이아웃 shift 없음

### 공통
- [ ] 다크모드 전체 지원
- [ ] 반응형 (mobile/tablet/desktop)
- [ ] TypeScript 타입 에러 없음

---

## 데이터 흐름

```
[Supabase] → getPublishedPosts() → BlogPage → PostList → PostCard[]
                    ↑
              Server Action
              (status='published')
              (order by published_at DESC)
```

---

## 다음 단계

1. **Supabase 연동**: `getPublishedPosts()` 실제 구현
2. **페이지네이션**: Load More 버튼 또는 무한 스크롤
3. **Single Post Page**: `/blog/[slug]` 구현
4. **SEO 최적화**: Open Graph, structured data
