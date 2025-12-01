import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

export interface DashboardHeaderProps {
  userAvatar?: string;
}

export function DashboardHeader({ userAvatar }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-end border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center gap-4">
        {/* New Post Button */}
        <Button asChild>
          <Link href="/dashboard/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        </Button>

        {/* User Avatar */}
        <button className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
              U
            </div>
          )}
        </button>
      </div>
    </header>
  )
}
