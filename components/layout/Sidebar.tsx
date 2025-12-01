"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Folder, FileEdit, Send } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "All Posts",
    icon: Folder,
    href: "/dashboard",
    filter: "all"
  },
  {
    label: "Drafts",
    icon: FileEdit,
    href: "/dashboard?status=draft",
    filter: "draft"
  },
  {
    label: "Published",
    icon: Send,
    href: "/dashboard?status=published",
    filter: "published"
  },
]

export interface SidebarProps {
  /**
   * 현재 활성화된 필터
   * - prop으로 전달하면 외부에서 제어 가능 (Server Component, 테스트 등)
   * - 미제공 시 useSearchParams()로 URL에서 자동 감지
   */
  currentFilter?: 'all' | 'draft' | 'published';
}

export function Sidebar({ currentFilter: currentFilterProp }: SidebarProps) {
  const searchParams = useSearchParams()

  // prop이 제공되면 prop 사용, 아니면 URL에서 감지
  const currentFilter = currentFilterProp ?? (searchParams.get('status') || 'all')

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:block">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentFilter === item.filter
            const Icon = item.icon

            return (
              <li key={item.filter}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-primary dark:bg-blue-900/30"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
