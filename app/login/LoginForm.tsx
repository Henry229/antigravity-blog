"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  loginAction: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
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

export function LoginForm({ loginAction, redirectTo }: LoginFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setServerError(null)

    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)

    const result = await loginAction(formData)

    if (result.error) {
      setServerError(result.error)
      return
    }

    router.push(getSafeRedirectUrl(redirectTo))
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        autoComplete="current-password"
        {...register("password")}
      />

      {serverError && (
        <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
      )}

      <div className="pt-2">
        <Button type="submit" fullWidth loading={isSubmitting}>
          Sign In
        </Button>
      </div>
    </form>
  )
}
