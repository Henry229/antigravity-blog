/**
 * Environment Variable Validation
 *
 * 필수 환경변수 검증 및 타입 안전한 접근
 */

function getEnvVar(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`환경변수 ${key}가 설정되지 않았습니다.`)
  }

  return value
}

/**
 * 필수 환경변수 검증
 * 애플리케이션 시작 시 호출하여 모든 필수 환경변수가 설정되었는지 확인
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
      `다음 환경변수가 설정되지 않았습니다: ${missingVars.join(', ')}\n` +
        `.env.local 파일을 확인해주세요.`
    )
  }

  console.log('✅ 환경변수 검증 완료')
}

/**
 * 타입 안전한 환경변수 접근
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
