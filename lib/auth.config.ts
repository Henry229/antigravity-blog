/**
 * Auth Configuration
 *
 * Centralized authentication settings for the project
 * Modify this file to customize auth behavior
 */

export const authConfig = {
  /**
   * Redirect URL settings
   */
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    afterSignup: '/dashboard',
    protectedRoute: '/auth/login',
  },

  /**
   * Protected route patterns
   * Routes that require authentication
   */
  protectedRoutes: ['/dashboard', '/posts'],

  /**
   * Auth route patterns
   * Routes that authenticated users cannot access
   */
  authRoutes: ['/auth/login', '/auth/signup'],

  /**
   * Password policy
   */
  password: {
    minLength: 6,
    requireUppercase: false,
    requireNumber: false,
    requireSpecialChar: false,
  },

  /**
   * Email confirmation settings
   */
  emailConfirmation: {
    required: true,
    verifyPage: '/auth/verify-email',
  },

  /**
   * OAuth provider settings
   */
  oauth: {
    providers: ['google'],
    createProfileOnSignIn: true,
  },

  /**
   * Profile schema settings
   */
  profile: {
    requiredFields: ['email', 'role'],
    optionalFields: ['first_name', 'last_name', 'mobile', 'avatar_url'],
    defaultRole: 'user' as const,
  },
} as const

export type AuthConfig = typeof authConfig
