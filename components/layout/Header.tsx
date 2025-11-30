import Link from "next/link"
import { Logo } from "@/components/ui/Logo"
import { Button } from "@/components/ui/Button"

export interface HeaderProps {
  variant?: 'public' | 'landing';
}

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
