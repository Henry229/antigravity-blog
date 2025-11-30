# Dashboard Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/dashboard` |
| **파일** | `app/dashboard/page.tsx` |
| **HTML 소스** | dashboard.html |
| **User Flow** | Step 2 - 대시보드 진입, 글 목록 확인 |
| **인증 필요** | ✅ |

---

## HTML 구조 분석

```
- body (flex)
  - sidebar (w-64, fixed left)
    - logo-section (h-16, border-b)
      - logo
    - nav (p-4)
      - nav-item: All Posts (active)
      - nav-item: Drafts
      - nav-item: Published
  - main-container (flex-1)
    - header (h-16, border-b)
      - new-post-button (primary)
      - user-avatar
    - main (p-6)
      - page-title: "All Posts"
      - stats: "3 Published, 1 Drafts"
      - posts-table
        - table-header: Title, Status, Updated, Actions
        - table-rows (반복)
          - title
          - status-badge (Published/Draft)
          - updated-date
          - action-buttons: Edit, Delete
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Sidebar | 공통 | `components/layout/Sidebar.tsx` |
| Logo | 공통 | `components/ui/Logo.tsx` |
| Button | 공통 | `components/ui/Button.tsx` |
| Badge | 공통 | `components/ui/Badge.tsx` |
| DashboardHeader | 페이지전용 | `app/dashboard/DashboardHeader.tsx` |
| PostsTable | 페이지전용 | `app/dashboard/PostsTable.tsx` |
| PostRow | 페이지전용 | `app/dashboard/PostRow.tsx` |
| StatsBar | 페이지전용 | `app/dashboard/StatsBar.tsx` |

---

## 컴포넌트 상세

### DashboardHeader

```typescript
// app/dashboard/DashboardHeader.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface DashboardHeaderProps {
  userAvatar?: string;
}

export function DashboardHeader({ userAvatar }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/new">
          <Button>
            <span className="material-symbols-outlined text-base">add</span>
            <span>New Post</span>
          </Button>
        </Link>
        <button className="h-10 w-10 rounded-full overflow-hidden">
          <img 
            src={userAvatar || '/default-avatar.png'} 
            alt="User Avatar" 
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
```

### PostsTable

```typescript
// app/dashboard/PostsTable.tsx
import { Post } from '@/types';
import { PostRow } from './PostRow';

interface PostsTableProps {
  posts: Post[];
  onDelete: (id: string) => void;
}

export function PostsTable({ posts, onDelete }: PostsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Title</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-6 py-3 text-left font-medium text-gray-600">Updated</th>
            <th className="px-6 py-3 text-right font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### PostRow

```typescript
// app/dashboard/PostRow.tsx
import Link from 'next/link';
import { Post } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface PostRowProps {
  post: Post;
  onDelete: (id: string) => void;
}

export function PostRow({ post, onDelete }: PostRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
        {post.title}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge variant={post.status === 'published' ? 'success' : 'default'}>
          {post.status === 'published' ? 'Published' : 'Draft'}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-500">
        {formatDate(post.updated_at)}
      </td>
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link 
            href={`/dashboard/edit/${post.id}`}
            className="text-gray-500 hover:text-primary"
          >
            <span className="material-symbols-outlined text-xl">edit</span>
          </Link>
          <button 
            onClick={() => onDelete(post.id)}
            className="text-gray-500 hover:text-red-600"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
}
```

**HTML 추출**:
```html
<tr class="hover:bg-gray-50 dark:hover:bg-gray-900">
  <td class="whitespace-nowrap px-6 py-4 font-medium text-gray-900">The Future of Web Development</td>
  <td class="whitespace-nowrap px-6 py-4">
    <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Published</span>
  </td>
  <td class="whitespace-nowrap px-6 py-4 text-gray-500">June 15, 2023</td>
  <td class="whitespace-nowrap px-6 py-4">
    <div class="flex items-center justify-end gap-2">
      <button class="text-gray-500 hover:text-primary"><span class="material-symbols-outlined text-xl">edit</span></button>
      <button class="text-gray-500 hover:text-red-600"><span class="material-symbols-outlined text-xl">delete</span></button>
    </div>
  </td>
</tr>
```

---

## 비즈니스 로직 (PRD에서)

### Server Action 연결
```typescript
// app/dashboard/page.tsx
import { getMyPosts } from '@/actions/posts';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const posts = await getMyPosts();
  
  return (
    // ...
  );
}
```

### 필요 로직
- [ ] `getMyPosts()` Server Action 호출
- [ ] 인증 체크 → 미인증 시 `/login` 리다이렉트
- [ ] 필터링: All / Drafts / Published (query param)
- [ ] 삭제 기능 (`deletePost`)
- [ ] 통계 계산 (published count, draft count)

### Delete Action
```typescript
// app/dashboard/actions.ts
'use server';

import { deletePost } from '@/actions/posts';
import { revalidatePath } from 'next/cache';

export async function handleDelete(id: string) {
  await deletePost(id);
  revalidatePath('/dashboard');
}
```

### 필터링 로직
```typescript
// app/dashboard/page.tsx
interface PageProps {
  searchParams: { status?: 'draft' | 'published' };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const posts = await getMyPosts();
  
  const filteredPosts = searchParams.status
    ? posts.filter(p => p.status === searchParams.status)
    : posts;
  
  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;
  
  // ...
}
```

---

## 구현 태스크

### Phase 1: 레이아웃
- [ ] `app/dashboard/layout.tsx` 생성
- [ ] Sidebar 컴포넌트 배치
- [ ] 인증 체크 로직

### Phase 2: Dashboard Page
- [ ] `app/dashboard/page.tsx` 생성
- [ ] DashboardHeader 구현
- [ ] StatsBar 구현
- [ ] PostsTable 구현

### Phase 3: 데이터 연결
- [ ] `getMyPosts()` action 연결
- [ ] 필터링 로직 (searchParams)
- [ ] Empty state 처리

### Phase 4: 상호작용
- [ ] Delete 기능 구현
- [ ] 삭제 확인 모달 (선택적)
- [ ] 로딩 상태

---

## 스타일 (HTML에서 추출)

### Layout
| 요소 | 값 |
|------|-----|
| Sidebar Width | w-64 |
| Header Height | h-16 |
| Main Padding | p-6 |
| Background | bg-white (main), bg-background-light (sidebar) |

### Sidebar
| 요소 | 값 |
|------|-----|
| Border | border-r border-gray-200 |
| Nav Item | px-3 py-2 rounded-lg text-sm font-medium |
| Active | bg-blue-100 text-primary |
| Inactive | text-gray-600 hover:bg-gray-100 |
| Icon | material-symbols-outlined text-base |

### Table
| 요소 | 값 |
|------|-----|
| Border | rounded-lg border border-gray-200 |
| Header | bg-gray-50 |
| Row Hover | hover:bg-gray-50 |
| Cell Padding | px-6 py-4 |
| Text | text-sm |

### Badge
| Status | Background | Text |
|--------|------------|------|
| Published | bg-green-100 | text-green-800 |
| Draft | bg-gray-100 | text-gray-800 |

---

## Sidebar Navigation

```typescript
const navItems = [
  { label: 'All Posts', icon: 'folder', href: '/dashboard', filter: undefined },
  { label: 'Drafts', icon: 'draft', href: '/dashboard?status=draft', filter: 'draft' },
  { label: 'Published', icon: 'publish', href: '/dashboard?status=published', filter: 'published' },
];
```

---

## 파일 구조

```
app/
└── dashboard/
    ├── layout.tsx            # Dashboard 레이아웃 (Sidebar 포함)
    ├── page.tsx              # Dashboard Page
    ├── DashboardHeader.tsx   # 상단 헤더 (New Post 버튼)
    ├── StatsBar.tsx          # 통계 표시
    ├── PostsTable.tsx        # 포스트 테이블
    ├── PostRow.tsx           # 테이블 행
    ├── actions.ts            # Client-side actions (delete)
    └── loading.tsx           # Loading state
```

---

## 의존성

- next/link - 라우팅
- next/navigation - redirect, useSearchParams
- Material Symbols Outlined - 아이콘
- 공통 컴포넌트: Sidebar, Logo, Button, Badge
- Server Actions: getMyPosts, deletePost
- 유틸리티: formatDate
