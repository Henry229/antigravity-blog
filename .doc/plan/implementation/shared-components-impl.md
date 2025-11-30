# 공통 컴포넌트 구현 계획

## 개요

SimpleBlog 애플리케이션에서 공통으로 사용되는 UI 컴포넌트 상세 구현 계획.

| 컴포넌트 | 사용 페이지 |
|----------|-------------|
| Button | 모든 페이지 (7/7) |
| Logo | 모든 페이지 (7/7) |
| Input | login, signup, post-editor (3/7) |
| Header | landing, blog-list, single-post (3/7) |
| Footer | landing, blog-list, single-post (3/7) |
| AuthCard | login, signup (2/7) |
| Card | landing, blog-list (2/7) |
| Badge | dashboard (1/7) |
| Sidebar | dashboard (1/7) |

---

## 의존성 설치

```bash
# shadcn/ui 초기화 (아직 안 했다면)
npx shadcn@latest init

# shadcn/ui 컴포넌트 설치
npx shadcn@latest add button input card badge

# npm packages
npm install lucide-react
```

### 참고: Material Symbols 대신 Lucide React 사용

HTML에서 `material-symbols-outlined`를 사용하지만, React 프로젝트에서는 `lucide-react`로 대체합니다.

| Material Symbol | Lucide Icon |
|-----------------|-------------|
| `article` | `FileText` |
| `edit` | `PenLine` |
| `folder` | `Folder` |
| `draft` | `FileEdit` |
| `publish` | `Send` |

---

## Task List

### 1. Logo

**상태:** - [ ] 미완료
**파일:** `components/ui/Logo.tsx`
**사용처:** 모든 페이지 (7/7)

**요구사항:**
- [ ] 아이콘 (lucide: FileText 또는 PenLine)
- [ ] 텍스트 "SimpleBlog"
- [ ] 링크로 감싸기 (홈으로 이동)
- [ ] 사이즈 variants (sm, md, lg)
- [ ] 다크모드 지원

**Props Interface:**

```typescript
export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  icon?: 'article' | 'edit';
  showText?: boolean;
  className?: string;
}
```

**스타일:**

| Size | Icon Size | Text Size | Gap |
|------|-----------|-----------|-----|
| sm | 20px | text-base | gap-1.5 |
| md | 24px | text-lg | gap-2 |
| lg | 32px | text-xl | gap-2.5 |

**기본 구조:**

```typescript
import Link from "next/link"
import { FileText, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

const sizeConfig = {
  sm: { icon: 20, text: "text-base", gap: "gap-1.5" },
  md: { icon: 24, text: "text-lg", gap: "gap-2" },
  lg: { icon: 32, text: "text-xl", gap: "gap-2.5" },
}

export function Logo({
  size = 'md',
  icon = 'article',
  showText = true,
  className
}: LogoProps) {
  const config = sizeConfig[size]
  const IconComponent = icon === 'article' ? FileText : PenLine

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center",
        config.gap,
        className
      )}
    >
      <IconComponent
        size={config.icon}
        className="text-primary"
      />
      {showText && (
        <span className={cn(
          "font-bold text-gray-900 dark:text-white",
          config.text
        )}>
          SimpleBlog
        </span>
      )}
    </Link>
  )
}
```

**완료 조건:**
- [ ] 모든 사이즈 variant 정상 렌더링
- [ ] 클릭 시 홈으로 이동
- [ ] 다크모드에서 텍스트 색상 변경

---

### 2. Button

**상태:** - [ ] 미완료
**파일:** `components/ui/Button.tsx`
**사용처:** 모든 페이지 (7/7)

**요구사항:**
- [ ] 4가지 variant (primary, secondary, ghost, danger)
- [ ] 3가지 size (sm, md, lg)
- [ ] fullWidth 옵션
- [ ] disabled 상태
- [ ] loading 상태 (spinner)
- [ ] asChild 지원 (Link와 함께 사용)

**Props Interface:**

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
}
```

**스타일:**

| Variant | Background | Text | Border | Hover |
|---------|------------|------|--------|-------|
| primary | bg-primary | text-white | - | hover:bg-primary/90 |
| secondary | bg-transparent | text-gray-800 | border-gray-300 | hover:bg-gray-100 |
| ghost | bg-transparent | text-gray-800 | - | hover:bg-gray-100 |
| danger | bg-red-600 | text-white | - | hover:bg-red-700 |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | h-8 | px-3 | text-xs |
| md | h-10 | px-4 | text-sm |
| lg | h-12 | px-6 | text-base |

**기본 구조:**

```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const variantStyles = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800",
  ghost: "bg-transparent text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
}

const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"
```

**완료 조건:**
- [ ] 모든 variant 스타일 정상 적용
- [ ] loading 상태에서 spinner 표시
- [ ] disabled 상태에서 클릭 불가
- [ ] asChild로 Link와 함께 사용 가능

---

### 3. Input

**상태:** - [ ] 미완료
**파일:** `components/ui/Input.tsx`
**사용처:** login, signup, post-editor (3/7)

**요구사항:**
- [ ] label 지원
- [ ] error 메시지 표시
- [ ] disabled 상태
- [ ] 다양한 type (text, email, password, url)
- [ ] required 표시 (*)
- [ ] react-hook-form 호환

**Props Interface:**

```typescript
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

**스타일:**

| 속성 | 값 |
|------|-----|
| Border | rounded-lg border-gray-300 |
| Focus | focus:border-primary focus:ring-primary |
| Shadow | shadow-sm |
| Label | text-sm font-medium text-gray-700 |
| Error | text-sm text-red-600 |

**기본 구조:**

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, required, id, ...props }, ref) => {
    const inputId = id || React.useId()

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm",
            "placeholder:text-gray-400",
            "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-white",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
```

**완료 조건:**
- [ ] label 정상 표시
- [ ] error 상태 스타일 적용
- [ ] react-hook-form register와 호환
- [ ] 다크모드 지원

---

### 4. Card

**상태:** - [ ] 미완료
**파일:** `components/ui/Card.tsx`
**사용처:** landing, blog-list (2/7)

**요구사항:**
- [ ] 기본 카드 컨테이너
- [ ] CardHeader, CardContent, CardFooter 서브 컴포넌트
- [ ] hover 효과 옵션
- [ ] 다크모드 지원

**Props Interface:**

```typescript
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}
```

**스타일:**

| 속성 | 값 |
|------|-----|
| Border | rounded-lg border border-gray-200/80 |
| Background | bg-white dark:bg-gray-800 |
| Shadow | shadow-sm |
| Hover (optional) | hover:shadow-md transition-shadow |

**기본 구조:**

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({
  className,
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200/80 bg-white shadow-sm",
        "dark:border-gray-700 dark:bg-gray-800",
        hoverable && "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}
```

**완료 조건:**
- [ ] 기본 카드 스타일 정상 적용
- [ ] hoverable 옵션 동작
- [ ] 서브 컴포넌트 조합 가능
- [ ] 다크모드 지원

---

### 5. Badge

**상태:** - [ ] 미완료
**파일:** `components/ui/Badge.tsx`
**사용처:** dashboard (1/7)

**요구사항:**
- [ ] 4가지 variant (success, warning, error, default)
- [ ] 컴팩트한 pill 형태
- [ ] 다크모드 지원

**Props Interface:**

```typescript
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'default';
}
```

**스타일:**

| Variant | Background | Text |
|---------|------------|------|
| success (published) | bg-green-100 | text-green-800 |
| default (draft) | bg-gray-100 | text-gray-800 |
| warning | bg-yellow-100 | text-yellow-800 |
| error | bg-red-100 | text-red-800 |

**기본 구조:**

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

const variantStyles = {
  success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
```

**완료 조건:**
- [ ] 모든 variant 스타일 정상 적용
- [ ] pill 형태 유지
- [ ] 다크모드 지원

---

### 6. Header

**상태:** - [ ] 미완료
**파일:** `components/layout/Header.tsx`
**사용처:** landing, blog-list, single-post (3/7)

**요구사항:**
- [ ] Logo 컴포넌트 포함
- [ ] 네비게이션 링크 (Home, Login/Signup 또는 Dashboard)
- [ ] 로그인 상태에 따른 조건부 렌더링
- [ ] Sticky 포지션 + backdrop-blur
- [ ] 다크모드 지원
- [ ] variant (public, landing) 지원

**Props Interface:**

```typescript
export interface HeaderProps {
  variant?: 'public' | 'landing';
}
```

**스타일:**

| 속성 | 값 |
|------|-----|
| Height | 64px (h-16) |
| Max Width | max-w-5xl |
| Background | bg-white/80 backdrop-blur-sm |
| Border | border-b border-gray-200/50 |
| Position | sticky top-0 z-10 |

**기본 구조:**

```typescript
import Link from "next/link"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/Button"

export function Header({ variant = 'public' }: HeaderProps) {
  // TODO: 실제 인증 상태 확인 (Supabase Auth)
  const isAuthenticated = false

  return (
    <header className="sticky top-0 z-10 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo
          icon={variant === 'landing' ? 'edit' : 'article'}
          size="md"
        />

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {variant === 'landing' ? (
            // Landing 페이지: Login/SignUp 버튼
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="primary" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            // Public 페이지: 네비게이션 링크
            <>
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                Home
              </Link>
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

**완료 조건:**
- [ ] 모든 variant 정상 렌더링
- [ ] sticky 포지션 동작
- [ ] backdrop-blur 효과
- [ ] 다크모드 지원
- [ ] 로그인 상태 조건부 렌더링 (Supabase 연동 후)

---

### 7. Footer

**상태:** - [ ] 미완료
**파일:** `components/layout/Footer.tsx`
**사용처:** landing, blog-list, single-post (3/7)

**요구사항:**
- [ ] 저작권 텍스트
- [ ] 링크 목록 (About, Contact, Privacy)
- [ ] 반응형 (모바일: 세로 정렬)
- [ ] 다크모드 지원

**스타일:**

| 속성 | 값 |
|------|-----|
| Border | border-t border-gray-200/80 |
| Padding | py-8 |
| Text | text-sm text-gray-500 |
| Max Width | max-w-5xl |

**기본 구조:**

```typescript
import Link from "next/link"

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto w-full border-t border-gray-200/80 dark:border-gray-800/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} SimpleBlog. All rights reserved.
        </p>
        <nav className="flex gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
```

**완료 조건:**
- [ ] 저작권 연도 자동 업데이트
- [ ] 모바일에서 세로 정렬
- [ ] 다크모드 지원

---

### 8. AuthCard

**상태:** - [ ] 미완료
**파일:** `components/layout/AuthCard.tsx`
**사용처:** login, signup (2/7)

**요구사항:**
- [ ] 중앙 정렬 레이아웃
- [ ] 로고 상단 배치
- [ ] 카드 컨테이너 (white, shadow, rounded-xl)
- [ ] 제목 영역
- [ ] 폼 영역 (children)
- [ ] 하단 링크 영역 (footer)

**Props Interface:**

```typescript
export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**스타일:**

| 속성 | 값 |
|------|-----|
| Max Width | max-w-md |
| Card Border | rounded-xl border border-gray-200 |
| Card Shadow | shadow-sm |
| Card Padding | p-6 sm:p-8 |

**기본 구조:**

```typescript
import { Logo } from "@/components/ui/Logo"

export function AuthCard({
  title,
  subtitle,
  children,
  footer
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" icon="edit" />
        </div>

        {/* Card */}
        <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="mt-8">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**완료 조건:**
- [ ] 중앙 정렬 정상 동작
- [ ] 로고 상단 표시
- [ ] 반응형 패딩 (모바일 p-6, 데스크탑 p-8)
- [ ] 다크모드 지원

---

### 9. Sidebar

**상태:** - [ ] 미완료
**파일:** `components/layout/Sidebar.tsx`
**사용처:** dashboard (1/7)

**요구사항:**
- [ ] 로고 영역
- [ ] 네비게이션 아이템 (All Posts, Drafts, Published)
- [ ] Active 상태 표시
- [ ] 아이콘 포함
- [ ] 반응형 (모바일에서 숨김 - v2에서 drawer 구현)

**Nav Items:**

| Label | Icon (Lucide) | Route | Filter |
|-------|---------------|-------|--------|
| All Posts | Folder | /dashboard | all |
| Drafts | FileEdit | /dashboard?status=draft | draft |
| Published | Send | /dashboard?status=published | published |

**Props Interface:**

```typescript
export interface SidebarProps {
  currentFilter?: 'all' | 'draft' | 'published';
}
```

**스타일:**

| 속성 | 값 |
|------|-----|
| Width | w-64 |
| Border | border-r border-gray-200 |
| Background | bg-white |
| Active | bg-blue-100 text-primary |

**기본 구조:**

```typescript
"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Folder, FileEdit, Send } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "All Posts",
    icon: Folder,
    href: "/dashboard",
    filter: "all"
  },
  {
    label: "Drafts",
    icon: FileEdit,
    href: "/dashboard?status=draft",
    filter: "draft"
  },
  {
    label: "Published",
    icon: Send,
    href: "/dashboard?status=published",
    filter: "published"
  },
]

export function Sidebar() {
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('status') || 'all'

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:block">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentFilter === item.filter
            const Icon = item.icon

            return (
              <li key={item.filter}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-primary dark:bg-blue-900/30"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
```

**완료 조건:**
- [ ] 네비게이션 아이템 정상 렌더링
- [ ] Active 상태 스타일 적용
- [ ] URL query parameter에 따른 active 상태 변경
- [ ] 모바일에서 숨김 (md:block)
- [ ] 다크모드 지원

---

## 유틸리티 함수

### cn (className merge utility)

**파일:** `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**의존성 설치:**

```bash
npm install clsx tailwind-merge
```

---

## 📁 파일 구조 요약

```
components/
├── layout/
│   ├── Header.tsx          # Public 헤더 (sticky, backdrop-blur)
│   ├── Footer.tsx          # 공통 푸터
│   ├── Sidebar.tsx         # Dashboard 사이드바
│   └── AuthCard.tsx        # 인증 페이지 카드 레이아웃
└── ui/
    ├── Logo.tsx            # 로고 (size variants)
    ├── Button.tsx          # 버튼 (4 variants, 3 sizes)
    ├── Input.tsx           # 입력 필드 (label, error)
    ├── Card.tsx            # 카드 (CardHeader, CardContent, CardFooter)
    └── Badge.tsx           # 상태 배지 (4 variants)

lib/
└── utils.ts                # cn 유틸리티 함수
```

---

## 구현 순서

1. **lib/utils.ts** - cn 유틸리티 함수 (모든 컴포넌트에서 사용)
2. **Logo** - 모든 페이지에서 사용
3. **Button** - 모든 페이지에서 사용
4. **Input** - 인증 + 에디터에서 사용
5. **Card** - 블로그 리스트에서 사용
6. **Badge** - 대시보드에서 사용
7. **Header** - Public 페이지
8. **Footer** - Public 페이지
9. **AuthCard** - 인증 페이지
10. **Sidebar** - 대시보드

---

## 검증 체크리스트

### UI Components
- [ ] Logo: 모든 size variant, 클릭 동작
- [ ] Button: 모든 variant/size, loading/disabled 상태
- [ ] Input: label/error 표시, react-hook-form 호환
- [ ] Card: 서브 컴포넌트 조합, hoverable 동작
- [ ] Badge: 모든 variant 스타일

### Layout Components
- [ ] Header: sticky 동작, backdrop-blur, variant 전환
- [ ] Footer: 반응형 레이아웃, 링크 동작
- [ ] AuthCard: 중앙 정렬, 폼 영역 정상 동작
- [ ] Sidebar: active 상태, 필터 연동

### 공통
- [ ] 모든 컴포넌트 다크모드 지원
- [ ] TypeScript 타입 정의 완료
- [ ] 접근성 (ARIA 속성, 키보드 네비게이션)

---

## 의존성 요약

### npm packages

```bash
npm install lucide-react clsx tailwind-merge
```

### shadcn/ui (선택)

만약 shadcn/ui를 사용하려면:

```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge
```

> **참고**: 이 구현 계획에서는 커스텀 컴포넌트를 직접 구현합니다. shadcn/ui 스타일을 참고하되, 프로젝트 요구사항에 맞게 조정했습니다.

---

## Tailwind CSS v4 설정

**globals.css**에 primary 색상 정의 필요:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: #4A90E2;
}
```

또는 `tailwind.config.ts`에서:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
      },
    },
  },
}
```
