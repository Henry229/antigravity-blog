# Single Post Page 구현 계획

## 개요

SimpleBlog 애플리케이션의 개별 블로그 포스트 페이지 상세 구현 계획.

- **User Flow**: Step 5 - /blog/[slug]로 접근
- **라우트**: `/blog/[slug]`
- **인증 필요**: ❌
- **주요 기능**: Markdown 렌더링, SEO 메타데이터, 읽기 시간 표시

---

## 페이지 구조 (plan-based-page에서)

```
- Header (공통, variant='public')
- Main (max-w-[680px], centered)
  - BackLink ("← All posts")
  - Article
    - ArticleHeader (title, meta)
    - MarkdownContent (Markdown → HTML)
    - Divider (hr)
    - ArticleFooter ("Written by [Author]")
- Footer (공통)
```

---

## 의존성

### 신규 설치 필요

```bash
# Markdown 렌더링
npm install react-markdown

# Tailwind Typography Plugin (선택적 - prose 스타일용)
npm install -D @tailwindcss/typography
```

### 이미 설치됨 (shared-components-impl.md에서)

```bash
npm install lucide-react clsx tailwind-merge
```

### 공통 컴포넌트 Import 경로

| 컴포넌트 | Import Path |
|---------|-------------|
| Header | `@/components/layout/Header` |
| Footer | `@/components/layout/Footer` |

### 필요한 Server Actions

| Action | 파일 | 설명 |
|--------|------|------|
| `getPostBySlug` | `@/actions/posts` | slug로 포스트 조회 |

### 유틸리티 함수

| 함수 | 파일 | 설명 |
|------|------|------|
| `formatDate` | `@/lib/utils` | 날짜 포맷팅 |
| `calculateReadTime` | `@/lib/utils` | 읽기 시간 계산 |

---

## Task List

### 0. 페이지 라우트 및 폴더 생성

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/page.tsx`

**요구사항:**
- [ ] `app/blog/[slug]/` 폴더 생성 (Dynamic Route)
- [ ] `page.tsx` 생성
- [ ] Server Component로 구현
- [ ] `generateMetadata` 함수 구현 (SEO)

**기본 구조:**

```typescript
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
```

**완료 조건:**
- [ ] 페이지 정상 렌더링
- [ ] Dynamic Route 동작 확인
- [ ] 404 처리 동작 확인

---

### 1. BackLink 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/BackLink.tsx`

**요구사항:**
- [ ] "← All posts" 텍스트
- [ ] `/blog` 페이지로 링크
- [ ] hover 시 underline

**Props Interface:**

```typescript
// Props 없음 (static content)
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | mb-8 inline-flex items-center gap-2 |
| Color | text-primary |
| Hover | hover:underline |

**기본 구조:**

```typescript
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function BackLink() {
  return (
    <Link
      href="/blog"
      className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>All posts</span>
    </Link>
  )
}
```

**완료 조건:**
- [ ] 링크 정상 동작
- [ ] 아이콘 표시
- [ ] hover 효과

---

### 2. ArticleHeader 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/ArticleHeader.tsx`

**요구사항:**
- [ ] 포스트 제목 (h1)
- [ ] 발행일 표시
- [ ] 읽기 시간 표시
- [ ] 반응형 폰트 크기

**Props Interface:**

```typescript
export interface ArticleHeaderProps {
  title: string;
  publishedAt: Date | null;
  readTime: number;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | mb-8 |
| Title | text-4xl sm:text-[36px] font-bold tracking-tight text-gray-900 dark:text-white |
| Meta | mt-3 text-base text-gray-500 dark:text-gray-400 |

**기본 구조:**

```typescript
import { formatDate } from "@/lib/utils"

export interface ArticleHeaderProps {
  title: string;
  publishedAt: Date | null;
  readTime: number;
}

export function ArticleHeader({ title, publishedAt, readTime }: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[36px]">
        {title}
      </h1>
      <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
        {publishedAt && (
          <>Published on {formatDate(publishedAt)} · </>
        )}
        {readTime} min read
      </p>
    </header>
  )
}
```

**완료 조건:**
- [ ] 제목 정상 표시
- [ ] 날짜 포맷 정상
- [ ] 읽기 시간 표시
- [ ] 반응형 폰트 크기

---

### 3. MarkdownContent 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/MarkdownContent.tsx`

**요구사항:**
- [ ] Markdown → HTML 렌더링
- [ ] Prose 스타일 적용
- [ ] 코드 블록 스타일
- [ ] 다크모드 지원

**Props Interface:**

```typescript
export interface MarkdownContentProps {
  content: string;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | prose prose-lg dark:prose-invert max-w-none |
| Body Text | leading-[1.7] |
| H2 | text-2xl font-bold mt-12 mb-4 |
| Links | text-primary |
| Inline Code | bg-gray-100 px-1.5 py-0.5 rounded text-sm |
| Code Block | bg-[#F8FAFC] p-4 rounded-lg |

**기본 구조:**

```typescript
import ReactMarkdown from "react-markdown"

export interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg max-w-none leading-relaxed dark:prose-invert">
      <ReactMarkdown
        components={{
          // 커스텀 컴포넌트 (선택적)
          h2: ({ children }) => (
            <h2 className="mt-12 mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
              {children}
            </h3>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className
            return isInline ? (
              <code
                className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg bg-[#F8FAFC] p-4 dark:bg-gray-800">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 dark:border-gray-700 dark:text-gray-400">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 list-disc pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 list-decimal pl-6">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="mb-2">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

**완료 조건:**
- [ ] Markdown 정상 렌더링
- [ ] 제목 스타일 적용 (h2, h3)
- [ ] 링크 스타일 적용
- [ ] 코드 블록 스타일 적용
- [ ] 리스트 스타일 적용
- [ ] 인용구 스타일 적용
- [ ] 다크모드 지원

---

### 4. ArticleFooter 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/ArticleFooter.tsx`

**요구사항:**
- [ ] 작성자 이름 표시
- [ ] "Written by [Author]" 형식

**Props Interface:**

```typescript
export interface ArticleFooterProps {
  authorName?: string;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | text-sm text-gray-500 dark:text-gray-400 |

**기본 구조:**

```typescript
export interface ArticleFooterProps {
  authorName?: string;
}

export function ArticleFooter({ authorName = "Anonymous" }: ArticleFooterProps) {
  return (
    <footer className="text-sm text-gray-500 dark:text-gray-400">
      Written by <span className="font-medium text-gray-700 dark:text-gray-300">{authorName}</span>
    </footer>
  )
}
```

**완료 조건:**
- [ ] 작성자 이름 정상 표시
- [ ] 기본값 "Anonymous" 처리
- [ ] 다크모드 지원

---

### 5. Loading State

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/loading.tsx`

**요구사항:**
- [ ] 스켈레톤 UI
- [ ] 포스트 로딩 중 표시

**기본 구조:**

```typescript
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header variant="public" />
      <main className="flex-1 px-4 py-8 sm:py-16 lg:py-20">
        <article className="mx-auto max-w-[680px]">
          {/* Back Link Skeleton */}
          <div className="mb-8 h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

          {/* Title Skeleton */}
          <div className="mb-8">
            <div className="mb-3 h-10 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
```

**완료 조건:**
- [ ] 스켈레톤 애니메이션 동작
- [ ] 레이아웃 일관성

---

### 6. Not Found Page

**상태:** - [ ] 미완료
**파일:** `app/blog/[slug]/not-found.tsx`

**요구사항:**
- [ ] 404 메시지
- [ ] 블로그 목록으로 돌아가기 링크

**기본 구조:**

```typescript
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Header variant="public" />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Post Not Found
        </h1>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </main>
      <Footer />
    </div>
  )
}
```

**완료 조건:**
- [ ] 404 메시지 표시
- [ ] 링크 정상 동작

---

### 7. 유틸리티 함수 추가

**상태:** - [ ] 미완료
**파일:** `lib/utils.ts`

**요구사항:**
- [ ] `formatDate` 함수 추가
- [ ] `calculateReadTime` 함수 추가

**기본 구조:**

```typescript
// lib/utils.ts에 추가

/**
 * 날짜를 "Month DD, YYYY" 형식으로 포맷
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * 텍스트 길이를 기반으로 읽기 시간 계산 (분)
 * 평균 읽기 속도: 200 words/min
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readTime) // 최소 1분
}
```

**완료 조건:**
- [ ] `formatDate` 정상 동작
- [ ] `calculateReadTime` 정상 동작

---

## 구현 순서

1. **유틸리티 함수 추가** - `formatDate`, `calculateReadTime` (lib/utils.ts)
2. **의존성 설치** - `react-markdown`
3. **BackLink 컴포넌트** - 간단한 링크 컴포넌트
4. **ArticleHeader 컴포넌트** - 제목, 메타 정보
5. **ArticleFooter 컴포넌트** - 작성자 정보
6. **MarkdownContent 컴포넌트** - Markdown 렌더링 (핵심)
7. **Loading State** - 스켈레톤 UI
8. **Not Found Page** - 404 처리
9. **페이지 조립** - `app/blog/[slug]/page.tsx`
10. **SEO 메타데이터** - `generateMetadata` 구현

---

## 검증 체크리스트

### BackLink
- [ ] `/blog` 페이지로 이동
- [ ] 아이콘 정상 표시
- [ ] hover 효과 동작

### ArticleHeader
- [ ] 제목 정상 표시
- [ ] 반응형 폰트 크기 (text-4xl → text-[36px])
- [ ] 발행일 포맷 정상
- [ ] 읽기 시간 표시

### MarkdownContent
- [ ] Markdown 정상 렌더링
- [ ] 제목 (h2, h3) 스타일 적용
- [ ] 링크 스타일 적용
- [ ] 코드 블록 스타일 적용
- [ ] 인라인 코드 스타일 적용
- [ ] 리스트 스타일 적용
- [ ] 인용구 스타일 적용
- [ ] 다크모드 지원

### ArticleFooter
- [ ] 작성자 이름 표시
- [ ] 기본값 처리

### Single Post Page
- [ ] Dynamic Route 동작 (`/blog/[slug]`)
- [ ] 포스트 데이터 정상 로드
- [ ] 404 처리 (없는 포스트)
- [ ] 404 처리 (비공개 포스트)
- [ ] Loading 상태 표시
- [ ] SEO 메타데이터 적용

### SEO
- [ ] `<title>` 태그 동적 생성
- [ ] `<meta description>` 동적 생성
- [ ] Open Graph 태그 생성
- [ ] Twitter Card 태그 생성

---

## 파일 구조 요약

```
app/
└── blog/
    └── [slug]/
        ├── page.tsx              # Single Post Page
        ├── BackLink.tsx          # 뒤로가기 링크
        ├── ArticleHeader.tsx     # 제목, 메타 정보
        ├── MarkdownContent.tsx   # Markdown 렌더링
        ├── ArticleFooter.tsx     # 작성자 정보
        ├── loading.tsx           # Loading State
        └── not-found.tsx         # 404 Page

lib/
└── utils.ts                      # formatDate, calculateReadTime 추가
```

---

## 스타일 요약

### Layout

| 요소 | 값 |
|------|-----|
| Container Max Width | max-w-[680px] |
| Container Padding | px-4 |
| Section Padding | py-8 sm:py-16 lg:py-20 |

### Typography

| 요소 | 스타일 |
|------|--------|
| Title | text-4xl sm:text-[36px] font-bold tracking-tight |
| Meta | text-base text-gray-500 |
| Body | text-lg leading-[1.7] |
| H2 | text-2xl font-bold mt-12 mb-4 |
| H3 | text-xl font-semibold mt-8 mb-3 |
| Inline Code | bg-gray-100 px-1.5 py-0.5 rounded text-sm |
| Code Block | bg-[#F8FAFC] p-4 rounded-lg |

### Colors

| 요소 | 색상 |
|------|------|
| Title | text-gray-900 / white |
| Meta | text-gray-500 / gray-400 |
| Body | text-gray-800 / gray-200 |
| Link | text-primary (#2563EB) |
| Code bg | bg-[#F8FAFC] / gray-800 |
| Blockquote border | border-gray-200 / gray-700 |

---

## Tailwind Typography Plugin 설정 (선택적)

만약 `@tailwindcss/typography` 플러그인을 사용한다면:

**설치:**

```bash
npm install -D @tailwindcss/typography
```

**tailwind.config.ts:**

```typescript
import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
  // ...
  plugins: [typography],
}

export default config
```

**globals.css (커스텀 prose 스타일):**

```css
@layer components {
  .prose {
    --tw-prose-body: #1F2937;
    --tw-prose-headings: #111827;
    --tw-prose-links: #2563EB;
    --tw-prose-code: #1F2937;
    --tw-prose-pre-bg: #F8FAFC;
  }

  .dark .prose {
    --tw-prose-body: #E5E7EB;
    --tw-prose-headings: #F9FAFB;
    --tw-prose-links: #60A5FA;
    --tw-prose-code: #E5E7EB;
    --tw-prose-pre-bg: #1F2937;
  }
}
```

---

## 공통 컴포넌트 의존성

이 페이지는 다음 공통 컴포넌트가 먼저 구현되어야 합니다:

1. **Header** (`components/layout/Header.tsx`) - `variant="public"` 필요
2. **Footer** (`components/layout/Footer.tsx`)
3. **Button** (`components/ui/Button.tsx`) - Not Found 페이지에서 사용

→ `shared-components-impl.md` 참조

---

## Server Action 의존성

이 페이지는 다음 Server Action이 필요합니다:

```typescript
// actions/posts.ts
export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Supabase에서 slug로 포스트 조회
  // status가 'published'인 것만 반환
}
```

→ Server Actions 구현 후 연결

---

## 추가 개선 사항 (선택)

### Phase 2: Syntax Highlighting

- [ ] `rehype-highlight` 또는 `prism-react-renderer` 설치
- [ ] 코드 블록 언어별 하이라이팅

### Phase 3: Table of Contents

- [ ] 헤딩 기반 TOC 생성
- [ ] Sticky TOC (사이드바)

### Phase 4: 관련 포스트

- [ ] 같은 카테고리/태그 포스트 추천
- [ ] "You might also like" 섹션
