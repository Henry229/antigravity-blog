"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { formatRelativeTime } from "@/lib/utils"

interface EditorHeaderProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  onSaveDraft: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
}

export function EditorHeader({
  isSaving,
  lastSaved,
  onSaveDraft,
  onPublish,
  isPublishing
}: EditorHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900 sm:px-6">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Save Status */}
        {lastSaved && (
          <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
            {isSaving ? 'Saving...' : `Saved ${formatRelativeTime(lastSaved)}`}
          </p>
        )}

        {/* Save Draft Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onSaveDraft}
          disabled={isSaving}
        >
          Save Draft
        </Button>

        {/* Publish Button */}
        <Button
          size="sm"
          onClick={onPublish}
          loading={isPublishing}
        >
          Publish
        </Button>
      </div>
    </header>
  )
}
