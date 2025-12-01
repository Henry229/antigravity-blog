import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to a readable string
 * @example formatDate(new Date()) // "November 30, 2025"
 */
export function formatDate(
  date: Date | string | null | undefined,
  locale: string = 'en-US'
): string {
  if (!date) {
    return ''
  }

  try {
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return ''
    }

    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(parsedDate)
  } catch {
    return ''
  }
}

/**
 * Calculate estimated read time based on content length
 * @param content - The content to calculate read time for
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated minutes to read
 */
export function calculateReadTime(content: string | null | undefined, wordsPerMinute = 200): number {
  if (!content) {
    return 1
  }
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/**
 * Generate a URL-friendly slug from a title
 * @example generateSlug("Hello World") // "hello-world-abc123"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    + '-' + Date.now().toString(36)
}

/**
 * Format a date as relative time (e.g., "just now", "2 minutes ago")
 * @example formatRelativeTime(new Date()) // "just now"
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
}
