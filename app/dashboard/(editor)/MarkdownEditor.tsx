"use client"

import { useRef, useEffect } from "react"

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start writing your story using Markdown..."
      className="min-h-[300px] w-full flex-1 resize-none border-none bg-transparent p-0 font-mono text-base leading-relaxed text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-gray-200"
    />
  )
}
