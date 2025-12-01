import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MailCheck } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>이메일을 확인해주세요</CardTitle>
          <CardDescription>
            회원가입을 완료하려면 이메일을 확인해야 합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2">
              가입하신 이메일 주소로 확인 링크를 보내드렸습니다.
            </p>
            <p className="mb-2">
              이메일의 확인 링크를 클릭하시면 계정이 활성화됩니다.
            </p>
            <p className="text-muted-foreground">
              이메일이 오지 않았다면 스팸 메일함을 확인해주세요.
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            이메일을 확인한 후 로그인 페이지로 돌아가 로그인하세요.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
