import Link from "next/link"
import { PenTool } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { UserMenu } from "@/app/dashboard/UserMenu"
import { ThemeToggle } from "@/components/ui/ThemeToggle"
import { logout } from "@/app/actions/auth"

export interface HeaderProps {
  variant?: 'public' | 'landing';
}

export async function Header({ variant = 'public' }: HeaderProps) {
  // Check actual authentication state from Supabase
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#FAF9F6]/90 backdrop-blur-md py-4 dark:bg-stone-900/90">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-[#D97706] text-white p-1.5 rounded-full transition-transform group-hover:rotate-12">
            <PenTool size={18} />
          </div>
          <span className="font-serif text-xl font-bold text-[#1c1917] tracking-tight dark:text-white">SimpleBlog</span>
        </Link>

        {/* Desktop Nav - Only show on landing variant */}
        {variant === 'landing' && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-400">
            <Link href="#features" className="hover:text-[#D97706] transition-colors">Features</Link>
            <Link href="/blog" className="hover:text-[#D97706] transition-colors">Blog</Link>
          </div>
        )}

        {/* Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {variant === 'landing' ? (
            isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:block text-sm font-medium text-stone-600 hover:text-[#1c1917] transition-colors dark:text-stone-400 dark:hover:text-white"
                >
                  Dashboard
                </Link>
                <UserMenu
                  userEmail={user?.email || ""}
                  userAvatar={user?.user_metadata?.avatar_url}
                  logoutAction={logout}
                />
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="hidden md:block text-sm font-medium text-stone-600 hover:text-[#1c1917] transition-colors dark:text-stone-400 dark:hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-[#1c1917] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-stone-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 dark:bg-white dark:text-[#1c1917] dark:hover:bg-stone-200"
                >
                  Get Access
                </Link>
              </>
            )
          ) : (
            // Public 페이지: 네비게이션 링크
            <>
              <Link
                href="/"
                className="text-sm font-medium text-stone-600 hover:text-[#D97706] transition-colors dark:text-stone-400"
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-stone-600 hover:text-[#D97706] transition-colors dark:text-stone-400"
                  >
                    Dashboard
                  </Link>
                  <UserMenu
                    userEmail={user?.email || ""}
                    userAvatar={user?.user_metadata?.avatar_url}
                    logoutAction={logout}
                  />
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-stone-600 hover:text-[#D97706] transition-colors dark:text-stone-400"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
