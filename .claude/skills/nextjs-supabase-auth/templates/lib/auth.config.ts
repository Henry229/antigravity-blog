/**
 * Auth Configuration
 *
 * 프로젝트별로 커스터마이징 가능한 인증 설정
 * 새 프로젝트에서 이 파일만 수정하면 auth 시스템을 재사용 가능
 */

export const authConfig = {
  /**
   * 리다이렉트 URL 설정
   * 프로젝트별로 다른 경로 사용 가능
   */
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    afterSignup: '/dashboard',
    protectedRoute: '/auth/login',
  },

  /**
   * 보호된 라우트 패턴
   * 로그인 필요한 페이지 경로
   */
  protectedRoutes: ['/dashboard', '/profile', '/admin'],

  /**
   * 인증 라우트 패턴
   * 로그인한 사용자가 접근 불가한 페이지
   */
  authRoutes: ['/auth/login', '/auth/signup'],

  /**
   * 비밀번호 정책
   */
  password: {
    minLength: 8,
    requireUppercase: false,
    requireNumber: false,
    requireSpecialChar: false,
  },

  /**
   * 이메일 확인 필수 여부
   */
  emailConfirmation: {
    required: true,
    verifyPage: '/auth/verify-email',
  },

  /**
   * OAuth 제공자 설정
   */
  oauth: {
    providers: ['google'],
    createProfileOnSignIn: true,
  },

  /**
   * 프로필 스키마 설정
   * 프로젝트별 필수 필드 정의
   */
  profile: {
    requiredFields: ['email', 'role'],
    optionalFields: ['first_name', 'last_name', 'mobile', 'avatar_url'],
    defaultRole: 'user' as const,
  },
} as const

export type AuthConfig = typeof authConfig
