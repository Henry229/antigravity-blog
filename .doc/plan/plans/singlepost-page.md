# Single Post Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/blog/[slug]` |
| **파일** | `app/blog/[slug]/page.tsx` |
| **HTML 소스** | single-post.html |
| **User Flow** | Step 5 - /blog/[slug]로 접근 가능 |
| **인증 필요** | ❌ |

---

## HTML 구조 분석

```
- header (Public variant)
  - logo
- main (max-w-[680px], centered)
  - back-link: "← All posts"
  - article
    - header
      - title (36px heading)
      - meta: published date, reading time
    - body (Markdown rendered)
      - paragraphs
      - headings (h2, h3)
      - lists (ul, ol)
      - code blocks
      - blockquotes
      - images
    - divider (hr)
    - footer: "Written by [Author]"
- footer (공통)
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Header | 공통 (public variant) | `components/layout/Header.tsx` |
| Footer | 공통 | `components/layout/Footer.tsx` |
| BackLink | 페이지전용 | `app/blog/[slug]/BackLink.tsx` |
| ArticleHeader | 페이지전용 | `app/blog/[slug]/ArticleHeader.tsx` |
| MarkdownContent | 페이지전용 | `app/blog/[slug]/MarkdownContent.tsx` |
| ArticleFooter | 페이지전용 | `app/blog/[slug]/ArticleFooter.tsx` |

---

## 컴포넌트 상세

### BackLink

```typescript
// app/blog/[slug]/BackLink.tsx
import Link from 'next/link';

export function BackLink() {
  return (
    <Link 
      href="/blog"
      className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
    >
      <span aria-hidden="true">←</span>
      All posts
    </Link>
  );
}
```

### ArticleHeader

```typescript
// app/blog/[slug]/ArticleHeader.tsx
interface ArticleHeaderProps {
  title: string;
  publishedAt: Date;
  readTime: number;
}

export function ArticleHeader({ title, publishedAt, readTime }: ArticleHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 sm:text-[36px]">
        {title}
      </h1>
      <p className="mt-3 text-base text-gray-500">
        Published on {formatDate(publishedAt)} · {readTime} min read
      </p>
    </header>
  );
}
```

### MarkdownContent

```typescript
// app/blog/[slug]/MarkdownContent.tsx
import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
```

**HTML 추출 (Prose Styles)**:
```html
<div class="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
  <!-- Markdown rendered content -->
</div>
```

**Prose CSS from HTML**:
```css
.prose { line-height: 1.7; }
.prose h2 { font-family: 'Newsreader', serif; font-size: 1.5rem; font-weight: bold; margin-top: 3rem; margin-bottom: 1rem; }
.prose p { margin-bottom: 1rem; }
.prose a { color: #2563EB; }
.prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.prose li { margin-bottom: 0.5rem; }
.prose pre { background-color: #F8FAFC; border-radius: 0.5rem; padding: 1rem; margin: 1.5rem 0; overflow-x: auto; }
.prose code { font-family: monospace; }
.prose code:not(pre > code) { background-color: #F3F4F6; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.875rem; }
```

---

## 비즈니스 로직 (PRD에서)

### Server Action 연결
```typescript
// app/blog/[slug]/page.tsx
import { getPostBySlug } from '@/actions/posts';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  
  if (!post || post.status !== 'published') {
    notFound();
  }
  
  return (
    // ...
  );
}
```

### 필요 로직
- [ ] `getPostBySlug(slug)` Server Action 호출
- [ ] 포스트가 없으면 404 처리
- [ ] published 상태가 아니면 404 처리
- [ ] Markdown → HTML 렌더링
- [ ] 읽기 시간 계산

### Metadata 생성 (SEO)
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.published_at?.toISOString(),
    },
  };
}
```

---

## 구현 태스크

### Phase 1: 기본 구조
- [ ] `app/blog/[slug]/page.tsx` 생성
- [ ] 공통 Header 연결
- [ ] 공통 Footer 연결
- [ ] 기본 레이아웃 (max-w-[680px] centered)

### Phase 2: Article 컴포넌트
- [ ] BackLink 구현
- [ ] ArticleHeader 구현
- [ ] MarkdownContent 구현 (react-markdown)
- [ ] ArticleFooter 구현

### Phase 3: 데이터 연결
- [ ] `getPostBySlug()` action 연결
- [ ] 404 처리 (notFound)
- [ ] Loading state

### Phase 4: 스타일링
- [ ] Prose 스타일 설정 (typography plugin 또는 커스텀)
- [ ] Code block 스타일 (syntax highlighting - 선택적)
- [ ] 반응형 테스트

### Phase 5: SEO
- [ ] generateMetadata 구현
- [ ] Open Graph 태그
- [ ] Twitter Card

---

## 스타일 (HTML에서 추출)

### Layout
| 요소 | 값 |
|------|-----|
| Container | max-w-[680px] mx-auto |
| Padding | px-4 py-8 sm:py-16 lg:py-20 |

### Typography
| 요소 | 스타일 |
|------|--------|
| Title | text-4xl sm:text-[36px] font-bold tracking-tight font-display |
| Meta | text-base text-gray-500 |
| Body | text-lg leading-[1.7] |
| H2 | text-2xl font-bold font-display mt-12 mb-4 |
| Code (inline) | bg-gray-100 px-1.5 py-0.5 rounded text-sm |
| Code (block) | bg-[#F8FAFC] p-4 rounded-lg font-mono |

### Colors
| 요소 | 색상 |
|------|------|
| Title | text-gray-900 |
| Meta | text-[#64748B] |
| Body | text-gray-800 |
| Link | text-primary (#2563EB) |
| Code bg | bg-[#F8FAFC] |
| Blockquote border | border-gray-200 |

### Prose Custom Styles
```css
/* 필요시 globals.css에 추가 */
.prose {
  --tw-prose-body: #1F2937;
  --tw-prose-headings: #111827;
  --tw-prose-links: #2563EB;
  --tw-prose-code: #1F2937;
  --tw-prose-pre-bg: #F8FAFC;
}
```

---

## 파일 구조

```
app/
└── blog/
    └── [slug]/
        ├── page.tsx              # Single Post Page
        ├── BackLink.tsx          # 뒤로가기 링크
        ├── ArticleHeader.tsx     # 제목, 메타 정보
        ├── MarkdownContent.tsx   # Markdown 렌더링
        ├── ArticleFooter.tsx     # 작성자 정보
        ├── loading.tsx           # Loading state
        └── not-found.tsx         # 404 페이지
```

---

## 의존성

- `react-markdown` - Markdown 렌더링
- `@tailwindcss/typography` - Prose 스타일 (선택적)
- next/link - 라우팅
- next/navigation - notFound
- 공통 컴포넌트: Header, Footer
- Server Action: getPostBySlug
- 유틸리티: formatDate, calculateReadTime
