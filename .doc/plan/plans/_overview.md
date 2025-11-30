# SimpleBlog 구현 계획 개요

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **프로젝트명** | SimpleBlog |
| **설명** | 개인 블로거를 위한 미니멀 Markdown 블로그 플랫폼 |
| **PRD** | blog-management-prd.md |
| **UI 소스** | Stitch HTML outputs |
| **생성일** | 2024 |

## 📊 페이지 목록

| 페이지 | 계획 파일 | HTML 소스 | User Flow | Route | 상태 |
|--------|----------|----------|-----------|-------|------|
| Landing | [landing-page.md](./landing-page.md) | landing.html | - | `/` | ⬜ |
| Blog List | [bloglist-page.md](./bloglist-page.md) | blog-list.html | Step 5 | `/blog` | ⬜ |
| Single Post | [singlepost-page.md](./singlepost-page.md) | single-post.html | Step 5 | `/blog/[slug]` | ⬜ |
| Login | [login-page.md](./login-page.md) | login.html | Step 1 | `/login` | ⬜ |
| Signup | [signup-page.md](./signup-page.md) | signup.html | Step 1 | `/signup` | ⬜ |
| Dashboard | [dashboard-page.md](./dashboard-page.md) | dashboard.html | Step 2 | `/dashboard` | ⬜ |
| Post Editor | [posteditor-page.md](./posteditor-page.md) | post-editor.html | Step 3-4 | `/dashboard/new`, `/dashboard/edit/[id]` | ⬜ |

## 📁 최종 파일 구조

```
app/
├── page.tsx                          # Landing
├── blog/
│   ├── page.tsx                      # Blog List
│   └── [slug]/
│       └── page.tsx                  # Single Post
├── login/
│   └── page.tsx                      # Login
├── signup/
│   └── page.tsx                      # Signup
├── dashboard/
│   ├── page.tsx                      # Dashboard
│   ├── new/
│   │   └── page.tsx                  # New Post
│   └── edit/
│       └── [id]/
│           └── page.tsx              # Edit Post
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # 공통 헤더
│   │   ├── Footer.tsx                # 공통 푸터
│   │   └── Sidebar.tsx               # Dashboard 사이드바
│   └── ui/
│       ├── Button.tsx                # 버튼 컴포넌트
│       ├── Input.tsx                 # 입력 필드
│       ├── Card.tsx                  # 카드 컴포넌트
│       ├── Badge.tsx                 # 상태 배지
│       └── Logo.tsx                  # 로고
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase 클라이언트
│   │   └── server.ts                 # Server-side Supabase
│   └── utils.ts                      # 유틸리티 함수
├── types/
│   └── index.ts                      # TypeScript 타입 정의
└── actions/
    ├── auth.ts                       # 인증 Server Actions
    └── posts.ts                      # 포스트 Server Actions
```

## ✅ 구현 순서

### Phase 1: 기초 설정
- [ ] Next.js 15 프로젝트 초기화
- [ ] Supabase 연결 설정
- [ ] Tailwind CSS v4 설정
- [ ] TypeScript 타입 정의

### Phase 2: 공통 컴포넌트
- [ ] 공통 컴포넌트 ([_shared-components.md](./_shared-components.md))

### Phase 3: 인증
- [ ] Login Page ([login-page.md](./login-page.md))
- [ ] Signup Page ([signup-page.md](./signup-page.md))

### Phase 4: 공개 페이지
- [ ] Landing Page ([landing-page.md](./landing-page.md))
- [ ] Blog List Page ([bloglist-page.md](./bloglist-page.md))
- [ ] Single Post Page ([singlepost-page.md](./singlepost-page.md))

### Phase 5: 대시보드
- [ ] Dashboard Page ([dashboard-page.md](./dashboard-page.md))
- [ ] Post Editor Page ([posteditor-page.md](./posteditor-page.md))

### Phase 6: 마무리
- [ ] Server Actions 연결
- [ ] 에러 처리
- [ ] 반응형 테스트
- [ ] 배포

## 🎨 디자인 시스템 요약

| 속성 | 값 |
|------|-----|
| **Primary Color** | `#2563EB` |
| **Background Light** | `#F8FAFC` |
| **Text Primary** | `#1F2937` |
| **Text Secondary** | `#64748B` |
| **Border** | `#E2E8F0` |
| **Success** | `#22C55E` |
| **Font Display** | Newsreader (serif) |
| **Font Sans** | Inter |
| **Border Radius** | 8px (lg: 12px) |
| **Base Spacing** | 16px |

## 📋 PRD 핵심 요약

### Core User Loop
1. 로그인/회원가입 → 2. 대시보드 → 3. 글 작성 → 4. 발행 → 5. 공개 URL

### Data Model
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

### Server Actions
```typescript
// 글 관리
createPost(title, content) → Post
updatePost(id, title, content) → Post
deletePost(id) → void
publishPost(id) → Post
unpublishPost(id) → Post

// 글 조회
getMyPosts() → Post[]
getPublishedPosts() → Post[]
getPostBySlug(slug) → Post | null
```
