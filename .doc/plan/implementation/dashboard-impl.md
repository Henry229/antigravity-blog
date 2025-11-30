# Dashboard Page 구현 계획

## 개요

SimpleBlog 애플리케이션의 대시보드 페이지 상세 구현 계획.

- **User Flow**: Step 2 - 대시보드 진입, 글 목록 확인
- **라우트**: `/dashboard`
- **인증 필요**: ✅ (미인증 시 `/login`으로 리다이렉트)
- **주요 기능**: 내 포스트 목록, 필터링 (All/Drafts/Published), 삭제 기능

---

## 페이지 구조 (plan-based-page에서)

```
- Body (flex)
  - Sidebar (w-64, fixed left)
    - Logo Section (h-16, border-b)
    - Navigation
      - All Posts (active 상태 관리)
      - Drafts
      - Published
  - Main Container (flex-1)
    - DashboardHeader (h-16, border-b)
      - "New Post" 버튼
      - User Avatar
    - Main Content (p-6)
      - Page Title ("All Posts" / "Drafts" / "Published")
      - StatsBar ("3 Published, 1 Drafts")
      - PostsTable
        - Header: Title, Status, Updated, Actions
        - PostRow (반복)
          - Title
          - Status Badge
          - Updated Date
          - Edit/Delete 버튼
```

---

## 의존성

### 이미 설치됨 (shared-components-impl.md에서)

```bash
npm install lucide-react clsx tailwind-merge
```

### 공통 컴포넌트 Import 경로

| 컴포넌트 | Import Path |
|---------|-------------|
| Sidebar | `@/components/layout/Sidebar` |
| Logo | `@/components/ui/Logo` |
| Button | `@/components/ui/Button` |
| Badge | `@/components/ui/Badge` |

### 필요한 Server Actions

| Action | 파일 | 설명 |
|--------|------|------|
| `getMyPosts` | `@/actions/posts` | 내 포스트 목록 조회 |
| `deletePost` | `@/actions/posts` | 포스트 삭제 |

### 아이콘 (Lucide React)

| 기능 | Lucide Icon |
|------|-------------|
| All Posts | `Folder` |
| Drafts | `FileEdit` |
| Published | `Send` |
| New Post | `Plus` |
| Edit | `PenLine` |
| Delete | `Trash2` |

---

## 설계 결정

### Sidebar 위치 결정

> **설계 결정**: 원본 계획(dashboard-page.md)에서는 Sidebar를 `fixed left` 포지션으로 명시했습니다. 이 구현 계획도 동일하게 `fixed` 포지션을 유지합니다.
>
> **구현 방식**:
> - Sidebar: `fixed left-0 top-0 h-screen w-64` (고정 위치, 전체 높이)
> - Main: `ml-64` (Sidebar 너비만큼 왼쪽 마진)
> - 모바일: Sidebar `hidden md:fixed`, Main `md:ml-64`

### 아이콘 라이브러리 변경

> **설계 결정**: 원본 계획(dashboard-page.md)은 Material Symbols(`add`, `edit`, `delete`, `folder`, `draft`, `publish`)를 사용하도록 정의했으나, 프로젝트 전체에서 **Lucide React**를 표준 아이콘 라이브러리로 채택했습니다.
>
> | Material Symbol | Lucide Icon | 용도 |
> |-----------------|-------------|------|
> | `add` | `Plus` | New Post 버튼 |
> | `edit` | `PenLine` | Edit 버튼 |
> | `delete` | `Trash2` | Delete 버튼 |
> | `folder` | `Folder` | All Posts 메뉴 |
> | `draft` | `FileEdit` | Drafts 메뉴 |
> | `publish` | `Send` | Published 메뉴 |

### PostRow 삭제 흐름 변경

> **설계 결정**: 원본 계획은 `onDelete` prop을 PostsTable → PostRow로 전달하는 방식을 제안했으나, 이 구현 계획은 PostRow 내부에서 Server Action을 직접 호출합니다.
>
> **이유**:
> 1. Next.js App Router에서 Server Action은 컴포넌트 내부에서 직접 호출하는 것이 권장 패턴
> 2. `revalidatePath`가 자동으로 부모 컴포넌트 갱신 처리
> 3. Prop drilling 감소로 코드 단순화
>
> **대안 (원본 계획 방식)**: 만약 부모 컴포넌트에서 삭제 로직을 제어하려면, PostRow에 `onDelete` prop을 유지하고 PostsTable에서 전달할 수 있습니다.

### 삭제 확인 방식

> **설계 결정**: 원본 계획은 "삭제 확인 모달 (선택적)"으로 명시했으나, MVP에서는 브라우저 기본 `confirm()` 다이얼로그를 사용합니다.
>
> **이유**: 빠른 구현과 기본 기능 검증을 위해 네이티브 confirm을 먼저 사용하고, Phase 2에서 커스텀 Modal 컴포넌트로 개선합니다.

### 필터링 방식

> **설계 결정**: 필터링은 URL query parameter (`?status=draft`)를 사용합니다.
>
> **이유**:
> 1. URL을 공유하면 같은 필터 상태를 볼 수 있음
> 2. 브라우저 뒤로가기 시 필터 상태 유지
> 3. Server Component에서 직접 필터링 가능 (클라이언트 상태 불필요)

---

## Task List

### 0. Dashboard Layout 생성

**상태:** - [ ] 미완료
**파일:** `app/dashboard/layout.tsx`

**요구사항:**
- [ ] Sidebar 고정 배치 (좌측)
- [ ] Main 영역 (Sidebar 우측)
- [ ] 인증 체크 (미인증 시 리다이렉트)

**기본 구조:**

```typescript
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 인증 체크
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - fixed position */}
      <Sidebar />

      {/* Main Content - offset by sidebar width */}
      <div className="flex flex-col md:ml-64">
        {children}
      </div>
    </div>
  )
}
```

> **참고**: Sidebar 컴포넌트 자체에 `fixed left-0 top-0 h-screen` 스타일이 적용되어 있습니다. (shared-components-impl.md 참조)

**완료 조건:**
- [ ] Sidebar fixed 포지션 배치
- [ ] 인증 체크 동작
- [ ] 반응형 레이아웃 (모바일에서 Sidebar 숨김, Main ml-0)

---

### 1. Dashboard Page 생성

**상태:** - [ ] 미완료
**파일:** `app/dashboard/page.tsx`

**요구사항:**
- [ ] 포스트 목록 조회
- [ ] 필터링 (searchParams로 status 필터)
- [ ] 통계 계산 (published/draft count)
- [ ] 빈 상태 처리

**Props Interface:**

```typescript
interface PageProps {
  searchParams: { status?: "draft" | "published" }
}
```

**기본 구조:**

```typescript
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { getMyPosts } from "@/actions/posts"
import { DashboardHeader } from "./DashboardHeader"
import { StatsBar } from "./StatsBar"
import { PostsTable } from "./PostsTable"
import { EmptyState } from "./EmptyState"

export const metadata: Metadata = {
  title: "Dashboard | SimpleBlog",
  description: "Manage your blog posts",
}

interface PageProps {
  searchParams: { status?: "draft" | "published" }
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { status } = searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 포스트 조회
  const posts = await getMyPosts()

  // 필터링
  const filteredPosts = status
    ? posts.filter((p) => p.status === status)
    : posts

  // 통계 계산
  const publishedCount = posts.filter((p) => p.status === "published").length
  const draftCount = posts.filter((p) => p.status === "draft").length

  // 페이지 제목
  const pageTitle = status
    ? status === "draft"
      ? "Drafts"
      : "Published"
    : "All Posts"

  return (
    <>
      <DashboardHeader userAvatar={user?.user_metadata?.avatar_url} />
      <main className="flex-1 p-6">
        {/* Page Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {pageTitle}
        </h1>

        {/* Stats */}
        <StatsBar
          publishedCount={publishedCount}
          draftCount={draftCount}
        />

        {/* Posts Table or Empty State */}
        {filteredPosts.length > 0 ? (
          <PostsTable posts={filteredPosts} />
        ) : (
          <EmptyState filter={status} />
        )}
      </main>
    </>
  )
}
```

**완료 조건:**
- [ ] 포스트 목록 표시
- [ ] 필터링 동작
- [ ] 통계 표시
- [ ] 빈 상태 표시

---

### 2. DashboardHeader 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/dashboard/DashboardHeader.tsx`

**요구사항:**
- [ ] "New Post" 버튼
- [ ] User Avatar
- [ ] 고정 높이 (h-16)
- [ ] 우측 정렬

**Props Interface:**

```typescript
export interface DashboardHeaderProps {
  userAvatar?: string;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | h-16 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 |
| Layout | flex items-center justify-end px-6 |
| Avatar | h-10 w-10 rounded-full |

**기본 구조:**

```typescript
import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface DashboardHeaderProps {
  userAvatar?: string;
}

export function DashboardHeader({ userAvatar }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        {/* New Post Button */}
        <Button asChild>
          <Link href="/dashboard/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        </Button>

        {/* User Avatar */}
        <button className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
              U
            </div>
          )}
        </button>
      </div>
    </header>
  )
}
```

**완료 조건:**
- [ ] "New Post" 버튼 → `/dashboard/new` 이동
- [ ] Avatar 표시 (또는 기본 아이콘)
- [ ] 다크모드 지원

---

### 3. StatsBar 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/dashboard/StatsBar.tsx`

**요구사항:**
- [ ] Published 개수 표시
- [ ] Draft 개수 표시
- [ ] 심플한 텍스트 형식

**Props Interface:**

```typescript
export interface StatsBarProps {
  publishedCount: number;
  draftCount: number;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | mb-6 text-sm text-gray-500 dark:text-gray-400 |

**기본 구조:**

```typescript
export interface StatsBarProps {
  publishedCount: number;
  draftCount: number;
}

export function StatsBar({ publishedCount, draftCount }: StatsBarProps) {
  return (
    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-medium text-green-600 dark:text-green-400">
        {publishedCount} Published
      </span>
      {", "}
      <span className="font-medium text-gray-600 dark:text-gray-300">
        {draftCount} Drafts
      </span>
    </p>
  )
}
```

**완료 조건:**
- [ ] 통계 숫자 정상 표시
- [ ] 색상 구분 (Published: 녹색, Drafts: 회색)

---

### 4. PostsTable 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/dashboard/PostsTable.tsx`

**요구사항:**
- [ ] 테이블 헤더 (Title, Status, Updated, Actions)
- [ ] PostRow 반복 렌더링
- [ ] 반응형 (모바일에서 가로 스크롤)
- [ ] 다크모드 지원

**Props Interface:**

```typescript
import { Post } from "@/types"

export interface PostsTableProps {
  posts: Post[];
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Container | overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 |
| Table | min-w-full divide-y divide-gray-200 text-sm |
| Header | bg-gray-50 dark:bg-gray-900 |
| Header Cell | px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400 |

**기본 구조:**

```typescript
import { Post } from "@/types"
import { PostRow } from "./PostRow"

export interface PostsTableProps {
  posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Title
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Status
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Updated
            </th>
            <th className="px-6 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**완료 조건:**
- [ ] 테이블 헤더 표시
- [ ] 포스트 행 반복 렌더링
- [ ] 가로 스크롤 (모바일)
- [ ] 다크모드 지원

---

### 5. PostRow 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/dashboard/PostRow.tsx`

**요구사항:**
- [ ] Client Component ("use client") - 삭제 기능 위해
- [ ] 제목 표시
- [ ] 상태 Badge (Published/Draft)
- [ ] 수정일 표시
- [ ] Edit 버튼 (→ `/dashboard/edit/[id]`)
- [ ] Delete 버튼 (확인 후 삭제)
- [ ] 삭제 중 로딩 상태

**Props Interface:**

```typescript
import { Post } from "@/types"

export interface PostRowProps {
  post: Post;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Row | hover:bg-gray-50 dark:hover:bg-gray-900 |
| Cell | whitespace-nowrap px-6 py-4 |
| Title | font-medium text-gray-900 dark:text-white |
| Date | text-gray-500 dark:text-gray-400 |
| Action Button | text-gray-500 hover:text-primary / hover:text-red-600 |

**기본 구조:**

```typescript
"use client"

import { useState } from "react"
import Link from "next/link"
import { PenLine, Trash2, Loader2 } from "lucide-react"
import { Post } from "@/types"
import { Badge } from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"
import { handleDelete } from "./actions"

export interface PostRowProps {
  post: Post;
}

export function PostRow({ post }: PostRowProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function onDelete() {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    setIsDeleting(true)
    await handleDelete(post.id)
    // revalidatePath가 자동으로 UI 업데이트
  }

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-900">
      {/* Title */}
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
        {post.title || "Untitled"}
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant={post.status === "published" ? "success" : "default"}>
          {post.status === "published" ? "Published" : "Draft"}
        </Badge>
      </td>

      {/* Updated Date */}
      <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
        {formatDate(post.updated_at)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {/* Edit */}
          <Link
            href={`/dashboard/edit/${post.id}`}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
          >
            <PenLine className="h-5 w-5" />
          </Link>

          {/* Delete */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 disabled:opacity-50 dark:hover:bg-gray-800"
          >
            {isDeleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
```

**완료 조건:**
- [ ] 포스트 정보 표시
- [ ] Badge 스타일 적용
- [ ] Edit 버튼 동작
- [ ] Delete 버튼 동작 (확인 다이얼로그)
- [ ] 삭제 로딩 상태

---

### 6. EmptyState 컴포넌트

**상태:** - [ ] 미완료
**파일:** `app/dashboard/EmptyState.tsx`

**요구사항:**
- [ ] 필터에 따른 다른 메시지
- [ ] "New Post" CTA 버튼

**Props Interface:**

```typescript
export interface EmptyStateProps {
  filter?: "draft" | "published";
}
```

**기본 구조:**

```typescript
import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface EmptyStateProps {
  filter?: "draft" | "published";
}

export function EmptyState({ filter }: EmptyStateProps) {
  const message = filter
    ? filter === "draft"
      ? "No drafts yet. Start writing!"
      : "No published posts yet. Publish your first post!"
    : "No posts yet. Create your first post!"

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
      <FileText className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
        {filter ? `No ${filter} posts` : "No posts"}
      </h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {message}
      </p>
      <Button asChild>
        <Link href="/dashboard/new" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Create Post</span>
        </Link>
      </Button>
    </div>
  )
}
```

**완료 조건:**
- [ ] 빈 상태 메시지 표시
- [ ] CTA 버튼 동작

---

### 7. Server Actions (Delete)

**상태:** - [ ] 미완료
**파일:** `app/dashboard/actions.ts`

**요구사항:**
- [ ] 삭제 Server Action
- [ ] revalidatePath로 UI 갱신

**기본 구조:**

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { deletePost } from "@/actions/posts"

export async function handleDelete(id: string) {
  await deletePost(id)
  revalidatePath("/dashboard")
}
```

**완료 조건:**
- [ ] 삭제 후 목록 갱신

---

### 8. Loading State

**상태:** - [ ] 미완료
**파일:** `app/dashboard/loading.tsx`

**요구사항:**
- [ ] 스켈레톤 UI
- [ ] 테이블 로딩 상태

**기본 구조:**

```typescript
export default function Loading() {
  return (
    <>
      {/* Header Skeleton */}
      <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </header>

      <main className="flex-1 p-6">
        {/* Title Skeleton */}
        <div className="mb-2 h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-6 h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />

        {/* Table Skeleton */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          {/* Rows */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-200 px-6 py-4 last:border-0 dark:border-gray-700"
            >
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
```

**완료 조건:**
- [ ] 스켈레톤 애니메이션 동작
- [ ] 레이아웃 일관성

---

### 9. Post 타입 정의

**상태:** - [ ] 미완료
**파일:** `types/index.ts`

**요구사항:**
- [ ] Post 인터페이스 정의
- [ ] 다른 파일에서 import 가능

**기본 구조:**

```typescript
/**
 * Post 타입 정의
 * - 원본 계획(dashboard-page.md)의 필드와 PRD 데이터베이스 스키마 기반
 * - singlepost-impl.md, bloglist-impl.md 등에서 동일하게 사용
 */
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: "draft" | "published";
  author_id: string;
  author_name?: string;  // JOIN으로 가져오거나 별도 조회
  created_at: Date;
  updated_at: Date;
  published_at?: Date | null;
  read_time?: number;    // 선택적: DB 저장 또는 calculateReadTime()으로 계산
}

/**
 * Post 생성/수정용 타입 (id, timestamps 제외)
 */
export interface PostInput {
  title: string;
  slug?: string;         // 자동 생성 가능
  content: string;
  excerpt?: string;
  status: "draft" | "published";
}
```

**완료 조건:**
- [ ] Post 타입 정의 완료
- [ ] PostInput 타입 정의 완료
- [ ] 다른 페이지에서 import 정상 동작

---

## 구현 순서

1. **Post 타입 정의** - `types/index.ts`
2. **Dashboard Layout** - `app/dashboard/layout.tsx` (Sidebar 포함)
3. **StatsBar 컴포넌트** - 간단한 통계 표시
4. **EmptyState 컴포넌트** - 빈 상태 UI
5. **PostRow 컴포넌트** - 테이블 행 (Client Component)
6. **PostsTable 컴포넌트** - 테이블 컨테이너
7. **DashboardHeader 컴포넌트** - 상단 헤더
8. **Server Actions** - 삭제 기능
9. **Dashboard Page 조립** - `app/dashboard/page.tsx`
10. **Loading State** - 로딩 UI

---

## 검증 체크리스트

### DashboardHeader
- [ ] "New Post" 버튼 → `/dashboard/new` 이동
- [ ] User Avatar 표시
- [ ] 다크모드 지원

### StatsBar
- [ ] Published 개수 표시
- [ ] Draft 개수 표시
- [ ] 색상 구분

### PostsTable
- [ ] 테이블 헤더 표시
- [ ] 포스트 행 렌더링
- [ ] 가로 스크롤 (모바일)
- [ ] 다크모드 지원

### PostRow
- [ ] 제목 표시
- [ ] Status Badge 표시
- [ ] 수정일 표시
- [ ] Edit 버튼 동작
- [ ] Delete 버튼 동작 (확인 다이얼로그)
- [ ] 삭제 로딩 상태

### EmptyState
- [ ] 빈 상태 메시지
- [ ] "Create Post" 버튼 동작

### Dashboard Page
- [ ] 포스트 목록 로드
- [ ] 필터링 동작 (All/Drafts/Published)
- [ ] URL query parameter 반영
- [ ] 빈 상태 표시
- [ ] 인증 체크 (미인증 시 리다이렉트)

---

## 파일 구조 요약

```
app/
└── dashboard/
    ├── layout.tsx            # Dashboard 레이아웃 (Sidebar)
    ├── page.tsx              # Dashboard Page
    ├── loading.tsx           # Loading State
    ├── actions.ts            # Server Actions (delete)
    ├── DashboardHeader.tsx   # 상단 헤더
    ├── StatsBar.tsx          # 통계 표시
    ├── PostsTable.tsx        # 포스트 테이블
    ├── PostRow.tsx           # 테이블 행 (Client Component)
    └── EmptyState.tsx        # 빈 상태 UI

types/
└── index.ts                  # Post 인터페이스
```

---

## 스타일 요약

### Layout

| 요소 | 값 |
|------|-----|
| Sidebar Width | w-64 |
| Header Height | h-16 |
| Main Padding | p-6 |
| Background | bg-gray-50 dark:bg-gray-900 |

### Sidebar (shared-components-impl.md 참조)

| 요소 | 값 |
|------|-----|
| Border | border-r border-gray-200 |
| Nav Item | px-3 py-2 rounded-lg text-sm font-medium |
| Active | bg-blue-100 text-primary |
| Inactive | text-gray-600 hover:bg-gray-100 |

### Table

| 요소 | 값 |
|------|-----|
| Container | rounded-lg border border-gray-200 bg-white |
| Header | bg-gray-50 |
| Row Hover | hover:bg-gray-50 |
| Cell Padding | px-6 py-4 |
| Text | text-sm |

### Badge (shared-components-impl.md 참조)

| Status | Background | Text |
|--------|------------|------|
| Published | bg-green-100 | text-green-800 |
| Draft | bg-gray-100 | text-gray-800 |

---

## 공통 컴포넌트 의존성

이 페이지는 다음 공통 컴포넌트가 먼저 구현되어야 합니다:

1. **Sidebar** (`components/layout/Sidebar.tsx`) - 네비게이션
2. **Logo** (`components/ui/Logo.tsx`) - Sidebar 내부
3. **Button** (`components/ui/Button.tsx`) - "New Post" 버튼
4. **Badge** (`components/ui/Badge.tsx`) - 상태 표시

→ `shared-components-impl.md` 참조

---

## Server Actions 의존성

이 페이지는 다음 Server Actions이 필요합니다:

```typescript
// actions/posts.ts
export async function getMyPosts(): Promise<Post[]> {
  // Supabase에서 현재 사용자의 포스트 조회
}

export async function deletePost(id: string): Promise<void> {
  // Supabase에서 포스트 삭제
}
```

→ Server Actions 구현 후 연결

---

## 추가 개선 사항 (선택)

### Phase 2: 모바일 Sidebar

- [ ] 모바일 Drawer 컴포넌트
- [ ] 햄버거 메뉴 버튼
- [ ] Overlay + Slide-in 애니메이션

### Phase 3: 삭제 확인 모달

- [ ] 커스텀 Modal 컴포넌트
- [ ] confirm() 대체

### Phase 4: 정렬 기능

- [ ] 제목순 정렬
- [ ] 날짜순 정렬
- [ ] 상태순 정렬

### Phase 5: 페이지네이션

- [ ] 포스트 개수 많을 때 페이지네이션
- [ ] 또는 무한 스크롤
