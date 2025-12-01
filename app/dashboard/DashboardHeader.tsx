import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { UserMenu } from "./UserMenu"
import { logout } from "@/app/actions/auth"

export interface DashboardHeaderProps {
  userEmail: string
  userAvatar?: string
}

export function DashboardHeader({ userEmail, userAvatar }: DashboardHeaderProps) {
  return (
    <header className="fixed right-0 top-0 z-10 flex h-16 flex-shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800 md:left-64">
      <div className="flex items-center gap-4">
        {/* New Post Button */}
        <Button asChild>
          <Link href="/dashboard/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        </Button>

        {/* User Menu */}
        <UserMenu
          userEmail={userEmail}
          userAvatar={userAvatar}
          logoutAction={logout}
        />
      </div>
    </header>
  )
}
