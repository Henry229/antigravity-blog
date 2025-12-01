import ReactMarkdown from "react-markdown"

interface MarkdownPreviewProps {
  title: string;
  content: string;
}

export function MarkdownPreview({ title, content }: MarkdownPreviewProps) {
  return (
    <div className="hidden w-1/2 flex-col overflow-y-auto border-l border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 md:flex">
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12">
        {/* Title Preview */}
        <h1 className="mb-6 text-3xl font-medium text-gray-900 dark:text-white md:text-4xl lg:text-5xl">
          {title || (
            <span className="text-gray-400">Your Post Title...</span>
          )}
        </h1>

        {/* Content Preview */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {content ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <p className="text-gray-400">Start writing your story...</p>
          )}
        </div>
      </div>
    </div>
  )
}
