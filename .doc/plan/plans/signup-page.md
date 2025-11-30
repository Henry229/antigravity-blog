# Signup Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/signup` |
| **파일** | `app/signup/page.tsx` |
| **HTML 소스** | signup.html |
| **User Flow** | Step 1 - 로그인/회원가입 |
| **인증 필요** | ❌ (이미 로그인되어 있으면 리다이렉트) |

---

## HTML 구조 분석

```
- body (bg-background-light, centered)
  - container (max-w-md)
    - logo-section (mb-8, text-center)
      - logo (icon + text)
    - auth-card (rounded-xl, border, bg-white, shadow-sm)
      - heading: "Create your account"
      - form (space-y-4)
        - email-input (with label)
        - password-input (with label)
        - confirm-password-input (with label)
        - submit-button (primary, full-width)
      - footer-link
        - "Already have an account? Sign in"
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Logo | 공통 | `components/ui/Logo.tsx` |
| AuthCard | 공통 | `components/layout/AuthCard.tsx` |
| Input | 공통 | `components/ui/Input.tsx` |
| Button | 공통 | `components/ui/Button.tsx` |
| SignupForm | 페이지전용 | `app/signup/SignupForm.tsx` |

---

## 컴포넌트 상세

### SignupForm

```typescript
// app/signup/SignupForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/actions/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;
    
    // 클라이언트 측 비밀번호 확인
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    const result = await signup(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // 이메일 확인 안내 또는 대시보드로 이동
      router.push('/dashboard');
    }
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-4">
      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />
      <Input
        label="Confirm password"
        name="confirm-password"
        type="password"
        placeholder="••••••••"
        required
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="pt-2">
        <Button type="submit" fullWidth loading={loading}>
          Create Account
        </Button>
      </div>
    </form>
  );
}
```

**HTML 추출**:
```html
<form class="mt-8 space-y-4">
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-700" for="email">Email address</label>
    <input class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary" id="email" placeholder="you@example.com" type="email"/>
  </div>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-700" for="password">Password</label>
    <input class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary" id="password" placeholder="••••••••" type="password"/>
  </div>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-gray-700" for="confirm-password">Confirm password</label>
    <input class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary" id="confirm-password" placeholder="••••••••" type="password"/>
  </div>
  <div class="pt-2">
    <button class="w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90" type="submit">Create Account</button>
  </div>
</form>
```

---

## 비즈니스 로직 (PRD에서)

### Server Action
```typescript
// actions/auth.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
  const supabase = createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  redirect('/dashboard');
}
```

### 필요 로직
- [ ] 비밀번호 확인 (클라이언트 측)
- [ ] Supabase Auth `signUp` 호출
- [ ] 회원가입 성공 시 `/dashboard`로 리다이렉트
- [ ] 회원가입 실패 시 에러 메시지 표시
- [ ] 이미 로그인된 사용자는 `/dashboard`로 리다이렉트
- [ ] 로딩 상태 표시
- [ ] 이메일 확인 기능 (선택적 - Supabase 설정에 따라)

### 리다이렉트 체크
```typescript
// app/signup/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect('/dashboard');
  }
  
  return (
    // ...
  );
}
```

---

## 구현 태스크

### Phase 1: 기본 구조
- [ ] `app/signup/page.tsx` 생성
- [ ] AuthCard 레이아웃 적용
- [ ] Logo 배치

### Phase 2: Form 구현
- [ ] `app/signup/SignupForm.tsx` 생성 (Client Component)
- [ ] Input 컴포넌트 연결 (email, password, confirm-password)
- [ ] Button 컴포넌트 연결
- [ ] 비밀번호 확인 로직

### Phase 3: Server Action 연결
- [ ] `actions/auth.ts` - signup 함수 구현
- [ ] Supabase Auth 연동
- [ ] 에러 처리

### Phase 4: 부가 기능
- [ ] 로딩 상태 표시
- [ ] 이미 로그인된 사용자 리다이렉트
- [ ] Footer 링크 (Sign in)
- [ ] 비밀번호 강도 표시 (선택적 - v2)

---

## 스타일 (HTML에서 추출)

### Layout
| 요소 | 값 |
|------|-----|
| Body Background | bg-background-light (#F8FAFC) |
| Container | max-w-md w-full |
| Centering | flex min-h-screen items-center justify-center |

### AuthCard
| 요소 | 값 |
|------|-----|
| Border | rounded-xl border border-gray-200 |
| Background | bg-white |
| Shadow | shadow-sm |
| Padding | p-6 sm:p-8 |

### Form
| 요소 | 값 |
|------|-----|
| Spacing | space-y-4 |
| Button padding | pt-2 |

### Typography
| 요소 | 스타일 |
|------|--------|
| Heading | text-2xl font-bold text-gray-900 |
| Footer Link | text-sm text-gray-600 |
| Link Hover | hover:text-primary hover:underline |

---

## Login vs Signup 차이점

| 항목 | Login | Signup |
|------|-------|--------|
| Heading | "Welcome back" | "Create your account" |
| Fields | email, password | email, password, confirm-password |
| Button Text | "Sign In" | "Create Account" |
| Footer Link | "Don't have an account? Sign up" | "Already have an account? Sign in" |
| Footer Link 2 | "Forgot password?" | - |

---

## 파일 구조

```
app/
└── signup/
    ├── page.tsx              # Signup Page
    └── SignupForm.tsx        # Signup Form (Client Component)
```

---

## 의존성

- next/navigation - useRouter, redirect
- 공통 컴포넌트: Logo, AuthCard, Input, Button
- Server Action: signup
- Supabase Auth
