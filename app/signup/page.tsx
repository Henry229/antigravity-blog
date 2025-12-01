import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AuthCard } from "@/components/layout/AuthCard"
import { SignupForm } from "./SignupForm"
import { signup } from "@/actions/auth"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign Up | SimpleBlog",
  description: "Create your SimpleBlog account",
}

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
      <SignupForm signupAction={signup} />
    </AuthCard>
  )
}
