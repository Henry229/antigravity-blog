import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { authConfig } from '@/lib/auth.config'
import { env } from '@/lib/env'

// 보호된 라우트 패턴 (로그인 필요)
const protectedRoutes = authConfig.protectedRoutes

// 인증 라우트 패턴 (로그인한 사용자는 접근 불가)
const authRoutes = authConfig.authRoutes

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.supabase.url,
    env.supabase.anonKey,
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

  // IMPORTANT: 사용자 세션을 새로고침하여 만료되지 않도록 함
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 토큰 검증 실패 시 명시적 에러 처리
  if (error) {
    console.error('Auth validation error:', error)
    // 인증 에러 발생 시 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('error', 'session_expired')
    return NextResponse.redirect(loginUrl)
  }

  const { pathname } = request.nextUrl

  // 보호된 라우트 확인
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // 인증 라우트 확인
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // 보호된 라우트인데 로그인하지 않은 경우 -> 로그인 페이지로
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL(authConfig.redirects.protectedRoute, request.url))
  }

  // 인증 라우트인데 이미 로그인한 경우 -> 대시보드로
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(authConfig.redirects.afterLogin, request.url))
  }

  return supabaseResponse
}
