"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface SignupFormProps {
  signupAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  redirectTo?: string
}

function getSafeRedirectUrl(redirectTo?: string): string {
  if (!redirectTo) return "/dashboard"
  // Only allow internal paths starting with / and not protocol URLs
  if (redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    return redirectTo
  }
  return "/dashboard"
}

export function SignupForm({ signupAction, redirectTo }: SignupFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    const result = await signupAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(getSafeRedirectUrl(redirectTo))
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />
      <Input
        label="Confirm password"
        name="confirm-password"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          fullWidth
          loading={loading}
        >
          Create Account
        </Button>
      </div>
    </form>
  )
}
