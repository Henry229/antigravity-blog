'use client'

import { useState, useTransition } from 'react'
import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    startTransition(async () => {
      const result = await signup(formData)

      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-4">
      <GoogleLoginButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">이름</Label>
          <Input
            id="first_name"
            name="first_name"
            type="text"
            placeholder="홍길동"
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">성</Label>
          <Input
            id="last_name"
            name="last_name"
            type="text"
            placeholder="김"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="your@email.com"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">전화번호</Label>
        <Input
          id="mobile"
          name="mobile"
          type="tel"
          placeholder="010-1234-5678"
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          선택사항입니다
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호 (최소 8자)</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          minLength={8}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          최소 8자 이상 입력해주세요
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          minLength={8}
          required
          disabled={isPending}
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? '가입 중...' : '회원가입'}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{' '}
        <Link href="/auth/login" className="text-primary hover:underline">
          로그인
        </Link>
      </div>
      </form>
    </div>
  )
}
