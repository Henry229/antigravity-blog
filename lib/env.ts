/**
 * Environment Variable Validation
 *
 * Type-safe environment variable access with validation
 */

function getEnvVar(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`)
  }

  return value
}

/**
 * Validate required environment variables
 * Call this at application startup to ensure all required variables are set
 */
export function validateEnv() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SITE_URL',
  ]

  const missingVars = requiredEnvVars.filter((key) => !process.env[key])

  if (missingVars.length > 0) {
    throw new Error(
      `The following environment variables are not set: ${missingVars.join(', ')}\n` +
        `Please check your .env.local file.`
    )
  }

  console.log('✅ Environment variables validated')
}

/**
 * Type-safe environment variable access
 */
export const env = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  site: {
    url: getEnvVar('NEXT_PUBLIC_SITE_URL'),
  },
} as const
