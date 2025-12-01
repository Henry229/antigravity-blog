"use client"

import { Bold, Italic, Heading2, Link, Code, Image } from "lucide-react"

const toolbarButtons = [
  { icon: Bold, action: 'bold', title: 'Bold (Ctrl+B)' },
  { icon: Italic, action: 'italic', title: 'Italic (Ctrl+I)' },
  { icon: Heading2, action: 'heading', title: 'Heading' },
  { icon: Link, action: 'link', title: 'Link' },
  { icon: Code, action: 'code', title: 'Code' },
  { icon: Image, action: 'image', title: 'Image URL' },
]

interface EditorToolbarProps {
  onAction: (action: string) => void;
}

export function EditorToolbar({ onAction }: EditorToolbarProps) {
  return (
    <div className="mb-4 flex items-center gap-1 border-b border-gray-200 pb-3 dark:border-gray-700">
      {toolbarButtons.map((btn) => {
        const Icon = btn.icon
        return (
          <button
            key={btn.action}
            type="button"
            onClick={() => onAction(btn.action)}
            title={btn.title}
            className="rounded p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <Icon className="h-5 w-5" />
          </button>
        )
      })}
    </div>
  )
}
