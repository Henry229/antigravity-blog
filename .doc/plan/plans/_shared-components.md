# 공통 컴포넌트 (Shared Components)

## 개요

여러 페이지에서 공유되는 컴포넌트 목록. HTML 분석 결과 기반.

---

## 1. Header (Public)

**발견 위치**: landing.html, blog-list.html, single-post.html (3/7)
**파일**: `components/layout/Header.tsx`

### HTML에서 추출

```html
<header class="sticky top-0 z-10 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
  <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-4">
      <span class="material-symbols-outlined text-primary text-2xl">article</span>
      <a class="text-lg font-bold text-[#1F2937] dark:text-gray-100" href="#">SimpleBlog</a>
    </div>
    <nav class="flex items-center gap-6 text-sm font-medium">
      <a class="text-gray-600 hover:text-primary" href="#">Home</a>
      <a class="text-gray-600 hover:text-primary" href="#">Login</a>
    </nav>
  </div>
</header>
```

### 구현 요구사항

- [ ] Logo 컴포넌트 포함 (아이콘 + 텍스트)
- [ ] 네비게이션 링크 (Home, Login/Signup 또는 Dashboard)
- [ ] 로그인 상태에 따른 조건부 렌더링
- [ ] Sticky 포지션 + backdrop-blur
- [ ] 다크모드 지원
- [ ] 반응형 (모바일 햄버거 메뉴 - v2)

### Props Interface

```typescript
interface HeaderProps {
  variant?: 'public' | 'landing';
  showNav?: boolean;
}
```

### 스타일

| 속성 | 값 |
|------|-----|
| Height | 64px (h-16) |
| Max Width | max-w-5xl |
| Background | bg-white/80 backdrop-blur-sm |
| Border | border-b border-gray-200/50 |
| Position | sticky top-0 z-10 |

---

## 2. Header (Landing)

**발견 위치**: landing.html (1/7)
**파일**: `components/layout/Header.tsx` (variant='landing')

### HTML에서 추출

```html
<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
  <div class="flex items-center gap-2 text-gray-900 dark:text-white">
    <span class="material-symbols-outlined text-primary text-2xl">edit</span>
    <h2 class="text-xl font-bold">SimpleBlog</h2>
  </div>
  <div class="flex flex-1 justify-end gap-2">
    <button class="... bg-transparent text-gray-800 hover:bg-gray-100">Login</button>
    <button class="... bg-primary text-white">Sign Up</button>
  </div>
</header>
```

### 차이점
- Login/Sign Up 버튼 표시
- 아이콘이 `edit` (pen icon)

---

## 3. Footer

**발견 위치**: landing.html, blog-list.html, single-post.html (3/7)
**파일**: `components/layout/Footer.tsx`

### HTML에서 추출

```html
<footer class="mt-auto w-full border-t border-gray-200/80 dark:border-gray-800/50">
  <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
    <p class="text-sm text-[#64748B]">© 2024 SimpleBlog. All rights reserved.</p>
    <div class="flex gap-6">
      <a class="text-sm text-[#64748B] hover:text-primary" href="#">About</a>
      <a class="text-sm text-[#64748B] hover:text-primary" href="#">Contact</a>
      <a class="text-sm text-[#64748B] hover:text-primary" href="#">Privacy Policy</a>
    </div>
  </div>
</footer>
```

### 구현 요구사항

- [ ] 저작권 텍스트
- [ ] 링크 목록 (About, Contact, Privacy)
- [ ] 반응형 (모바일: 세로 정렬)
- [ ] 다크모드 지원

### 스타일

| 속성 | 값 |
|------|-----|
| Border | border-t border-gray-200/80 |
| Padding | py-8 |
| Text | text-sm text-[#64748B] |

---

## 4. Logo

**발견 위치**: 모든 페이지 (7/7)
**파일**: `components/ui/Logo.tsx`

### HTML에서 추출

```html
<div class="flex items-center gap-2">
  <span class="material-symbols-outlined text-primary text-2xl">article</span>
  <span class="text-lg font-bold text-gray-900 font-display">SimpleBlog</span>
</div>
```

### 구현 요구사항

- [ ] 아이콘 (Material Symbols: article 또는 edit)
- [ ] 텍스트 "SimpleBlog"
- [ ] 링크로 감싸기 (홈으로 이동)
- [ ] 사이즈 variants (sm, md, lg)

### Props Interface

```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  icon?: 'article' | 'edit';
  showText?: boolean;
}
```

---

## 5. Button

**발견 위치**: 모든 페이지 (7/7)
**파일**: `components/ui/Button.tsx`

### Variants 발견

#### Primary Button
```html
<button class="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold">
  Sign Up
</button>
```

#### Secondary/Outlined Button
```html
<button class="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100">
  Read Blog
</button>
```

#### Ghost Button
```html
<button class="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-transparent text-gray-800 hover:bg-gray-100">
  Login
</button>
```

### Props Interface

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}
```

### 스타일

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| primary | bg-primary | text-white | - |
| secondary | bg-transparent | text-gray-800 | border-gray-300 |
| ghost | bg-transparent | text-gray-800 | - |
| danger | bg-red-600 | text-white | - |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | h-8 | px-3 | text-xs |
| md | h-10 | px-4 | text-sm |
| lg | h-12 | px-6 | text-base |

---

## 6. Input

**발견 위치**: login.html, signup.html, post-editor.html (3/7)
**파일**: `components/ui/Input.tsx`

### HTML에서 추출

```html
<div>
  <label class="mb-1.5 block text-sm font-medium text-gray-700" for="email">
    Email address
  </label>
  <input 
    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary" 
    id="email" 
    placeholder="you@example.com" 
    type="email"
  />
</div>
```

### Props Interface

```typescript
interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'url';
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### 스타일

| 속성 | 값 |
|------|-----|
| Border | rounded-lg border-gray-300 |
| Focus | focus:border-primary focus:ring-primary |
| Shadow | shadow-sm |
| Label | text-sm font-medium text-gray-700 |

---

## 7. Card

**발견 위치**: landing.html (features), blog-list.html (posts) (2/7)
**파일**: `components/ui/Card.tsx`

### HTML에서 추출 (Blog Post Card)

```html
<div class="rounded-lg border border-gray-200/80 bg-white p-6 shadow-sm">
  <div class="flex flex-col gap-2">
    <a class="text-2xl font-bold text-primary hover:underline" href="#">Title</a>
    <p class="text-base leading-relaxed text-[#1F2937]">Excerpt...</p>
    <p class="text-sm text-[#64748B]">October 26, 2023 · 5 min read</p>
  </div>
</div>
```

### Props Interface

```typescript
interface CardProps {
  variant?: 'default' | 'feature' | 'post';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

### 스타일

| 속성 | 값 |
|------|-----|
| Border | rounded-lg border border-gray-200/80 |
| Background | bg-white |
| Shadow | shadow-sm |
| Padding | p-6 |

---

## 8. Badge

**발견 위치**: dashboard.html (2/7)
**파일**: `components/ui/Badge.tsx`

### HTML에서 추출

```html
<!-- Published -->
<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
  Published
</span>

<!-- Draft -->
<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
  Draft
</span>
```

### Props Interface

```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'default';
  children: React.ReactNode;
}
```

### 스타일

| Variant | Background | Text |
|---------|------------|------|
| success (published) | bg-green-100 | text-green-800 |
| default (draft) | bg-gray-100 | text-gray-800 |
| warning | bg-yellow-100 | text-yellow-800 |
| error | bg-red-100 | text-red-800 |

---

## 9. Sidebar (Dashboard)

**발견 위치**: dashboard.html (1/7)
**파일**: `components/layout/Sidebar.tsx`

### HTML에서 추출

```html
<aside class="w-64 flex-shrink-0 border-r border-gray-200 bg-background-light">
  <div class="flex h-16 items-center border-b border-gray-200 px-6">
    <!-- Logo -->
  </div>
  <nav class="p-4">
    <ul class="space-y-1">
      <li>
        <a class="flex items-center gap-3 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-primary" href="#">
          <span class="material-symbols-outlined text-base">folder</span>
          <span>All Posts</span>
        </a>
      </li>
      <!-- More nav items -->
    </ul>
  </nav>
</aside>
```

### 구현 요구사항

- [ ] 로고 영역
- [ ] 네비게이션 아이템 (All Posts, Drafts, Published)
- [ ] Active 상태 표시
- [ ] 아이콘 포함
- [ ] 반응형 (모바일에서 숨김 또는 drawer)

### Nav Items

| Label | Icon | Route | Filter |
|-------|------|-------|--------|
| All Posts | folder | /dashboard | all |
| Drafts | draft | /dashboard?status=draft | draft |
| Published | publish | /dashboard?status=published | published |

---

## 10. AuthCard

**발견 위치**: login.html, signup.html (2/7)
**파일**: `components/layout/AuthCard.tsx`

### HTML에서 추출

```html
<div class="w-full max-w-md">
  <div class="mb-8 text-center">
    <!-- Logo -->
  </div>
  <div class="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
    </div>
    <form class="mt-8 space-y-4">
      <!-- Form fields -->
    </form>
    <div class="mt-6 text-center text-sm text-gray-600">
      <!-- Links -->
    </div>
  </div>
</div>
```

### 구현 요구사항

- [ ] 중앙 정렬 레이아웃
- [ ] 로고 상단 배치
- [ ] 카드 컨테이너 (white, shadow, rounded-xl)
- [ ] 제목 영역
- [ ] 폼 영역
- [ ] 하단 링크 영역

### Props Interface

```typescript
interface AuthCardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

---

## 📁 공통 컴포넌트 파일 구조

```
components/
├── layout/
│   ├── Header.tsx          # Public 헤더
│   ├── Footer.tsx          # 공통 푸터
│   ├── Sidebar.tsx         # Dashboard 사이드바
│   └── AuthCard.tsx        # 인증 페이지 카드 레이아웃
└── ui/
    ├── Logo.tsx            # 로고
    ├── Button.tsx          # 버튼 (variants)
    ├── Input.tsx           # 입력 필드
    ├── Card.tsx            # 카드
    └── Badge.tsx           # 상태 배지
```

---

## ✅ 구현 체크리스트

### Layout Components
- [ ] Header.tsx
- [ ] Footer.tsx
- [ ] Sidebar.tsx
- [ ] AuthCard.tsx

### UI Components
- [ ] Logo.tsx
- [ ] Button.tsx (all variants)
- [ ] Input.tsx
- [ ] Card.tsx
- [ ] Badge.tsx

### 우선순위

1. **Button** - 모든 페이지에서 사용
2. **Logo** - 모든 페이지에서 사용
3. **Input** - 인증 + 에디터에서 사용
4. **Header** - Public 페이지
5. **Footer** - Public 페이지
6. **AuthCard** - 인증 페이지
7. **Card** - 블로그 리스트
8. **Badge** - 대시보드
9. **Sidebar** - 대시보드
