import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 인증 체크
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // For testing purposes, we might want to bypass this or ensure we have a way to login.
    // redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - fixed position */}
      <Sidebar />

      {/* Main Content - offset by sidebar width */}
      <div className="flex flex-col md:ml-64">
        {children}
      </div>
    </div>
  )
}
