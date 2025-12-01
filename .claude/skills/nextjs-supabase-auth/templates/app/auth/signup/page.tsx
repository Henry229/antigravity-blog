import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">회원가입</h1>
          <p className="text-muted-foreground">
            새 계정을 만들어 학습을 시작하세요
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <SignupForm />
        </div>

        <div className="text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
