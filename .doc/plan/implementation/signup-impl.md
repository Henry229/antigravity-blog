# Signup Page 구현 계획

## 개요

SimpleBlog 회원가입 페이지 구현

- **User Flow Step**: 1 - 로그인/회원가입
- **주요 기능**: 이메일/비밀번호로 새 계정 생성, Supabase Auth 연동
- **인증 필요**: ❌ (이미 로그인된 경우 리다이렉트)

---

## 페이지 구조 (plan-based-page에서)

```
- body (bg-gray-50, centered)
  - container (max-w-md)
    - Logo (상단 중앙)
    - AuthCard (공통)
      - heading: "Create your account"
      - SignupForm
        - email-input
        - password-input
        - confirm-password-input
        - submit-button ("Create Account")
        - error-message (조건부)
      - footer-link: "Already have an account? Sign in"
```

---

## 공통 컴포넌트 Import 경로

> 참조: `.doc/plan/implementation/shared-components-impl.md`

| 컴포넌트 | Import 경로 | Props |
|----------|-------------|-------|
| Logo | `@/components/ui/Logo` | `size?: 'sm' \| 'md' \| 'lg'`, `icon?: 'article' \| 'edit'` |
| AuthCard | `@/components/layout/AuthCard` | `title: string`, `subtitle?: string`, `children`, `footer?: ReactNode` |
| Input | `@/components/ui/Input` | `label?: string`, `error?: string`, `type`, `name`, `placeholder` |
| Button | `@/components/ui/Button` | `variant`, `size`, `loading`, `fullWidth`, `type` |

---

## 의존성

이미 설치됨 (공통 컴포넌트에서):
- lucide-react
- clsx, tailwind-merge

추가 필요:
```bash
# Supabase 클라이언트 (이미 설치 가정)
npm install @supabase/supabase-js @supabase/ssr
```

---

## Task List

### 0. 페이지 라우트 생성

**상태:** - [x] 완료
**파일:** `app/signup/page.tsx`

**요구사항:**
- [x] `app/signup/page.tsx` 생성
- [x] metadata 설정 (title, description)
- [x] Server Component로 인증 상태 확인
- [x] 이미 로그인된 경우 `/dashboard`로 리다이렉트

**기본 구조:**

```typescript
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthCard } from "@/components/layout/AuthCard"
import { SignupForm } from "./SignupForm"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up | SimpleBlog",
  description: "Create your SimpleBlog account",
}

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (user) {
    redirect("/dashboard")
  }

  return (
    <AuthCard
      title="Create your account"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthCard>
  )
}
```

**완료 조건:**
- [x] 페이지 접근 가능 (`/signup`)
- [x] 메타데이터 설정 완료
- [x] 로그인된 사용자 리다이렉트

---

### 1. SignupForm 컴포넌트

**상태:** - [x] 완료
**파일:** `app/signup/SignupForm.tsx`

**요구사항:**
- [x] Client Component ("use client")
- [x] 이메일 입력 필드
- [x] 비밀번호 입력 필드
- [x] 비밀번호 확인 입력 필드
- [x] 비밀번호 일치 검증 (클라이언트)
- [x] 제출 버튼 ("Create Account")
- [x] 로딩 상태 표시
- [x] 에러 메시지 표시
- [x] Server Action 연결

**Props Interface:**

```typescript
// 이 컴포넌트는 props가 없음 (자체 상태 관리)
```

**스타일 (HTML에서 추출):**

| 요소 | 값 |
|------|-----|
| Form Spacing | space-y-4 |
| Button Wrapper | pt-2 |
| Error Text | text-sm text-red-600 |

**기본 구조:**

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { signup } from "@/actions/auth"

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    // 클라이언트 측 비밀번호 확인
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // 비밀번호 최소 길이 검증
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // 회원가입 성공 시 대시보드로 이동
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
        autoComplete="new-password"
      />
      <Input
        label="Confirm password"
        name="confirm-password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          loading={loading}
        >
          Create Account
        </Button>
      </div>
    </form>
  )
}
```

**완료 조건:**
- [x] 모든 입력 필드 정상 동작
- [x] 비밀번호 불일치 시 에러 표시
- [x] 로딩 상태에서 버튼 비활성화 + spinner
- [x] 에러 메시지 표시

---

### 2. Signup Server Action

**상태:** - [x] 완료
**파일:** `actions/auth.ts`

**요구사항:**
- [x] Server Action으로 구현 ("use server")
- [x] Supabase Auth `signUp` 호출
- [x] 에러 처리 및 반환
- [x] 이메일 확인 설정 (Supabase 설정에 따라)

**기본 구조:**

```typescript
// actions/auth.ts
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}
```

**에러 메시지 매핑 (선택적):**

```typescript
function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    "User already registered": "An account with this email already exists",
    "Password should be at least 6 characters": "Password must be at least 6 characters",
    "Invalid email": "Please enter a valid email address",
  }
  return errorMessages[error] || error
}
```

**완료 조건:**
- [x] Supabase Auth 연동 성공
- [x] 에러 메시지 적절히 반환
- [x] 중복 이메일 처리

---

### 3. Supabase 클라이언트 설정

**상태:** - [x] 완료 (기존 구현 활용)
**파일:** `lib/supabase/server.ts`, `lib/supabase/client.ts`

**요구사항:**
- [x] Server-side Supabase 클라이언트 생성
- [x] Cookie 기반 세션 관리
- [x] 환경변수 설정

**lib/supabase/server.ts:**

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

**lib/supabase/client.ts:**

```typescript
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**환경변수 (.env.local):**

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**완료 조건:**
- [x] 환경변수 설정
- [x] Server/Client 클라이언트 생성 함수
- [x] Cookie 기반 세션 관리

---

### 4. Middleware 설정 (세션 갱신)

**상태:** - [x] 완료
**파일:** `middleware.ts`

**요구사항:**
- [x] 모든 요청에서 세션 갱신
- [x] Supabase Auth 토큰 자동 갱신

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
          cookiesToSet.forEach(({ name, value, options }) =>
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

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

**완료 조건:**
- [x] 세션 자동 갱신 동작
- [x] 정적 파일 제외

---

## 구현 순서

1. Supabase 프로젝트 설정 및 환경변수 구성
2. `lib/supabase/server.ts` - Server 클라이언트
3. `lib/supabase/client.ts` - Browser 클라이언트
4. `middleware.ts` - 세션 갱신
5. `actions/auth.ts` - signup Server Action
6. `app/signup/SignupForm.tsx` - 폼 컴포넌트
7. `app/signup/page.tsx` - 페이지 조립
8. 테스트 및 에러 처리 보완

---

## 파일 구조

```
app/
└── signup/
    ├── page.tsx              # Signup Page (Server Component)
    └── SignupForm.tsx        # Signup Form (Client Component)

actions/
└── auth.ts                   # signup, login Server Actions

lib/
└── supabase/
    ├── server.ts             # Server-side Supabase client
    └── client.ts             # Browser-side Supabase client

middleware.ts                 # Session refresh middleware
```

---

## Login vs Signup 차이점

| 항목 | Login | Signup |
|------|-------|--------|
| Heading | "Welcome back" | "Create your account" |
| Fields | email, password | email, password, confirm-password |
| Button Text | "Sign In" | "Create Account" |
| Footer Link | "Don't have an account? Sign up" | "Already have an account? Sign in" |
| Footer Link 2 | "Forgot password?" | - |
| Server Action | `login()` | `signup()` |
| Supabase Method | `signInWithPassword` | `signUp` |

---

## 검증 체크리스트

### SignupForm
- [x] 이메일 입력 동작
- [x] 비밀번호 입력 동작
- [x] 비밀번호 확인 입력 동작
- [x] 비밀번호 불일치 시 에러: "Passwords do not match"
- [x] 짧은 비밀번호 에러: "Password must be at least 6 characters"
- [x] 로딩 상태 spinner 표시
- [x] 제출 중 버튼 비활성화

### Signup Page
- [x] AuthCard 레이아웃 표시
- [x] Logo 상단 표시
- [x] Footer 링크 → /login 이동
- [x] 로그인된 사용자 → /dashboard 리다이렉트

### Server Action
- [x] Supabase signUp 호출
- [x] 성공 시 세션 생성
- [x] 중복 이메일 에러 처리
- [x] 네트워크 에러 처리

### 공통
- [x] 다크모드 지원
- [x] 반응형 레이아웃 (모바일/데스크탑)
- [x] TypeScript 타입 에러 없음
- [x] 접근성 (label, autoComplete)

---

## 비즈니스 로직 흐름

```
[User] → /signup 접근
         ↓
[Server] → 인증 상태 확인
         ↓
    ┌─ 로그인됨 → redirect("/dashboard")
    └─ 비로그인 → 페이지 렌더링
         ↓
[User] → 폼 입력 및 제출
         ↓
[Client] → 비밀번호 일치 검증
         ↓
    ┌─ 불일치 → 에러 메시지 표시
    └─ 일치 → Server Action 호출
         ↓
[Server] → Supabase signUp 호출
         ↓
    ┌─ 에러 → 에러 메시지 반환
    └─ 성공 → 세션 생성
         ↓
[Client] → router.push("/dashboard")
```

---

## 다음 단계

1. **Login Page**: `/login` 구현 (SignupForm과 유사)
2. **Logout**: Server Action으로 로그아웃 구현
3. **Protected Routes**: Dashboard 등 인증 필요 페이지 보호
4. **이메일 확인**: Supabase 이메일 확인 설정 시 안내 페이지
5. **비밀번호 재설정**: Forgot password 기능 (v2)
