import { Metadata } from "next"
import { AuthCard } from "@/components/layout/AuthCard"
import { LoginForm } from "./LoginForm"
import { login } from "@/actions/auth"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login | SimpleBlog",
  description: "Sign in to your SimpleBlog account",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo } = await searchParams

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard"
      footer={
        <div className="space-y-2">
          <p>
            Don&apos;t have an account?{" "}
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
      <LoginForm loginAction={login} redirectTo={redirectTo} />
    </AuthCard>
  )
}
