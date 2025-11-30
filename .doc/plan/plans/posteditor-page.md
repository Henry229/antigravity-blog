# Post Editor Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/dashboard/new`, `/dashboard/edit/[id]` |
| **파일** | `app/dashboard/new/page.tsx`, `app/dashboard/edit/[id]/page.tsx` |
| **HTML 소스** | post-editor.html |
| **User Flow** | Step 3-4: 새 글 작성, 발행 클릭 |
| **인증 필요** | ✅ |

---

## HTML 구조 분석

```
- body (flex flex-col h-screen)
  - header (h-16, border-b)
    - back-link: "← Dashboard"
    - auto-save-indicator: "Saved just now"
    - save-draft-button (secondary)
    - publish-button (primary)
  - main (flex-1, grid 2-column)
    - editor-panel (left)
      - title-input (large, borderless)
      - toolbar
        - bold, italic, heading, link, code, image buttons
      - markdown-textarea (monospace, flex-1)
    - preview-panel (right, md:flex)
      - title-preview
      - content-preview (rendered markdown)
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Button | 공통 | `components/ui/Button.tsx` |
| EditorHeader | 페이지전용 | `app/dashboard/(editor)/EditorHeader.tsx` |
| TitleInput | 페이지전용 | `app/dashboard/(editor)/TitleInput.tsx` |
| EditorToolbar | 페이지전용 | `app/dashboard/(editor)/EditorToolbar.tsx` |
| MarkdownEditor | 페이지전용 | `app/dashboard/(editor)/MarkdownEditor.tsx` |
| MarkdownPreview | 페이지전용 | `app/dashboard/(editor)/MarkdownPreview.tsx` |

---

## 컴포넌트 상세

### EditorHeader

```typescript
// app/dashboard/(editor)/EditorHeader.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface EditorHeaderProps {
  isSaving?: boolean;
  lastSaved?: Date;
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
    <header className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 h-16 shrink-0 bg-white">
      <Link 
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium hover:text-primary"
      >
        <span className="material-symbols-outlined text-xl">arrow_back</span>
        Dashboard
      </Link>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {lastSaved && (
          <p className="text-gray-500 text-sm hidden sm:block">
            {isSaving ? 'Saving...' : `Saved ${formatRelativeTime(lastSaved)}`}
          </p>
        )}
        <Button variant="secondary" onClick={onSaveDraft} disabled={isSaving}>
          Save Draft
        </Button>
        <Button onClick={onPublish} loading={isPublishing}>
          Publish
        </Button>
      </div>
    </header>
  );
}
```

### TitleInput

```typescript
// app/dashboard/(editor)/TitleInput.tsx
'use client';

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
      className="w-full bg-transparent text-3xl md:text-4xl lg:text-5xl font-display font-medium placeholder:text-gray-400 focus:outline-none focus:ring-0 border-none p-0 mb-6"
    />
  );
}
```

### EditorToolbar

```typescript
// app/dashboard/(editor)/EditorToolbar.tsx
'use client';

interface ToolbarButton {
  icon: string;
  action: string;
  title: string;
}

const toolbarButtons: ToolbarButton[] = [
  { icon: 'format_bold', action: 'bold', title: 'Bold' },
  { icon: 'format_italic', action: 'italic', title: 'Italic' },
  { icon: 'title', action: 'heading', title: 'Heading' },
  { icon: 'link', action: 'link', title: 'Link' },
  { icon: 'code', action: 'code', title: 'Code' },
  { icon: 'image', action: 'image', title: 'Image URL' },
];

interface EditorToolbarProps {
  onAction: (action: string) => void;
}

export function EditorToolbar({ onAction }: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-1 border-b border-gray-200 pb-2 mb-4">
      {toolbarButtons.map((btn) => (
        <button
          key={btn.action}
          onClick={() => onAction(btn.action)}
          title={btn.title}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">{btn.icon}</span>
        </button>
      ))}
    </div>
  );
}
```

### MarkdownEditor

```typescript
// app/dashboard/(editor)/MarkdownEditor.tsx
'use client';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start writing your story using Markdown..."
      className="w-full flex-1 resize-none bg-transparent font-mono text-base leading-relaxed placeholder:text-gray-400 focus:outline-none focus:ring-0 border-none p-0"
    />
  );
}
```

### MarkdownPreview

```typescript
// app/dashboard/(editor)/MarkdownPreview.tsx
import ReactMarkdown from 'react-markdown';

interface MarkdownPreviewProps {
  title: string;
  content: string;
}

export function MarkdownPreview({ title, content }: MarkdownPreviewProps) {
  return (
    <div className="hidden md:flex flex-col h-full overflow-y-auto bg-white border-l border-gray-200">
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex-1">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-gray-400 mb-6">
          {title || 'Your Post Title...'}
        </h1>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{content || 'Start writing your story...'}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
```

**HTML 추출 (Preview Styles)**:
```css
.preview-content h2 { font-family: 'Newsreader', serif; font-size: 1.5rem; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
.preview-content p { margin-bottom: 1.25em; line-height: 1.75; }
.preview-content a { color: #24aceb; text-decoration: underline; }
.preview-content code { background-color: #e7eff3; padding: 0.2em 0.4em; border-radius: 6px; font-family: monospace; }
.preview-content pre { background-color: #e7eff3; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.25em; }
.preview-content ul, .preview-content ol { padding-left: 1.5rem; margin-bottom: 1.25em; }
.preview-content blockquote { border-left: 4px solid #d0e0e7; padding-left: 1rem; color: #4d8199; font-style: italic; }
```

---

## 비즈니스 로직 (PRD에서)

### New Post Page
```typescript
// app/dashboard/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PostEditor } from '../(editor)/PostEditor';

export default async function NewPostPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return <PostEditor mode="create" />;
}
```

### Edit Post Page
```typescript
// app/dashboard/edit/[id]/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { getPostById } from '@/actions/posts';
import { PostEditor } from '../../(editor)/PostEditor';

interface PageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: PageProps) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const post = await getPostById(params.id);
  
  if (!post || post.user_id !== user.id) {
    notFound();
  }
  
  return <PostEditor mode="edit" initialData={post} />;
}
```

### Server Actions 필요
```typescript
// actions/posts.ts
createPost(title, content) → Post
updatePost(id, title, content) → Post
publishPost(id) → Post
```

### 필요 로직
- [ ] 제목, 내용 상태 관리
- [ ] Auto-save (debounced, 선택적)
- [ ] Save Draft: status='draft'로 저장
- [ ] Publish: status='published'로 변경, slug 생성
- [ ] Markdown preview 실시간 렌더링
- [ ] Toolbar actions (bold, italic, etc.)
- [ ] 발행 후 성공 모달 또는 리다이렉트

### Slug 생성 로직
```typescript
// lib/utils.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Date.now().toString(36);
}
```

---

## 구현 태스크

### Phase 1: 레이아웃
- [ ] `app/dashboard/(editor)/layout.tsx` 생성 (선택적)
- [ ] 2-column split view 레이아웃

### Phase 2: 에디터 컴포넌트
- [ ] PostEditor (메인 클라이언트 컴포넌트)
- [ ] EditorHeader
- [ ] TitleInput
- [ ] EditorToolbar
- [ ] MarkdownEditor (textarea)
- [ ] MarkdownPreview

### Phase 3: New Post 페이지
- [ ] `app/dashboard/new/page.tsx` 생성
- [ ] 인증 체크
- [ ] createPost action 연결

### Phase 4: Edit Post 페이지
- [ ] `app/dashboard/edit/[id]/page.tsx` 생성
- [ ] 기존 데이터 로드
- [ ] updatePost action 연결
- [ ] 권한 체크 (본인 글만)

### Phase 5: 발행 기능
- [ ] publishPost action 연결
- [ ] slug 자동 생성
- [ ] 성공 시 리다이렉트 또는 모달

### Phase 6: 부가 기능 (선택적)
- [ ] Auto-save
- [ ] Toolbar markdown 삽입
- [ ] 이미지 URL 삽입 헬퍼
- [ ] 키보드 단축키

---

## 스타일 (HTML에서 추출)

### Layout
| 요소 | 값 |
|------|-----|
| Container | flex flex-col h-screen |
| Header | h-16 border-b |
| Main | flex-1 grid grid-cols-1 md:grid-cols-2 |
| Editor Panel | flex flex-col h-full overflow-y-auto |
| Preview Panel | hidden md:flex border-l |

### Editor
| 요소 | 값 |
|------|-----|
| Title | text-3xl md:text-4xl lg:text-5xl font-display |
| Textarea | font-mono text-base leading-relaxed |
| Toolbar Button | p-2 rounded hover:bg-gray-100 |

### Colors
| 요소 | 색상 |
|------|------|
| Primary | #24aceb (from post-editor.html) |
| Background | #f6f7f8 |
| Border | #d0e0e7 |
| Placeholder | #4d8199 |

### Typography
| 요소 | Font |
|------|------|
| Title | Newsreader (display) |
| Editor | Source Code Pro (mono) |
| Preview | Newsreader (headings), system (body) |

---

## PostEditor 메인 컴포넌트

```typescript
// app/dashboard/(editor)/PostEditor.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost, publishPost } from '@/actions/posts';
import { Post } from '@/types';

interface PostEditorProps {
  mode: 'create' | 'edit';
  initialData?: Post;
}

export function PostEditor({ mode, initialData }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [postId, setPostId] = useState(initialData?.id || null);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (mode === 'create' && !postId) {
        const post = await createPost(title, content);
        setPostId(post.id);
      } else if (postId) {
        await updatePost(postId, title, content);
      }
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      let id = postId;
      if (!id) {
        const post = await createPost(title, content);
        id = post.id;
      }
      await publishPost(id);
      router.push('/dashboard');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <EditorHeader 
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 md:p-8">
          <TitleInput value={title} onChange={setTitle} />
          <EditorToolbar onAction={handleToolbarAction} />
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
        {/* Preview Panel */}
        <MarkdownPreview title={title} content={content} />
      </main>
    </div>
  );
}
```

---

## 파일 구조

```
app/
└── dashboard/
    ├── (editor)/
    │   ├── PostEditor.tsx        # 메인 에디터 컴포넌트
    │   ├── EditorHeader.tsx      # 상단 헤더
    │   ├── TitleInput.tsx        # 제목 입력
    │   ├── EditorToolbar.tsx     # 툴바
    │   ├── MarkdownEditor.tsx    # Markdown 에디터
    │   └── MarkdownPreview.tsx   # 미리보기
    ├── new/
    │   └── page.tsx              # New Post Page
    └── edit/
        └── [id]/
            └── page.tsx          # Edit Post Page
```

---

## 의존성

- `react-markdown` - Markdown 렌더링 (Preview)
- `@uiw/react-md-editor` - 대안 에디터 라이브러리 (선택적)
- next/navigation - useRouter
- Material Symbols Outlined - 툴바 아이콘
- 공통 컴포넌트: Button
- Server Actions: createPost, updatePost, publishPost
- 유틸리티: generateSlug, formatRelativeTime
