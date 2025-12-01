# Post Editor Page 구현 계획 (New / Edit)

## 개요

SimpleBlog의 글 작성 및 수정 에디터 페이지 구현

- **User Flow Step**: 3-4 - 새 글 작성, 발행 클릭
- **주요 기능**: Markdown 에디터, 실시간 미리보기, 저장/발행
- **인증 필요**: ✅ (Protected Route)

---

## 페이지 구조 (plan-based-page에서)

```
- body (flex flex-col h-screen)
  - EditorHeader (h-16, border-b)
    - back-link: "← Dashboard"
    - auto-save-indicator: "Saved just now"
    - save-draft-button (secondary)
    - publish-button (primary)
  - main (flex-1, grid 2-column)
    - editor-panel (left)
      - TitleInput (large, borderless)
      - EditorToolbar
        - bold, italic, heading, link, code, image
      - MarkdownEditor (textarea, monospace)
    - preview-panel (right, hidden on mobile)
      - MarkdownPreview (rendered markdown)
```

---

## 공통 컴포넌트 Import 경로

> 참조: `.doc/plan/implementation/shared-components-impl.md`

| 컴포넌트 | Import 경로 | Props |
|----------|-------------|-------|
| Button | `@/components/ui/Button` | `variant`, `size`, `loading`, `disabled`, `onClick` |
| Logo | `@/components/ui/Logo` | `size`, `icon` |

---

## 의존성

이미 설치됨 (공통 컴포넌트에서):
- lucide-react
- clsx, tailwind-merge

추가 필요:
```bash
# Markdown 렌더링
npm install react-markdown

# Markdown 스타일링 (선택적)
npm install @tailwindcss/typography

# 대안: 전체 에디터 라이브러리 (선택적)
npm install @uiw/react-md-editor
```

---

## Task List

### 0. 라우트 구조 설정

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/` 디렉토리 구조

**요구사항:**
- [x] `app/dashboard/new/page.tsx` - 새 글 작성
- [x] `app/dashboard/edit/[id]/page.tsx` - 글 수정
- [x] `app/dashboard/(editor)/` - 공유 에디터 컴포넌트

**파일 구조:**

```
app/dashboard/
├── (editor)/
│   ├── PostEditor.tsx        # 메인 에디터 (Client Component)
│   ├── EditorHeader.tsx      # 상단 헤더
│   ├── TitleInput.tsx        # 제목 입력
│   ├── EditorToolbar.tsx     # 툴바
│   ├── MarkdownEditor.tsx    # 에디터 textarea
│   └── MarkdownPreview.tsx   # 미리보기 패널
├── new/
│   └── page.tsx              # 새 글 페이지 (Server Component)
└── edit/
    └── [id]/
        └── page.tsx          # 수정 페이지 (Server Component)
```

**완료 조건:**
- [x] 디렉토리 구조 생성
- [x] 라우트 접근 가능

---

### 1. PostEditor 메인 컴포넌트

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/PostEditor.tsx`

**요구사항:**
- [x] Client Component ("use client")
- [x] create/edit 모드 지원
- [x] 제목, 내용 상태 관리
- [x] 저장/발행 핸들러
- [x] 2-column split 레이아웃
- [ ] 마지막 저장 시간 표시

**Props Interface:**

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
}

interface PostEditorProps {
  mode: 'create' | 'edit';
  initialData?: Post;
}
```

**기본 구조:**

```typescript
"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createPost, updatePost, publishPost } from "@/actions/posts"
import { EditorHeader } from "./EditorHeader"
import { TitleInput } from "./TitleInput"
import { EditorToolbar } from "./EditorToolbar"
import { MarkdownEditor } from "./MarkdownEditor"
import { MarkdownPreview } from "./MarkdownPreview"

interface PostEditorProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    content: string;
  };
}

export function PostEditor({ mode, initialData }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [postId, setPostId] = useState<string | null>(initialData?.id || null)

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) return

    setIsSaving(true)
    try {
      if (mode === 'create' && !postId) {
        const result = await createPost({ title, content })
        if (result.post) {
          setPostId(result.post.id)
          // URL 업데이트 (선택적)
          window.history.replaceState(null, '', `/dashboard/edit/${result.post.id}`)
        }
      } else if (postId) {
        await updatePost({ id: postId, title, content })
      }
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [mode, postId, title, content])

  const handlePublish = useCallback(async () => {
    if (!title.trim()) return

    setIsPublishing(true)
    try {
      let id = postId
      if (!id) {
        const result = await createPost({ title, content })
        if (result.post) {
          id = result.post.id
        }
      } else {
        await updatePost({ id, title, content })
      }

      if (id) {
        await publishPost(id)
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setIsPublishing(false)
    }
  }, [postId, title, content, router])

  const handleToolbarAction = useCallback((action: string) => {
    // Markdown 삽입 로직 (Task 3에서 구현)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-900">
      <EditorHeader
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12">
          <TitleInput value={title} onChange={setTitle} />
          <EditorToolbar onAction={handleToolbarAction} />
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* Preview Panel */}
        <MarkdownPreview title={title} content={content} />
      </main>
    </div>
  )
}
```

**완료 조건:**
- [x] create/edit 모드 전환
- [x] 상태 관리 동작
- [x] 2-column 레이아웃
- [x] Server Action 연결

---

### 2. EditorHeader 컴포넌트

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/EditorHeader.tsx`

**요구사항:**
- [x] 뒤로가기 링크 (← Dashboard)
- [x] 저장 상태 표시 ("Saving...", "Saved just now")
- [x] Save Draft 버튼 (secondary)
- [x] Publish 버튼 (primary, loading 상태)

**Props Interface:**

```typescript
interface EditorHeaderProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
}
```

**스타일:**

| 요소 | 값 |
|------|-----|
| Height | h-16 |
| Border | border-b border-gray-200 |
| Background | bg-white |
| Padding | px-4 sm:px-6 |

**기본 구조:**

```typescript
"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatRelativeTime } from "@/lib/utils"

interface EditorHeaderProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
}

export function EditorHeader({
  isSaving,
  lastSaved,
  onSaveDraft,
  onPublish,
  isPublishing
}: EditorHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900 sm:px-6">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Save Status */}
        {lastSaved && (
          <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
            {isSaving ? 'Saving...' : `Saved ${formatRelativeTime(lastSaved)}`}
          </p>
        )}

        {/* Save Draft Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          Save Draft
        </Button>

        {/* Publish Button */}
        <Button
          size="sm"
          onClick={onPublish}
          loading={isPublishing}
        >
          Publish
        </Button>
      </div>
    </header>
  )
}
```

**완료 조건:**
- [x] 뒤로가기 링크 동작
- [x] 저장 상태 표시
- [x] 버튼 동작 및 loading 상태

---

### 3. TitleInput 컴포넌트

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/TitleInput.tsx`

**요구사항:**
- [x] 큰 폰트 (text-3xl ~ text-5xl)
- [x] 테두리 없음 (borderless)
- [x] 포커스 링 없음
- [x] Placeholder: "Your Post Title..."

**Props Interface:**

```typescript
interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}
```

**스타일:**

| 요소 | 값 |
|------|-----|
| Font Size | text-3xl md:text-4xl lg:text-5xl |
| Font Family | font-serif (Newsreader) |
| Placeholder | text-gray-400 |

**기본 구조:**

```typescript
"use client"

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Your Post Title..."
      className="mb-6 w-full border-none bg-transparent p-0 text-3xl font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-white md:text-4xl lg:text-5xl"
      autoFocus
    />
  )
}
```

**완료 조건:**
- [x] 입력 동작
- [x] 스타일 적용 (큰 폰트, 테두리 없음)
- [x] Placeholder 표시

---

### 4. EditorToolbar 컴포넌트

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/EditorToolbar.tsx`

**요구사항:**
- [x] Markdown 서식 버튼 (Bold, Italic, Heading, Link, Code, Image)
- [x] Lucide 아이콘 사용
- [x] 클릭 시 action 콜백 호출

**Props Interface:**

```typescript
interface EditorToolbarProps {
  onAction: (action: string) => void;
}
```

**Toolbar Actions:**

| Action | Lucide Icon | Markdown 삽입 |
|--------|-------------|--------------|
| bold | `Bold` | `**text**` |
| italic | `Italic` | `*text*` |
| heading | `Heading2` | `## Heading` |
| link | `Link` | `[text](url)` |
| code | `Code` | `` `code` `` |
| image | `Image` | `![alt](url)` |

**기본 구조:**

```typescript
"use client"

import { Bold, Italic, Heading2, Link, Code, Image } from "lucide-react"

const toolbarButtons = [
  { icon: Bold, action: 'bold', title: 'Bold (Ctrl+B)' },
  { icon: Italic, action: 'italic', title: 'Italic (Ctrl+I)' },
  { icon: Heading2, action: 'heading', title: 'Heading' },
  { icon: Link, action: 'link', title: 'Link' },
  { icon: Code, action: 'code', title: 'Code' },
  { icon: Image, action: 'image', title: 'Image URL' },
]

interface EditorToolbarProps {
  onAction: (action: string) => void;
}

export function EditorToolbar({ onAction }: EditorToolbarProps) {
  return (
    <div className="mb-4 flex items-center gap-1 border-b border-gray-200 pb-3 dark:border-gray-700">
      {toolbarButtons.map((btn) => {
        const Icon = btn.icon
        return (
          <button
            key={btn.action}
            type="button"
            onClick={() => onAction(btn.action)}
            title={btn.title}
            className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
    </div>
  )
}
```

**완료 조건:**
- [x] 아이콘 버튼 렌더링
- [x] 클릭 시 action 콜백
- [x] hover 스타일

---

### 5. MarkdownEditor 컴포넌트

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/MarkdownEditor.tsx`

**요구사항:**
- [x] Textarea (flex-1, 남은 공간 채우기)
- [x] Monospace 폰트
- [x] Placeholder: "Start writing your story using Markdown..."
- [x] 자동 높이 조절 (선택적)

**Props Interface:**

```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}
```

**스타일:**

| 요소 | 값 |
|------|-----|
| Font | font-mono |
| Line Height | leading-relaxed |
| Resize | resize-none |

**기본 구조:**

```typescript
"use client"

import { useRef, useEffect } from "react"

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 자동 높이 조절 (선택적)
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start writing your story using Markdown..."
      className="min-h-[300px] w-full flex-1 resize-none border-none bg-transparent p-0 font-mono text-base leading-relaxed text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-gray-200"
    />
  )
}
```

**완료 조건:**
- [x] 입력 동작
- [x] Monospace 폰트
- [x] Placeholder 표시
- [x] 자동 높이 조절

---

### 6. MarkdownPreview 컴포넌트

**상태:** - [x] 완료
**파일:** `app/dashboard/(editor)/MarkdownPreview.tsx`

**요구사항:**
- [x] 우측 패널 (md 이상에서만 표시)
- [x] 제목 미리보기
- [x] Markdown → HTML 렌더링
- [x] 프로즈 스타일 (typography)

**Props Interface:**

```typescript
interface MarkdownPreviewProps {
  title: string;
  content: string;
}
```

**스타일:**

| 요소 | 값 |
|------|-----|
| Display | hidden md:flex |
| Border | border-l border-gray-200 |
| Padding | p-4 sm:p-6 md:p-8 lg:p-12 |
| Prose | prose prose-lg max-w-none |

**기본 구조:**

```typescript
import ReactMarkdown from "react-markdown"

interface MarkdownPreviewProps {
  title: string;
  content: string;
}

export function MarkdownPreview({ title, content }: MarkdownPreviewProps) {
  return (
    <div className="hidden w-1/2 flex-col overflow-y-auto border-l border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 md:flex">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12">
        {/* Title Preview */}
        <h1 className="mb-6 text-3xl font-medium text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          {title || (
            <span className="text-gray-400">Your Post Title...</span>
          )}
        </h1>

        {/* Content Preview */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <p className="text-gray-400">Start writing your story...</p>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Tailwind Typography 설정:**

```javascript
// tailwind.config.ts
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

**완료 조건:**
- [x] 모바일에서 숨김
- [x] Markdown 렌더링
- [x] 프로즈 스타일 적용

---

### 7. New Post Page

**상태:** - [x] 완료
**파일:** `app/dashboard/new/page.tsx`

**요구사항:**
- [x] Server Component
- [x] 인증 확인 (비로그인 시 /login 리다이렉트)
- [x] PostEditor (mode="create") 렌더링

**기본 구조:**

```typescript
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PostEditor } from "../(editor)/PostEditor"

export const metadata: Metadata = {
  title: "New Post | SimpleBlog",
  description: "Create a new blog post",
}

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <PostEditor mode="create" />
}
```

**완료 조건:**
- [x] 페이지 접근 가능 (`/dashboard/new`)
- [x] 인증 확인 동작
- [x] PostEditor 렌더링

---

### 8. Edit Post Page

**상태:** - [x] 완료
**파일:** `app/dashboard/edit/[id]/page.tsx`

**요구사항:**
- [x] Server Component
- [x] 인증 확인
- [x] 포스트 데이터 로드
- [x] 권한 확인 (본인 글만 수정 가능)
- [ ] PostEditor (mode="edit") 렌더링

**기본 구조:**

```typescript
import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getPostById } from "@/actions/posts"
import { PostEditor } from "../../(editor)/PostEditor"

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Post | SimpleBlog",
  description: "Edit your blog post",
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  // 본인 글만 수정 가능
  if (post.user_id !== user.id) {
    redirect("/dashboard")
  }

  return (
    <PostEditor
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content,
      }}
    />
  )
}
```

**완료 조건:**
- [x] 페이지 접근 가능 (`/dashboard/edit/[id]`)
- [x] 기존 데이터 로드
- [x] 권한 확인 동작
- [x] notFound 처리

---

### 9. Server Actions (Posts)

**상태:** - [x] 완료
**파일:** `actions/posts.ts`

**요구사항:**
- [x] createPost(title, content) - 새 포스트 생성
- [x] updatePost(id, title, content) - 포스트 수정
- [x] publishPost(id) - 발행 (status 변경, slug 생성)
- [x] getPostById(id) - 단일 포스트 조회

**기본 구조:**

```typescript
// actions/posts.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/lib/utils"

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

interface CreatePostInput {
  title: string;
  content: string;
}

export async function createPost({ title, content }: CreatePostInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const slug = generateSlug(title)
  const excerpt = content.slice(0, 150)

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      title,
      slug,
      content,
      excerpt,
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { post }
}

interface UpdatePostInput {
  id: string;
  title: string;
  content: string;
}

export async function updatePost({ id, title, content }: UpdatePostInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const excerpt = content.slice(0, 150)

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      excerpt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { post }
}

export async function publishPost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // 먼저 포스트 조회하여 slug 생성
  const { data: existingPost } = await supabase
    .from("posts")
    .select("title, slug")
    .eq("id", id)
    .single()

  const slug = existingPost?.slug || generateSlug(existingPost?.title || '')

  const { data: post, error } = await supabase
    .from("posts")
    .update({
      status: 'published',
      slug,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/blog")
  return { post }
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !post) {
    return null
  }

  return post
}
```

**완료 조건:**
- [x] createPost 동작
- [x] updatePost 동작
- [x] publishPost 동작 (slug 생성)
- [x] getPostById 동작

---

### 10. 유틸리티 함수 추가

**상태:** - [x] 완료
**파일:** `lib/utils.ts`

**요구사항:**
- [x] generateSlug - 제목에서 slug 생성
- [x] formatRelativeTime - 상대적 시간 표시 ("just now", "2 minutes ago")

**기본 구조:**

```typescript
// lib/utils.ts에 추가

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    + '-' + Date.now().toString(36)
}

/**
 * Format a date as relative time (e.g., "just now", "2 minutes ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}
```

**완료 조건:**
- [x] generateSlug: URL-safe slug 생성
- [x] formatRelativeTime: 상대 시간 표시

---

## 구현 순서

1. 유틸리티 함수 추가 (generateSlug, formatRelativeTime)
2. Server Actions 구현 (createPost, updatePost, publishPost, getPostById)
3. 에디터 컴포넌트 구현:
   - TitleInput
   - EditorToolbar
   - MarkdownEditor
   - MarkdownPreview
   - EditorHeader
4. PostEditor 메인 컴포넌트 구현
5. New Post Page 구현
6. Edit Post Page 구현
7. 통합 테스트

---

## 파일 구조 요약

```
app/dashboard/
├── (editor)/
│   ├── PostEditor.tsx        # 메인 에디터 (Client)
│   ├── EditorHeader.tsx      # 상단 헤더
│   ├── TitleInput.tsx        # 제목 입력
│   ├── EditorToolbar.tsx     # 서식 툴바
│   ├── MarkdownEditor.tsx    # Markdown 에디터
│   └── MarkdownPreview.tsx   # 실시간 미리보기
├── new/
│   └── page.tsx              # 새 글 페이지
└── edit/
    └── [id]/
        └── page.tsx          # 수정 페이지

actions/
└── posts.ts                  # createPost, updatePost, publishPost, getPostById

lib/
└── utils.ts                  # generateSlug, formatRelativeTime 추가
```

---

## 검증 체크리스트

### PostEditor
- [x] create 모드 동작
- [x] edit 모드 동작 (기존 데이터 로드)
- [x] 제목/내용 상태 관리
- [x] 2-column 레이아웃 (모바일에서 에디터만)

### EditorHeader
- [x] 뒤로가기 링크 → /dashboard
- [x] 저장 상태 표시
- [x] Save Draft 버튼 동작
- [x] Publish 버튼 동작 + loading

### MarkdownEditor
- [x] 입력 동작
- [x] Placeholder 표시
- [x] Monospace 폰트

### MarkdownPreview
- [x] 모바일에서 숨김
- [x] Markdown → HTML 렌더링
- [x] 실시간 업데이트

### Server Actions
- [x] createPost: 새 포스트 생성
- [x] updatePost: 포스트 수정
- [x] publishPost: 발행 + slug 생성
- [x] 권한 확인 (본인 글만)

### 공통
- [x] 인증 보호 동작
- [x] 다크모드 지원
- [x] 반응형 레이아웃
- [x] TypeScript 타입 에러 없음

---

## 다음 단계 (선택적 기능)

1. **Auto-save**: debounce를 사용한 자동 저장
2. **Toolbar Actions**: Markdown 삽입 구현
3. **키보드 단축키**: Ctrl+B (bold), Ctrl+I (italic) 등
4. **이미지 업로드**: Supabase Storage 연동
5. **발행 성공 모달**: 공개 URL 표시
6. **삭제 기능**: deletePost Server Action
