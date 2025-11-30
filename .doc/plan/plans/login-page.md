# Login Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/login` |
| **파일** | `app/login/page.tsx` |
| **HTML 소스** | login.html |
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
      - heading: "Welcome back"
      - form (space-y-4)
        - email-input (with label)
        - password-input (with label)
        - submit-button (primary, full-width)
      - footer-links
        - "Don't have an account? Sign up"
        - "Forgot password?"
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Logo | 공통 | `components/ui/Logo.tsx` |
| AuthCard | 공통 | `components/layout/AuthCard.tsx` |
| Input | 공통 | `components/ui/Input.tsx` |
| Button | 공통 | `components/ui/Button.tsx` |
| LoginForm | 페이지전용 | `app/login/LoginForm.tsx` |

---

## 컴포넌트 상세

### LoginForm

```typescript
// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    
    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
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
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <div className="pt-2">
        <Button type="submit" fullWidth loading={loading}>
          Sign In
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
  <div class="pt-2">
    <button class="w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90" type="submit">Sign In</button>
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

export async function login(formData: FormData) {
  const supabase = createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const { error } = await supabase.auth.signInWithPassword({
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
- [ ] Supabase Auth `signInWithPassword` 호출
- [ ] 로그인 성공 시 `/dashboard`로 리다이렉트
- [ ] 로그인 실패 시 에러 메시지 표시
- [ ] 이미 로그인된 사용자는 `/dashboard`로 리다이렉트
- [ ] 로딩 상태 표시

### 리다이렉트 체크
```typescript
// app/login/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
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
- [ ] `app/login/page.tsx` 생성
- [ ] AuthCard 레이아웃 적용
- [ ] Logo 배치

### Phase 2: Form 구현
- [ ] `app/login/LoginForm.tsx` 생성 (Client Component)
- [ ] Input 컴포넌트 연결 (email, password)
- [ ] Button 컴포넌트 연결

### Phase 3: Server Action 연결
- [ ] `actions/auth.ts` - login 함수 구현
- [ ] Supabase Auth 연동
- [ ] 에러 처리

### Phase 4: 부가 기능
- [ ] 로딩 상태 표시
- [ ] 이미 로그인된 사용자 리다이렉트
- [ ] Footer 링크 (Sign up, Forgot password)

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

### Input
| 요소 | 값 |
|------|-----|
| Label | text-sm font-medium text-gray-700 mb-1.5 |
| Input | rounded-lg border-gray-300 shadow-sm |
| Focus | focus:border-primary focus:ring-primary |

### Typography
| 요소 | 스타일 |
|------|--------|
| Heading | text-2xl font-bold text-gray-900 |
| Footer Links | text-sm text-gray-600 |
| Link Hover | hover:text-primary hover:underline |

---

## 파일 구조

```
app/
└── login/
    ├── page.tsx              # Login Page
    └── LoginForm.tsx         # Login Form (Client Component)
```

---

## 의존성

- next/navigation - useRouter, redirect
- 공통 컴포넌트: Logo, AuthCard, Input, Button
- Server Action: login
- Supabase Auth
