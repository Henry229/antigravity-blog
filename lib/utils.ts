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
