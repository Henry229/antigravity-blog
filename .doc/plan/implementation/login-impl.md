# Login Page 구현 계획

## 개요

SimpleBlog 애플리케이션의 로그인 페이지 상세 구현 계획.

- **User Flow**: Step 1 - 로그인/회원가입
- **라우트**: `/login`
- **인증 필요**: ❌ (이미 로그인되어 있으면 `/dashboard`로 리다이렉트)
- **주요 기능**: 이메일/비밀번호 로그인, Supabase Auth 연동

---

## 페이지 구조 (plan-based-page에서)

```
- Body (bg-background-light, centered)
  - Container (max-w-md)
    - AuthCard
      - Logo (상단, 중앙 정렬)
      - Card
        - Heading: "Welcome back"
        - LoginForm
          - Email Input
          - Password Input
          - Error Message (조건부)
          - Submit Button
        - Footer Links
          - "Don't have an account? Sign up"
          - "Forgot password?"
```

---

## 의존성

### 신규 설치 필요

```bash
# Form 유효성 검사 (선택적이지만 권장)
npm install react-hook-form zod @hookform/resolvers
```

### 이미 설치됨 (shared-components-impl.md에서)

```bash
npm install lucide-react clsx tailwind-merge
```

### 공통 컴포넌트 Import 경로

| 컴포넌트 | Import Path |
|---------|-------------|
| AuthCard | `@/components/layout/AuthCard` |
| Input | `@/components/ui/Input` |
| Button | `@/components/ui/Button` |
| Logo | `@/components/ui/Logo` |

### 필요한 Server Actions

| Action | 파일 | 설명 |
|--------|------|------|
| `login` | `@/actions/auth` | 이메일/비밀번호 로그인 |

### Supabase 클라이언트

| 함수 | 파일 | 설명 |
|------|------|------|
| `createClient` | `@/lib/supabase/server` | Server-side Supabase 클라이언트 |

---

## Task List

### 0. 페이지 라우트 생성

**상태:** - [ ] 미완료
**파일:** `app/login/page.tsx`

**요구사항:**
- [ ] `app/login/` 폴더 생성
- [ ] `page.tsx` 생성 (Server Component)
- [ ] 이미 로그인된 사용자 리다이렉트 처리
- [ ] AuthCard 레이아웃 적용

**기본 구조:**

```typescript
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthCard } from "@/components/layout/AuthCard"
import { LoginForm } from "./LoginForm"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login | SimpleBlog",
  description: "Sign in to your SimpleBlog account",
}

export default async function LoginPage() {
  // 이미 로그인된 사용자 체크
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard"
      footer={
        <div className="space-y-2">
          <p>
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="text-gray-500 hover:text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
```

**완료 조건:**
- [ ] 페이지 정상 렌더링
- [ ] 로그인된 사용자 리다이렉트 동작
- [ ] AuthCard 레이아웃 적용

---

### 1. LoginForm 컴포넌트 (기본 버전)

**상태:** - [ ] 미완료
**파일:** `app/login/LoginForm.tsx`

**요구사항:**
- [ ] Client Component ("use client")
- [ ] Email 입력 필드
- [ ] Password 입력 필드
- [ ] Submit 버튼
- [ ] 에러 메시지 표시
- [ ] 로딩 상태 표시
- [ ] Server Action 연결

**Props Interface:**

```typescript
// Props 없음 (자체적으로 상태 관리)
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Form | space-y-4 |
| Button Container | pt-2 |
| Error Message | text-sm text-red-600 |

**기본 구조:**

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { login } from "@/actions/auth"

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="pt-2">
        <Button type="submit" fullWidth loading={loading}>
          Sign In
        </Button>
      </div>
    </form>
  )
}
```

**완료 조건:**
- [ ] 입력 필드 정상 동작
- [ ] 폼 제출 동작
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 표시

---

### 2. LoginForm 컴포넌트 (react-hook-form 버전 - 선택)

**상태:** - [ ] 미완료
**파일:** `app/login/LoginForm.tsx` (대체)

**요구사항:**
- [ ] react-hook-form 사용
- [ ] Zod 스키마 유효성 검사
- [ ] 실시간 입력 유효성 검사
- [ ] 더 나은 에러 처리

**기본 구조:**

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { login } from "@/actions/auth"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)

    const result = await login(formData)

    if (result?.error) {
      setServerError(result.error)
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        autoComplete="current-password"
        {...register("password")}
      />

      {serverError && (
        <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
      )}

      <div className="pt-2">
        <Button type="submit" fullWidth loading={isSubmitting}>
          Sign In
        </Button>
      </div>
    </form>
  )
}
```

**완료 조건:**
- [ ] 실시간 유효성 검사 동작
- [ ] 에러 메시지 필드별 표시
- [ ] 폼 제출 동작

---

### 3. Server Action - login

**상태:** - [ ] 미완료
**파일:** `actions/auth.ts`

**요구사항:**
- [ ] Supabase Auth `signInWithPassword` 호출
- [ ] 에러 처리 및 반환
- [ ] 성공 시 리다이렉트

**기본 구조:**

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}
```

**완료 조건:**
- [ ] Supabase Auth 연동
- [ ] 로그인 성공 시 리다이렉트
- [ ] 에러 메시지 반환

---

### 4. Supabase 서버 클라이언트 설정

**상태:** - [ ] 미완료
**파일:** `lib/supabase/server.ts`

**요구사항:**
- [ ] Server-side Supabase 클라이언트 생성
- [ ] 쿠키 기반 세션 관리

**기본 구조:**

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 호출된 경우 무시
          }
        },
      },
    }
  )
}
```

**의존성 설치:**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

**환경 변수 (.env.local):**

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**완료 조건:**
- [ ] Supabase 클라이언트 정상 생성
- [ ] 쿠키 세션 동작

---

### 5. Supabase 브라우저 클라이언트 설정

**상태:** - [ ] 미완료
**파일:** `lib/supabase/client.ts`

**요구사항:**
- [ ] Client-side Supabase 클라이언트 생성 (필요시)

**기본 구조:**

```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**완료 조건:**
- [ ] 브라우저에서 Supabase 클라이언트 동작

---

### 6. Middleware 설정 (세션 갱신)

**상태:** - [ ] 미완료
**파일:** `middleware.ts`

**요구사항:**
- [ ] 모든 요청에서 세션 갱신
- [ ] Protected routes 처리

**기본 구조:**

```typescript
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes 체크
  const protectedRoutes = ["/dashboard", "/posts"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

**완료 조건:**
- [ ] 세션 갱신 동작
- [ ] Protected routes 리다이렉트 동작

---

## 구현 순서

1. **Supabase 설정** - 환경 변수, 서버/클라이언트 설정
2. **Middleware 설정** - 세션 갱신, Protected routes
3. **Server Action 구현** - `login` 함수
4. **LoginForm 컴포넌트** - 기본 버전 또는 react-hook-form 버전
5. **Login Page 조립** - `app/login/page.tsx`
6. **테스트** - 로그인 플로우 전체 테스트

---

## 검증 체크리스트

### LoginForm
- [ ] Email 입력 필드 동작
- [ ] Password 입력 필드 동작
- [ ] 폼 제출 동작
- [ ] 로딩 상태 표시 (스피너)
- [ ] 에러 메시지 표시
- [ ] 유효성 검사 동작 (react-hook-form 버전)

### Login Page
- [ ] AuthCard 레이아웃 정상 표시
- [ ] Logo 표시
- [ ] "Welcome back" 제목 표시
- [ ] Footer 링크 동작 (Sign up, Forgot password)
- [ ] 이미 로그인된 사용자 리다이렉트

### Server Action
- [ ] Supabase Auth 연동
- [ ] 로그인 성공 시 `/dashboard` 리다이렉트
- [ ] 잘못된 이메일/비밀번호 에러 처리
- [ ] 존재하지 않는 사용자 에러 처리

### Supabase Integration
- [ ] 서버 클라이언트 동작
- [ ] 쿠키 세션 저장
- [ ] Middleware 세션 갱신

---

## 파일 구조 요약

```
app/
└── login/
    ├── page.tsx              # Login Page (Server Component)
    └── LoginForm.tsx         # Login Form (Client Component)

actions/
└── auth.ts                   # login, logout Server Actions

lib/
└── supabase/
    ├── server.ts             # Server-side Supabase 클라이언트
    └── client.ts             # Client-side Supabase 클라이언트

middleware.ts                 # 세션 갱신 및 Protected routes
```

---

## 스타일 요약

### Layout

| 요소 | 값 |
|------|-----|
| Body Background | bg-gray-50 (#F8FAFC) dark:bg-gray-900 |
| Container Max Width | max-w-md |
| Centering | flex min-h-screen items-center justify-center |

### AuthCard (shared-components-impl.md 참조)

| 요소 | 값 |
|------|-----|
| Border | rounded-xl border border-gray-200 |
| Background | bg-white dark:bg-gray-800 |
| Shadow | shadow-sm |
| Padding | p-6 sm:p-8 |

### Form

| 요소 | 값 |
|------|-----|
| Spacing | space-y-4 |
| Button Container | pt-2 |

### Typography

| 요소 | 스타일 |
|------|--------|
| Heading | text-2xl font-bold text-gray-900 dark:text-white |
| Subtitle | text-sm text-gray-600 dark:text-gray-400 |
| Footer Links | text-sm text-gray-600 |
| Link | text-primary hover:underline |
| Error | text-sm text-red-600 dark:text-red-400 |

---

## 공통 컴포넌트 의존성

이 페이지는 다음 공통 컴포넌트가 먼저 구현되어야 합니다:

1. **AuthCard** (`components/layout/AuthCard.tsx`) - 로그인/회원가입 레이아웃
2. **Input** (`components/ui/Input.tsx`) - 입력 필드 (label, error 지원)
3. **Button** (`components/ui/Button.tsx`) - 버튼 (loading, fullWidth 지원)
4. **Logo** (`components/ui/Logo.tsx`) - AuthCard 내부에서 사용

→ `shared-components-impl.md` 참조

---

## 에러 처리

### 예상 에러 메시지

| 상황 | 에러 메시지 |
|------|------------|
| 이메일 형식 오류 | "Please enter a valid email address" |
| 비밀번호 누락 | "Password is required" |
| 잘못된 자격 증명 | "Invalid login credentials" |
| 존재하지 않는 사용자 | "Invalid login credentials" |
| 이메일 미인증 | "Email not confirmed" |
| 네트워크 오류 | "An error occurred. Please try again." |

### 에러 표시 위치

- **필드별 에러**: 해당 Input 아래 (react-hook-form 버전)
- **서버 에러**: 폼 하단, Submit 버튼 위

---

## 보안 고려사항

- [ ] HTTPS 사용 (production)
- [ ] CSRF 토큰 (Supabase에서 자동 처리)
- [ ] Rate limiting (Supabase에서 자동 처리)
- [ ] Password 필드 autocomplete="current-password"
- [ ] 에러 메시지에서 구체적인 정보 노출 금지

---

## 추가 개선 사항 (선택)

### Phase 2: OAuth 로그인

- [ ] Google OAuth 버튼
- [ ] GitHub OAuth 버튼
- [ ] OAuth 콜백 처리

### Phase 3: 비밀번호 찾기

- [ ] `/forgot-password` 페이지
- [ ] 비밀번호 재설정 이메일 발송
- [ ] `/reset-password` 페이지

### Phase 4: Remember Me

- [ ] "Remember me" 체크박스
- [ ] 세션 유지 기간 설정
