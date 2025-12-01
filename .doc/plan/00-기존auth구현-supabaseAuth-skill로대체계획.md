📋 최종 계획 요약
삭제할 파일 (4개)
app/login/ 폴더 전체
app/signup/ 폴더 전체
actions/auth.ts
components/layout/AuthCard.tsx
신규 생성할 파일 (17개)
설정 파일 (2개)
lib/env.ts, lib/auth.config.ts
Auth 라우트 (6개)
app/auth/login/page.tsx
app/auth/signup/page.tsx
app/auth/callback/route.ts
app/auth/forgot-password/page.tsx
app/auth/reset-password/page.tsx
app/auth/verify-email/page.tsx
Auth 컴포넌트 (5개)
components/auth/LoginForm.tsx
components/auth/SignupForm.tsx
components/auth/GoogleLoginButton.tsx
components/auth/ForgotPasswordForm.tsx
components/auth/ResetPasswordForm.tsx
UI 컴포넌트 (2개)
components/ui/Label.tsx
components/ui/Alert.tsx
Actions (1개)
app/actions/auth.ts
수정할 파일 (7개)
proxy.ts - authRoutes 경로 변경
lib/supabase/server.ts - env.ts 사용
lib/supabase/client.ts - env.ts + PKCE 설정
components/ui/Card.tsx - CardTitle, CardDescription 추가
components/layout/Header.tsx - 링크 경로 변경
app/(home)/HeroSection.tsx - 링크 경로 변경
app/dashboard/UserMenu.tsx - 링크 경로 변경
app/dashboard/DashboardHeader.tsx - import 경로 변경
주요 특징
✅ UI 언어: 영어
✅ Google OAuth 활성화
✅ 이메일 확인 활성화
✅ proxy.ts 유지 (Next.js 16+ 호환)
계획을 승인하시면 구현을 시작하겠습니다.
Claude’s Plan
Auth 모듈 전체 교체 계획
개요
기존 auth 관련 모듈을 모두 삭제하고 nextjs-supabase-auth skill 템플릿으로 전체 교체
결정 사항
UI 언어: 영어
Google OAuth: 활성화 (Supabase 설정 완료)
profiles 테이블: first_name, last_name, mobile 필드 존재
이메일 확인: 활성화
Phase 1: 삭제할 파일 목록
1.1 라우트 파일
app/login/page.tsx
app/login/LoginForm.tsx
app/signup/page.tsx
app/signup/SignupForm.tsx
1.2 Actions
actions/auth.ts (전체 삭제)
1.3 레이아웃 컴포넌트
components/layout/AuthCard.tsx (Skill 템플릿에서 사용 안함)
Phase 2: 새로 생성할 파일 (Skill 템플릿 복사)
2.1 설정 파일
파일	설명
lib/auth.config.ts	인증 설정 중앙 관리
lib/env.ts	환경변수 검증 및 접근
2.2 라우트 파일 (/auth/* 경로)
파일	설명
app/auth/login/page.tsx	로그인 페이지
app/auth/signup/page.tsx	회원가입 페이지
app/auth/callback/route.ts	OAuth/이메일 확인 콜백
app/auth/forgot-password/page.tsx	비밀번호 찾기
app/auth/reset-password/page.tsx	비밀번호 재설정
app/auth/verify-email/page.tsx	이메일 확인 안내
2.3 Actions
파일	함수
app/actions/auth.ts	login, signup, logout, requestPasswordReset, updatePassword, loginWithGoogle
2.4 컴포넌트 (components/auth/)
파일	설명
LoginForm.tsx	로그인 폼 (Google OAuth 포함)
SignupForm.tsx	회원가입 폼
GoogleLoginButton.tsx	Google 로그인 버튼
ForgotPasswordForm.tsx	비밀번호 찾기 폼
ResetPasswordForm.tsx	비밀번호 재설정 폼
Phase 3: 수정할 파일
3.1 proxy.ts (라우트 보호)
// 변경 전
const protectedRoutes = ["/dashboard", "/posts"]
const authRoutes = ["/login", "/signup"]

// 변경 후
const protectedRoutes = ["/dashboard", "/posts"]
const authRoutes = ["/auth/login", "/auth/signup"]
3.2 lib/supabase/server.ts
// 변경: process.env 직접 사용 → env.ts 사용
import { env } from '@/lib/env'
// ...
env.supabase.url, env.supabase.anonKey
3.3 lib/supabase/client.ts
// 변경: env.ts 사용 + PKCE flow 설정 추가
import { env } from '@/lib/env'
// auth 옵션 추가
3.4 링크 수정 (경로 변경)
파일	변경 내용
components/layout/Header.tsx	/login → /auth/login, /signup → /auth/signup
app/(home)/HeroSection.tsx	/signup → /auth/signup
app/dashboard/UserMenu.tsx	router.push("/login") → router.push("/auth/login")
3.5 DashboardHeader.tsx
// 변경: actions/auth → app/actions/auth
import { logout } from "@/app/actions/auth"
Phase 4: UI 컴포넌트 호환성 해결
문제점
Skill 템플릿은 shadcn/ui 스타일 import 사용:
@/components/ui/button (소문자)
@/components/ui/input (소문자)
@/components/ui/label (없음)
@/components/ui/alert (없음)
@/components/ui/card (CardTitle, CardDescription 없음)
현재 프로젝트:
@/components/ui/Button (대문자)
@/components/ui/Input (대문자)
Label, Alert 컴포넌트 없음
Card에 CardTitle, CardDescription 없음
해결 방안: Skill 템플릿 컴포넌트 수정
모든 auth 컴포넌트에서:
Import 경로 대문자로 변경
누락된 컴포넌트(Label, Alert, CardTitle, CardDescription) 직접 구현 또는 추가
추가할 UI 컴포넌트:
components/ui/Label.tsx
components/ui/Alert.tsx
Card.tsx에 CardTitle, CardDescription 추가
Phase 5: auth.config.ts 커스터마이징
export const authConfig = {
  redirects: {
    afterLogin: '/dashboard',
    afterLogout: '/auth/login',
    afterSignup: '/dashboard',
    protectedRoute: '/auth/login',
  },
  protectedRoutes: ['/dashboard', '/posts'],
  authRoutes: ['/auth/login', '/auth/signup'],
  password: {
    minLength: 6,
    requireUppercase: false,
    requireNumber: false,
    requireSpecialChar: false,
  },
  emailConfirmation: {
    required: true,  // 이메일 확인 활성화
    verifyPage: '/auth/verify-email',
  },
  oauth: {
    providers: ['google'],  // Google OAuth 활성화
    createProfileOnSignIn: true,
  },
  profile: {
    requiredFields: ['email', 'role'],
    optionalFields: ['first_name', 'last_name', 'mobile', 'avatar_url'],
    defaultRole: 'user',
  },
}
Phase 6: 환경변수 확인
.env.local에 필요한 변수:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
실행 순서
Step 1: 준비
 환경변수 확인 (NEXT_PUBLIC_SITE_URL 추가 필요시)
Step 2: 새 파일 생성
 lib/env.ts 생성
 lib/auth.config.ts 생성
 components/ui/Label.tsx 생성
 components/ui/Alert.tsx 생성
 components/ui/Card.tsx 수정 (CardTitle, CardDescription 추가)
Step 3: Auth 라우트 생성
 app/auth/login/page.tsx
 app/auth/signup/page.tsx
 app/auth/callback/route.ts
 app/auth/forgot-password/page.tsx
 app/auth/reset-password/page.tsx
 app/auth/verify-email/page.tsx
Step 4: Auth 컴포넌트 생성
 components/auth/LoginForm.tsx
 components/auth/SignupForm.tsx
 components/auth/GoogleLoginButton.tsx
 components/auth/ForgotPasswordForm.tsx
 components/auth/ResetPasswordForm.tsx
Step 5: Actions 이동
 app/actions/auth.ts 생성 (Skill 템플릿 기반)
Step 6: 기존 파일 수정
 lib/supabase/server.ts - env.ts 사용으로 변경
 lib/supabase/client.ts - env.ts + PKCE 설정 추가
 proxy.ts - authRoutes 경로 변경
Step 7: 링크 수정
 components/layout/Header.tsx
 app/(home)/HeroSection.tsx
 app/dashboard/UserMenu.tsx
 app/dashboard/DashboardHeader.tsx
Step 8: 기존 파일 삭제
 app/login/ 폴더 전체
 app/signup/ 폴더 전체
 actions/auth.ts
 components/layout/AuthCard.tsx
Step 9: 테스트
 로그인 기능 테스트
 회원가입 기능 테스트
 로그아웃 기능 테스트
 비밀번호 찾기/재설정 테스트
 보호된 라우트 접근 테스트
 Google OAuth 테스트 (Supabase 설정 필요)
주요 변경 사항 요약
라우트 변경
기존	신규
/login	/auth/login
/signup	/auth/signup
/forgot-password	/auth/forgot-password
(없음)	/auth/reset-password
(없음)	/auth/verify-email
(없음)	/auth/callback
신규 기능
Google OAuth 로그인
비밀번호 찾기/재설정
이메일 확인 (회원가입 후)
환경변수 검증 (lib/env.ts)
중앙화된 인증 설정 (lib/auth.config.ts)
중요 참고
Skill 템플릿의 한국어 UI를 영어로 변환 필요
middleware.ts 대신 기존 proxy.ts 유지 (Next.js 16+ 호환)
User approved the plan
계획이 승인되었습니다. 구현을 시작하겠습니다.
Update Todos

Create lib/env.ts and lib/auth.config.ts

Create UI components (Label.tsx, Alert.tsx, update Card.tsx)

Create auth routes (login, signup, callback, forgot-password, reset-password, verify-email)

Create auth components (LoginForm, SignupForm, GoogleLoginButton, ForgotPasswordForm, ResetPasswordForm)

Create app/actions/auth.ts

Update lib/supabase files to use env.ts

Update proxy.ts authRoutes

Update link paths in Header, HeroSection, UserMenu, DashboardHeader

Delete old auth files (app/login, app/signup, actions/auth.ts, AuthCard.tsx)

Test all auth functionality