# Blog List Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/blog` |
| **파일** | `app/blog/page.tsx` |
| **HTML 소스** | blog-list.html |
| **User Flow** | Step 5 - 공개 URL 확인 (글 목록) |
| **인증 필요** | ❌ |

---

## HTML 구조 분석

```
- header (Public variant)
  - logo
  - nav: Home, Login links
- main
  - headline: "Latest Posts"
  - post-cards-container (max-w-[720px], centered)
    - post-card (반복)
      - title (link, primary color)
      - excerpt (2줄)
      - meta: date, read time
  - load-more-button
- footer
  - copyright
  - links: About, Contact, Privacy Policy
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Header | 공통 (public variant) | `components/layout/Header.tsx` |
| Footer | 공통 | `components/layout/Footer.tsx` |
| PostCard | 페이지전용 | `app/blog/PostCard.tsx` |
| Button | 공통 | `components/ui/Button.tsx` |

---

## 컴포넌트 상세

### PostCard

```typescript
// app/blog/PostCard.tsx
interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: Date;
  readTime?: number;
}

export function PostCard({ title, slug, excerpt, publishedAt, readTime }: PostCardProps) {
  return (
    <article className="rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <Link 
          href={`/blog/${slug}`}
          className="text-2xl font-bold text-primary hover:underline"
        >
          {title}
        </Link>
        <p className="text-base leading-relaxed text-gray-800 line-clamp-2">
          {excerpt}
        </p>
        <p className="text-sm text-gray-500">
          {formatDate(publishedAt)} · {readTime || 5} min read
        </p>
      </div>
    </article>
  );
}
```

**HTML 추출**:
```html
<div class="rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800/50 dark:bg-background-dark">
  <div class="flex flex-col gap-2">
    <a class="text-2xl font-bold text-primary hover:underline" href="#">The Art of Minimalist Design</a>
    <p class="text-base leading-relaxed text-[#1F2937] dark:text-gray-300">Discover how less can be more. In this post, we explore...</p>
    <p class="text-sm text-[#64748B] dark:text-gray-500">October 26, 2023 · 5 min read</p>
  </div>
</div>
```

---

## 비즈니스 로직 (PRD에서)

### Server Action 연결
```typescript
// app/blog/page.tsx
import { getPublishedPosts } from '@/actions/posts';

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  // ...
}
```

### 필요 로직
- [ ] `getPublishedPosts()` Server Action 호출
- [ ] 최신순 정렬 (published_at DESC)
- [ ] 페이지네이션 또는 Load More (선택적 - v2)
- [ ] 빈 상태 처리 (포스트가 없을 때)

---

## 구현 태스크

### Phase 1: 기본 구조
- [ ] `app/blog/page.tsx` 생성
- [ ] 공통 Header 연결 (variant='public')
- [ ] 공통 Footer 연결
- [ ] 기본 레이아웃 (max-w-[720px] centered)

### Phase 2: PostCard 컴포넌트
- [ ] `app/blog/PostCard.tsx` 구현
- [ ] Link 연결 (`/blog/[slug]`)
- [ ] 날짜 포맷팅 유틸리티
- [ ] line-clamp-2 for excerpt

### Phase 3: 데이터 연결
- [ ] `getPublishedPosts()` action 연결
- [ ] Posts 리스트 렌더링
- [ ] Loading state (Suspense)
- [ ] Empty state 처리

### Phase 4: 추가 기능 (선택적)
- [ ] Load More 버튼 구현
- [ ] 무한 스크롤 (v2)
- [ ] 검색/필터 (v2)

---

## 스타일 (HTML에서 추출)

### Layout
| 요소 | 값 |
|------|-----|
| Container | max-w-[720px] mx-auto |
| Padding | px-4 py-8 sm:px-6 lg:px-8 |
| Card Gap | gap-6 (24px) |

### PostCard
| 요소 | 값 |
|------|-----|
| Border | rounded-lg border border-gray-200/80 |
| Background | bg-white |
| Shadow | shadow-sm |
| Padding | p-6 |
| Title | text-2xl font-bold text-primary |
| Excerpt | text-base leading-relaxed text-gray-800 |
| Meta | text-sm text-[#64748B] |

### Typography
| 요소 | 스타일 |
|------|--------|
| Page Title | text-4xl font-bold tracking-tight |
| Post Title | text-2xl font-bold |
| Excerpt | text-base leading-relaxed |
| Meta | text-sm |

---

## 데이터 구조

### Post Interface (PRD에서)
```typescript
interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### PostCard에 필요한 필드
```typescript
type PostCardData = Pick<Post, 'title' | 'slug' | 'excerpt' | 'published_at'> & {
  readTime?: number;
}
```

---

## 유틸리티 함수

### formatDate
```typescript
// lib/utils.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}
```

### calculateReadTime
```typescript
// lib/utils.ts
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

---

## 파일 구조

```
app/
└── blog/
    ├── page.tsx              # Blog List Page
    ├── PostCard.tsx          # Post Card 컴포넌트
    └── loading.tsx           # Loading state (선택적)
```

---

## 의존성

- next/link (라우팅)
- 공통 컴포넌트: Header, Footer, Button
- Server Action: getPublishedPosts
- 유틸리티: formatDate, calculateReadTime
