import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { MailCheck } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            You need to verify your email to complete signup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-100 p-4 text-sm dark:bg-gray-700">
            <p className="mb-2">
              We sent a confirmation link to your email address.
            </p>
            <p className="mb-2">
              Click the link in the email to activate your account.
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              If you don&apos;t see the email, please check your spam folder.
            </p>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            After verifying your email, return to the login page to sign in.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
