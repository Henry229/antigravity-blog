# Blog Management System PRD

## 1. One-Liner

SimpleBlog helps 개인 블로거 및 1인 창작자들이 글을 빠르게 작성하고 발행할 수 있도록 도와, 콘텐츠 제작에만 집중할 수 있게 합니다.

---

## 2. The Problem

- **Who**: 개인 블로거, 1인 창작자, 사이드 프로젝트로 블로그를 운영하려는 개발자
- **Pain Point**: 기존 블로그 플랫폼들은 너무 많은 기능으로 복잡하거나(WordPress), 커스터마이징이 어렵거나(Medium), 직접 관리하기 번거로움
- **Current Solution**: WordPress(너무 무겁고 복잡), Medium(소유권 없음), Ghost(유료), 직접 개발(시간 소요)
- **Inadequacy**: 단순히 글을 쓰고 발행하는 것에 집중하는 가볍고 빠른 솔루션이 부족

---

## 3. The Solution

### Core User Loop
1. 글 작성 (Markdown)
2. 발행 클릭
3. 공개 URL로 즉시 접근 가능

### One Thing
**Markdown으로 빠르게 글을 쓰고, 즉시 웹에 발행하는 것**

### Differentiation
- 불필요한 기능 없이 글쓰기와 발행에만 집중
- Markdown 기반으로 개발자 친화적
- 셀프 호스팅으로 콘텐츠 완전 소유

---

## 4. Success Metric

| Metric | Target | Validation Threshold |
|--------|--------|---------------------|
| 첫 글 발행까지 시간 | 5분 이내 | 80% 사용자가 10분 내 첫 글 발행 |
| 주간 포스트 작성 | 2개 이상 | 30% 사용자가 일주일 내 재방문 |
| 글 작성 완료율 | 70% | 시작한 글의 70%가 발행됨 |

---

## 5. MVP Scope

### ✅ In Scope (Core User Loop Only)

| Feature | 이유 |
|---------|------|
| **Markdown 에디터** | 핵심 - 글 작성의 기본 |
| **글 발행/임시저장** | 핵심 - 글을 공개하거나 저장 |
| **글 목록 (대시보드)** | 핵심 - 작성한 글 관리 |
| **공개 블로그 페이지** | 핵심 - 발행된 글 표시 |
| **개별 포스트 URL** | 핵심 - 글 공유 가능 |
| **기본 인증 (Supabase Auth)** | 핵심 - 본인 글만 관리 |

### ❌ Out of Scope for v1

| Feature | 이유 |
|---------|------|
| 댓글 시스템 | 외부 서비스(Disqus 등)로 대체 가능, 추후 추가 |
| 이미지 업로드 | v1은 외부 이미지 URL 사용, 추후 Supabase Storage 연동 |
| 카테고리/태그 | 글이 충분히 쌓인 후 필요성 검증 |
| SEO 최적화 도구 | 기본 meta tag만, 고급 SEO는 추후 |
| RSS 피드 | 사용자 요청 시 추가 |
| 다국어 지원 | v1은 단일 언어 |
| 테마/커스텀 디자인 | 깔끔한 기본 디자인으로 시작 |
| 예약 발행 | 수동 발행으로 시작 |
| 분석/통계 대시보드 | Vercel Analytics 또는 외부 서비스로 대체 |
| 소셜 로그인 | 이메일 인증으로 시작 |

---

## 6. Tech Stack

```
Frontend/Backend: Next.js 15 (App Router, Server Components, Server Actions)
Database:         Supabase (PostgreSQL + Auth)
Deployment:       Vercel
Styling:          Tailwind CSS v4
```

### Additional Dependencies (최소화)

| Package | Purpose |
|---------|---------|
| `react-markdown` | Markdown 렌더링 |
| `@uiw/react-md-editor` | Markdown 에디터 UI |
| `gray-matter` (optional) | frontmatter 파싱 (필요시) |

---

## 7. Data Model

```sql
-- Users: Supabase Auth 기본 제공

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt VARCHAR(500),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);

-- RLS Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 본인 글만 수정/삭제 가능
CREATE POLICY "Users can manage own posts" ON posts
  FOR ALL USING (auth.uid() = user_id);

-- 발행된 글은 누구나 읽기 가능
CREATE POLICY "Published posts are public" ON posts
  FOR SELECT USING (status = 'published');
```

---

## 8. User Flow

```
┌─────────────────────────────────────────────────────────┐
│                    User Flow (5 Steps)                  │
└─────────────────────────────────────────────────────────┘

1. 로그인/회원가입
   └── Supabase Auth (이메일)

2. 대시보드 진입
   └── 글 목록 확인 (draft/published)

3. 새 글 작성
   └── Markdown 에디터에서 제목 + 본문 작성

4. 발행 클릭
   └── slug 자동 생성, 즉시 공개

5. 공개 URL 확인
   └── /blog/[slug] 로 접근 가능
```

---

## 9. Page Structure

```
/                     → 랜딩 페이지 (블로그 소개)
/blog                 → 공개 글 목록
/blog/[slug]          → 개별 포스트 페이지

/login                → 로그인
/signup               → 회원가입

/dashboard            → 내 글 목록 (Protected)
/dashboard/new        → 새 글 작성 (Protected)
/dashboard/edit/[id]  → 글 수정 (Protected)
```

---

## 10. API Endpoints (Server Actions)

```typescript
// 글 관리
createPost(title, content)      → Post
updatePost(id, title, content)  → Post
deletePost(id)                  → void
publishPost(id)                 → Post
unpublishPost(id)               → Post

// 글 조회
getMyPosts()                    → Post[]
getPublishedPosts()             → Post[]
getPostBySlug(slug)             → Post | null
```

---

## 11. Launch Plan

### Week 1: Core Build

| Day | Task |
|-----|------|
| Day 1 | 프로젝트 셋업 (Next.js + Supabase + Vercel) |
| Day 2 | 인증 구현 (로그인/회원가입) |
| Day 3 | 글 작성/저장 기능 (Markdown 에디터) |
| Day 4 | 글 발행 + 공개 페이지 |
| Day 5 | 대시보드 UI 완성 |
| Day 6-7 | 버그 수정 + 배포 |

### Launch Target
**Week 1 끝** - 핵심 기능만으로 배포

### First Users
- 개발자 커뮤니티 (Discord, Slack)
- 트위터/X 공유
- Product Hunt (간단한 런칭)

### Success Threshold
- 10명의 사용자가 글 2개 이상 발행
- 발행된 글의 50%가 공유됨

---

## 12. Post-MVP Roadmap (User Request 기반)

| Priority | Feature | Trigger |
|----------|---------|---------|
| P1 | 이미지 업로드 | 5명 이상 요청 시 |
| P1 | 카테고리/태그 | 글 10개 이상 작성 사용자 요청 시 |
| P2 | RSS 피드 | 3명 이상 요청 시 |
| P2 | 커스텀 도메인 | 5명 이상 요청 시 |
| P3 | 댓글 시스템 | 10명 이상 요청 시 |
| P3 | 소셜 로그인 | 5명 이상 요청 시 |

---

## 13. Launch Readiness Checklist

- [ ] Core user loop works (작성 → 발행 → 공개)
- [ ] 한 문장으로 설명 가능 ("Markdown으로 빠르게 블로그 글 발행")
- [ ] Success metric 정의됨
- [ ] Happy path에 버그 없음
- [ ] 모바일 반응형 완료

---

## 14. Claude Code Starter Prompt

```
나는 Next.js 15 + Supabase + Vercel 스택으로 간단한 블로그 관리 시스템을 만들려고 해.

핵심 기능:
1. Supabase Auth로 이메일 로그인/회원가입
2. Markdown 에디터로 글 작성
3. 글 발행/임시저장
4. 대시보드에서 내 글 관리
5. /blog/[slug]에서 공개 글 보기

Tech Stack:
- Next.js 15 (App Router, Server Components, Server Actions)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS v4
- react-markdown, @uiw/react-md-editor

Data Model:
- posts 테이블: id, user_id, title, slug, content, excerpt, status, published_at, created_at, updated_at

Page Structure:
- / (랜딩)
- /blog (공개 글 목록)
- /blog/[slug] (개별 포스트)
- /login, /signup
- /dashboard (내 글 목록)
- /dashboard/new (새 글)
- /dashboard/edit/[id] (글 수정)

프로젝트를 셋업하고 인증부터 시작해줘.
```

---

## Summary

> **SimpleBlog**는 개인 블로거가 Markdown으로 빠르게 글을 쓰고 즉시 발행할 수 있는 미니멀 블로그 플랫폼입니다.
>
> MVP는 **글 작성 → 발행 → 공개**라는 핵심 루프에만 집중하며, 1주일 내 배포를 목표로 합니다.
>
> 댓글, 이미지 업로드, 카테고리 등은 사용자 피드백을 받은 후 추가합니다.