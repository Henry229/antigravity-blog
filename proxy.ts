import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const protectedRoutes = ["/dashboard", "/posts"]
const authRoutes = ["/login", "/signup"]

export async function proxy(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search

  // Protected routes: unauthenticated → /login with redirectTo (including query string)
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    // Preserve both pathname and query string for full URL restoration
    const redirectPath = search ? `${pathname}${search}` : pathname
    url.searchParams.set("redirectTo", redirectPath)
    return NextResponse.redirect(url)
  }

  // Auth routes: authenticated → /dashboard
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
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
