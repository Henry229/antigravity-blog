import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">로그인</h1>
          <p className="text-muted-foreground">
            계정에 로그인하여 학습을 시작하세요
          </p>
        </div>

        {params.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{decodeURIComponent(params.error)}</AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border bg-card p-6">
          <LoginForm />
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
