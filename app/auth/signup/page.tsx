import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign up to get started
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <SignupForm />
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
