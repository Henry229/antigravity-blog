# Protected Routes 구현 계획

## 개요

SimpleBlog 인증 필요 페이지 보호 기능 구현

- **User Flow Step**: 전체 - 인증 기반 접근 제어
- **주요 기능**: 미인증 사용자를 로그인 페이지로 리다이렉트
- **적용 대상**: `/dashboard/*`, `/posts/*`

---

## 현재 상태

- `proxy.ts`: Protected routes 로직 이미 구현됨 ✅ (Next.js 16+ 표준)
- `middleware.ts`: 레거시 파일 (삭제 대상)

> **참고**: Next.js 16 이상에서는 `middleware.ts` 대신 `proxy.ts`를 사용합니다.

### proxy.ts 현재 구현 (참조용)

```typescript
// 이미 구현된 Protected Routes 로직
const protectedRoutes = ["/dashboard", "/posts"]
const isProtectedRoute = protectedRoutes.some((route) =>
  request.nextUrl.pathname.startsWith(route)
)

if (isProtectedRoute && !user) {
  const url = request.nextUrl.clone()
  url.pathname = "/login"
  return NextResponse.redirect(url)
}
```

---

## 구현 전략

**선택: proxy.ts 기반 확장**

Next.js 16+에서는 `proxy.ts`가 표준이므로, 기존 `proxy.ts`에 추가 기능을 구현하고 `middleware.ts`는 삭제합니다.

---

## Task List

### 1. proxy.ts 확장 (인증 라우트 리다이렉트 추가)

**상태:** - [ ] 미완료
**파일:** `proxy.ts`

**요구사항:**
- [ ] 인증된 사용자가 `/login`, `/signup` 접근 시 `/dashboard`로 리다이렉트
- [ ] `redirectTo` 쿼리 파라미터 추가 (로그인 후 원래 페이지 복귀용)

**기본 구조:**

```typescript
// proxy.ts (확장 버전)
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const protectedRoutes = ["/dashboard", "/posts"]
const authRoutes = ["/login", "/signup"]

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // 보호된 라우트: 미인증 → /login
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  )
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  // 인증 라우트: 인증됨 → /dashboard
  const isAuthRoute = authRoutes.some(route =>
    pathname.startsWith(route)
  )
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
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
- [ ] 미인증 사용자 → 보호 라우트 접근 시 `/login` 리다이렉트
- [ ] 인증 사용자 → `/login`, `/signup` 접근 시 `/dashboard` 리다이렉트
- [ ] `redirectTo` 쿼리 파라미터 전달

---

### 2. middleware.ts 삭제

**상태:** - [ ] 미완료
**파일:** `middleware.ts`

**요구사항:**
- [ ] 레거시 `middleware.ts` 파일 삭제

**완료 조건:**
- [ ] 파일 삭제됨
- [ ] 빌드 에러 없음

---

### 3. 로그인 후 원래 페이지로 복귀

**상태:** - [ ] 미완료
**파일:** `app/login/page.tsx`, `app/login/LoginForm.tsx`

**요구사항:**
- [ ] URL에서 `redirectTo` 파라미터 읽기
- [ ] 로그인 성공 시 해당 URL로 이동
- [ ] 파라미터 없으면 기본값 `/dashboard`

**page.tsx 수정:**

```typescript
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo } = await searchParams
  // ...
  return (
    <LoginForm loginAction={login} redirectTo={redirectTo} />
  )
}
```

**LoginForm.tsx 수정:**

```typescript
interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  redirectTo?: string
}

export function LoginForm({ loginAction, redirectTo }: LoginFormProps) {
  // ...
  if (!result.error) {
    router.push(redirectTo || "/dashboard")
    router.refresh()
  }
}
```

**완료 조건:**
- [ ] `redirectTo` 파라미터 정상 전달
- [ ] 로그인 성공 시 원래 페이지로 이동
- [ ] 파라미터 없으면 대시보드로 이동

---

### 4. Signup도 동일하게 적용

**상태:** - [ ] 미완료
**파일:** `app/signup/page.tsx`, `app/signup/SignupForm.tsx`

**요구사항:**
- [ ] Login과 동일하게 `redirectTo` 처리

**완료 조건:**
- [ ] 회원가입 성공 시 원래 페이지로 이동

---

### 5. Dashboard Layout 정리 (선택)

**상태:** - [ ] 미완료
**파일:** `app/dashboard/layout.tsx`

**요구사항:**
- [ ] 중복 인증 체크 코드 정리 (proxy.ts에서 처리하므로)

---

## 구현 순서

1. `proxy.ts` - 인증 라우트 리다이렉트 및 redirectTo 파라미터 추가
2. `middleware.ts` 삭제
3. `app/login/page.tsx` - `redirectTo` 파라미터 처리
4. `app/login/LoginForm.tsx` - `redirectTo` props 추가
5. `app/signup/page.tsx`, `SignupForm.tsx` - 동일 적용
6. `app/dashboard/layout.tsx` - 중복 코드 정리 (선택)
7. 테스트

---

## 파일 구조

```
proxy.ts                      # 라우트 보호 (Next.js 16+ 표준)
middleware.ts                 # 삭제 대상

app/
├── login/
│   ├── page.tsx             # redirectTo 파라미터 처리
│   └── LoginForm.tsx        # redirectTo props
├── signup/
│   ├── page.tsx             # redirectTo 파라미터 처리
│   └── SignupForm.tsx       # redirectTo props
└── dashboard/
    └── layout.tsx           # 중복 코드 정리 (선택)
```

---

## 검증 체크리스트

### Proxy
- [ ] `/dashboard` 미인증 접근 → `/login?redirectTo=/dashboard`
- [ ] `/posts/new` 미인증 접근 → `/login?redirectTo=/posts/new`
- [ ] `/login` 인증 상태 접근 → `/dashboard`
- [ ] `/signup` 인증 상태 접근 → `/dashboard`

### 로그인 후 복귀
- [ ] `/login?redirectTo=/dashboard/settings` → 로그인 후 해당 페이지로 이동
- [ ] `/login` (파라미터 없음) → 로그인 후 `/dashboard`로 이동

### 보안
- [ ] 외부 URL로의 리다이렉트 방지 (선택)
- [ ] 유효한 내부 경로만 허용 (선택)

---

## 비즈니스 로직 흐름

```
[User] → /dashboard 접근 (미인증)
         ↓
[Proxy] → 인증 상태 확인
         ↓
    ┌─ 인증됨 → 페이지 렌더링
    └─ 미인증 → /login?redirectTo=/dashboard
         ↓
[User] → 로그인 성공
         ↓
[Client] → redirectTo 파라미터 확인
         ↓
    ┌─ 있음 → 해당 URL로 이동
    └─ 없음 → /dashboard로 이동
```
