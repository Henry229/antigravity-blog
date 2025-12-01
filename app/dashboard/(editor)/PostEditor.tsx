"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { EditorHeader } from "./EditorHeader"
import { TitleInput } from "./TitleInput"
import { EditorToolbar } from "./EditorToolbar"
import { MarkdownEditor } from "./MarkdownEditor"
import { MarkdownPreview } from "./MarkdownPreview"

interface PostEditorProps {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    content: string;
  };
  createPostAction: (data: { title: string; content: string }) => Promise<{ post?: { id: string }; error?: string }>;
  updatePostAction: (data: { id: string; title: string; content: string }) => Promise<{ post?: { id: string }; error?: string }>;
  publishPostAction: (id: string) => Promise<{ post?: { id: string }; error?: string }>;
}

export function PostEditor({ mode, initialData, createPostAction, updatePostAction, publishPostAction }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [postId, setPostId] = useState<string | null>(initialData?.id || null)

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim()) return

    setIsSaving(true)
    try {
      if (mode === 'create' && !postId) {
        const result = await createPostAction({ title, content })
        if (result.post) {
          setPostId(result.post.id)
          // Update URL without navigation
          window.history.replaceState(null, '', `/dashboard/edit/${result.post.id}`)
        }
      } else if (postId) {
        await updatePostAction({ id: postId, title, content })
      }
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }, [mode, postId, title, content, createPostAction, updatePostAction])

  const handlePublish = useCallback(async () => {
    if (!title.trim()) return

    setIsPublishing(true)
    try {
      let id = postId
      if (!id) {
        const result = await createPostAction({ title, content })
        if (result.post) {
          id = result.post.id
        }
      } else {
        await updatePostAction({ id, title, content })
      }

      if (id) {
        await publishPostAction(id)
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to publish:', error)
    } finally {
      setIsPublishing(false)
    }
  }, [postId, title, content, router, createPostAction, updatePostAction, publishPostAction])

  const handleToolbarAction = useCallback((action: string) => {
    // Markdown insertion logic (can be enhanced later)
    console.log('Toolbar action:', action)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-gray-900">
      <EditorHeader
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12">
          <TitleInput value={title} onChange={setTitle} />
          <EditorToolbar onAction={handleToolbarAction} />
          <MarkdownEditor value={content} onChange={setContent} />
        </div>

        {/* Preview Panel */}
        <MarkdownPreview title={title} content={content} />
      </main>
    </div>
  )
}
