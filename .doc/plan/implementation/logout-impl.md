# Logout 기능 구현 계획

## 개요

SimpleBlog 로그아웃 기능 구현

- **User Flow Step**: 1 - 로그인/회원가입
- **주요 기능**: 세션 종료 및 로그인 페이지로 리다이렉트
- **인증 필요**: ✅ (로그인된 사용자만 사용)

---

## 현재 상태

- `actions/auth.ts`: signup, login만 구현됨
- 로그아웃 기능 완전 미구현
- 대시보드 헤더에 로그아웃 UI 없음

---

## Task List

### 1. Logout Server Action

**상태:** - [x] 완료
**파일:** `actions/auth.ts`

**요구사항:**
- [x] Server Action으로 구현 ("use server")
- [x] Supabase Auth `signOut` 호출
- [x] 세션 쿠키 제거
- [x] 에러 처리

**기본 구조:**

```typescript
// actions/auth.ts에 추가
export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
```

**완료 조건:**
- [x] Supabase signOut 호출 성공
- [x] 세션 쿠키 제거됨
- [x] 에러 처리 완료

---

### 2. 대시보드 헤더 로그아웃 버튼

**상태:** - [x] 완료
**파일:** `app/dashboard/DashboardHeader.tsx`

**요구사항:**
- [x] 사용자 아바타 클릭 시 드롭다운 메뉴
- [x] 로그아웃 버튼 포함
- [x] 로그아웃 시 로딩 상태 표시
- [x] 성공 시 `/login`으로 리다이렉트

**UI 구조:**

```
DashboardHeader
├── New Post 버튼
└── UserMenu (새로 추가)
    ├── 아바타/이메일 표시
    └── 드롭다운
        ├── Profile (선택)
        └── Logout 버튼
```

**완료 조건:**
- [x] 드롭다운 메뉴 동작
- [x] 로그아웃 버튼 클릭 시 logout action 호출
- [x] 로딩 상태 표시
- [x] 성공 시 로그인 페이지로 이동

---

### 3. UserMenu 컴포넌트 (선택)

**상태:** - [x] 완료
**파일:** `app/dashboard/UserMenu.tsx`

**요구사항:**
- [x] Client Component ("use client")
- [x] 아바타 + 드롭다운 메뉴
- [x] 외부 클릭 시 닫힘
- [x] logout action props로 전달받기

**Props Interface:**

```typescript
interface UserMenuProps {
  userEmail: string
  userAvatar?: string
  logoutAction: () => Promise<{ error?: string; success?: boolean }>
}
```

**완료 조건:**
- [x] 드롭다운 열림/닫힘 동작
- [x] 로그아웃 기능 정상 동작
- [x] 접근성 (키보드 네비게이션)

---

## 구현 순서

1. `actions/auth.ts`에 `logout` 함수 추가
2. `UserMenu.tsx` 컴포넌트 생성
3. `DashboardHeader.tsx` 수정 - UserMenu 통합
4. 테스트 및 에러 처리 보완

---

## 파일 구조

```
actions/
└── auth.ts                   # logout 추가

app/dashboard/
├── DashboardHeader.tsx       # UserMenu 통합
└── UserMenu.tsx              # 새로 생성
```

---

## 검증 체크리스트

### Logout Action
- [x] Supabase signOut 호출
- [x] 세션 쿠키 제거
- [x] 에러 처리

### UserMenu
- [x] 드롭다운 열림/닫힘
- [x] 외부 클릭 시 닫힘
- [x] 로그아웃 버튼 동작

### 통합
- [x] 로그아웃 후 `/login` 리다이렉트
- [x] 로그아웃 후 대시보드 접근 불가
- [x] 다크모드 지원

---

## 비즈니스 로직 흐름

```
[User] → 아바타 클릭
         ↓
[Client] → 드롭다운 메뉴 표시
         ↓
[User] → "Logout" 클릭
         ↓
[Client] → logout action 호출
         ↓
[Server] → Supabase signOut
         ↓
    ┌─ 에러 → 에러 메시지 표시
    └─ 성공 → 세션 제거
         ↓
[Client] → router.push("/login")
```
