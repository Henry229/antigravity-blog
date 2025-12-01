import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/Alert'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>
}) {
  const params = await searchParams

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {params.error && (
          <Alert variant="destructive">
            <AlertDescription>{decodeURIComponent(params.error)}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <LoginForm redirectTo={params.redirectTo} />
        </div>

        <div className="text-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-primary dark:text-gray-400">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
