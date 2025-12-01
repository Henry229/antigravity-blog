import { Metadata } from "next"
import { AuthCard } from "@/components/layout/AuthCard"
import { SignupForm } from "./SignupForm"
import { signup } from "@/actions/auth"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up | SimpleBlog",
  description: "Create your SimpleBlog account",
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string }>
}) {
  const { redirectTo } = await searchParams

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
      <SignupForm signupAction={signup} redirectTo={redirectTo} />
    </AuthCard>
  )
}
