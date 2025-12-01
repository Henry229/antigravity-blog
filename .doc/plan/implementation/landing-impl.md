# Landing Page 구현 계획

## 개요

SimpleBlog 애플리케이션의 랜딩 페이지 상세 구현 계획.

- **User Flow**: 사용자가 블로그에 처음 방문
- **라우트**: `/`
- **인증 필요**: ❌
- **주요 기능**: 서비스 소개, 회원가입/로그인 유도, 블로그 둘러보기

---

## 페이지 구조 (plan-based-page에서)

```
- Header (공통, variant='landing')
- Main
  - HeroSection
    - Headline: "Write. Publish. Share."
    - Subtext
    - CTA Buttons: "Get Started", "Read Blog"
  - FeatureSection
    - Section Title
    - 3-column Grid
      - FeatureCard (Markdown Editor)
      - FeatureCard (Instant Publish)
      - FeatureCard (Own Your Content)
- Footer (공통, variant='simple')
```

---

## 의존성

### 이미 설치됨 (shared-components-impl.md에서)

```bash
npm install lucide-react clsx tailwind-merge
```

### 공통 컴포넌트 Import 경로

| 컴포넌트 | Import Path |
|---------|-------------|
| Header | `@/components/layout/Header` |
| Footer | `@/components/layout/Footer` |
| Button | `@/components/ui/Button` |
| Logo | `@/components/ui/Logo` |

### 아이콘 (Lucide React)

| Feature | Lucide Icon |
|---------|-------------|
| Markdown Editor | `PenLine` |
| Instant Publish | `Rocket` |
| Own Your Content | `Lock` |

---

## Task List

### 0. 페이지 라우트 생성

**상태:** - [x] 완료
**파일:** `app/page.tsx`

**요구사항:**
- [x] `app/page.tsx` 파일 생성
- [x] metadata 설정 (title, description)
- [x] Server Component로 구현

**기본 구조:**

```typescript
import { Metadata } from "next"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "./(home)/HeroSection"
import { FeatureSection } from "./(home)/FeatureSection"

export const metadata: Metadata = {
  title: "SimpleBlog - Write. Publish. Share.",
  description: "Minimal Markdown blogging for developers. Everything you need to start your developer blog, and nothing you don't.",
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f6f8] dark:bg-gray-900">
      <Header variant="landing" />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}
```

**완료 조건:**
- [x] 페이지 정상 렌더링
- [x] metadata 적용 확인 (브라우저 탭 타이틀)

---

### 1. Route Group 폴더 생성

**상태:** - [x] 완료
**파일:** `app/(home)/` 폴더

**요구사항:**
- [x] `app/(home)/` 폴더 생성 (route group)
- [x] 페이지 전용 컴포넌트 배치용

**완료 조건:**
- [x] 폴더 구조 정상 생성

---

### 2. HeroSection 컴포넌트

**상태:** - [x] 완료
**파일:** `app/(home)/HeroSection.tsx`

**요구사항:**
- [x] Headline: "Write. Publish. Share."
- [x] Subtext: 서비스 설명
- [x] CTA 버튼 2개 (Get Started, Read Blog)
- [x] 반응형 레이아웃 (모바일 → 데스크탑)
- [x] 중앙 정렬

**비즈니스 로직:**
- [x] "Get Started" 클릭 → `/signup` 이동
- [x] "Read Blog" 클릭 → `/blog` 이동
- [x] (선택) 로그인 상태면 "Get Started" → `/dashboard` 이동

**스타일 (HTML에서 추출):**

| 요소 | 스타일 |
|------|--------|
| Section Padding | py-20 sm:py-28 |
| Headline | text-5xl sm:text-6xl font-black tracking-tighter text-gray-900 max-w-2xl |
| Subtext | text-lg font-normal text-gray-600 max-w-xl |
| Button Gap | gap-4 |

**Props Interface:**

```typescript
// 이 컴포넌트는 props 없음 (static content)
```

**기본 구조:**

```typescript
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export function HeroSection() {
  return (
    <section className="py-20 text-center sm:py-28">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4">
        {/* Headlines */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl text-5xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-6xl">
            Write. Publish. Share.
          </h1>
          <p className="max-w-xl text-lg font-normal text-gray-600 dark:text-gray-400">
            Minimal Markdown blogging for developers. Everything you need to start your developer blog, and nothing you don't.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <Link href="/blog">Read Blog</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

**완료 조건:**
- [x] Headline 정상 표시 (반응형 폰트 크기)
- [x] Subtext 정상 표시
- [x] CTA 버튼 정상 동작
- [x] 모바일에서 레이아웃 정상
- [x] 다크모드 지원

---

### 3. FeatureCard 컴포넌트

**상태:** - [x] 완료
**파일:** `app/(home)/FeatureCard.tsx`

**요구사항:**
- [x] 아이콘 영역 (Lucide React 사용)
- [x] 제목
- [x] 설명
- [x] 카드 스타일 (border, rounded, padding)
- [x] 다크모드 지원

**Props Interface:**

```typescript
import { LucideIcon } from "lucide-react"

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}
```

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Card | rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 |
| Icon | text-primary text-3xl (w-8 h-8) |
| Title | text-lg font-bold text-gray-900 dark:text-white |
| Description | text-sm text-gray-600 dark:text-gray-400 |

**기본 구조:**

```typescript
import { LucideIcon } from "lucide-react"

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      {/* Icon */}
      <div className="text-primary">
        <Icon className="h-8 w-8" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  )
}
```

**완료 조건:**
- [x] 아이콘 정상 표시
- [x] 제목/설명 정상 표시
- [x] 카드 스타일 적용
- [x] 다크모드 지원

---

### 4. FeatureSection 컴포넌트

**상태:** - [x] 완료
**파일:** `app/(home)/FeatureSection.tsx`

**요구사항:**
- [x] 섹션 제목 (선택)
- [x] 3-column 그리드 레이아웃
- [x] 반응형 (1열 → 2열 → 3열)
- [x] FeatureCard 3개 배치

**스타일:**

| 요소 | 스타일 |
|------|--------|
| Section Padding | py-16 sm:py-20 |
| Max Width | max-w-5xl |
| Grid | grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 |
| Grid Gap | gap-6 |

**Feature Data:**

```typescript
import { PenLine, Rocket, Lock } from "lucide-react"

const features = [
  {
    icon: PenLine,
    title: "Markdown Editor",
    description: "A clean, intuitive writing environment that gets out of your way and lets you focus on your content."
  },
  {
    icon: Rocket,
    title: "Instant Publish",
    description: "Go from draft to live in seconds. Share your ideas with the world without any friction."
  },
  {
    icon: Lock,
    title: "Own Your Content",
    description: "You have full control over your data. Export your content anytime, no questions asked."
  }
]
```

**기본 구조:**

```typescript
import { PenLine, Rocket, Lock } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

const features = [
  {
    icon: PenLine,
    title: "Markdown Editor",
    description: "A clean, intuitive writing environment that gets out of your way and lets you focus on your content."
  },
  {
    icon: Rocket,
    title: "Instant Publish",
    description: "Go from draft to live in seconds. Share your ideas with the world without any friction."
  },
  {
    icon: Lock,
    title: "Own Your Content",
    description: "You have full control over your data. Export your content anytime, no questions asked."
  }
]

export function FeatureSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Optional: Section Title */}
        {/* <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Features
        </h2> */}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**완료 조건:**
- [x] 3개의 FeatureCard 정상 표시
- [x] 반응형 그리드 동작 (1열 → 2열 → 3열)
- [x] 모바일에서 레이아웃 정상
- [x] 다크모드 지원

---

### 5. Landing Page 조립

**상태:** - [x] 완료
**파일:** `app/page.tsx`

**요구사항:**
- [x] Header (variant='landing') import
- [x] HeroSection import
- [x] FeatureSection import
- [x] Footer import
- [x] 전체 레이아웃 구성

**완료 조건:**
- [x] 전체 페이지 정상 렌더링
- [x] 공통 컴포넌트 정상 표시
- [x] 페이지 전용 컴포넌트 정상 표시

---

## 구현 순서

1. **Route Group 폴더 생성** - `app/(home)/` 폴더 생성
2. **FeatureCard 컴포넌트** - 재사용 가능한 카드 컴포넌트 먼저 구현
3. **FeatureSection 컴포넌트** - FeatureCard를 사용하는 섹션 구현
4. **HeroSection 컴포넌트** - 히어로 섹션 구현
5. **Landing Page 조립** - `app/page.tsx`에서 모든 컴포넌트 조합
6. **링크 연결 및 테스트** - 버튼 클릭 동작 확인

---

## 검증 체크리스트

### HeroSection
- [x] Headline 텍스트 정상 표시
- [x] 반응형 폰트 크기 (text-5xl → text-6xl)
- [x] Subtext 정상 표시
- [x] "Get Started" 버튼 → `/signup` 이동
- [x] "Read Blog" 버튼 → `/blog` 이동
- [x] 모바일에서 레이아웃 정상
- [x] 다크모드 지원

### FeatureCard
- [x] Lucide 아이콘 정상 표시
- [x] 제목/설명 정상 표시
- [x] 카드 스타일 (border, rounded, shadow)
- [x] 다크모드 지원

### FeatureSection
- [x] 3개 카드 정상 표시
- [x] 반응형 그리드 (1열 → 2열 → 3열)
- [x] 카드 간 간격 정상

### Landing Page
- [x] Header (landing variant) 정상 표시
- [x] HeroSection 정상 표시
- [x] FeatureSection 정상 표시
- [x] Footer 정상 표시
- [x] 전체 레이아웃 정상
- [x] 스크롤 동작 정상
- [x] 다크모드 전환 정상

---

## 파일 구조 요약

```
app/
├── page.tsx                    # Landing Page (메인)
└── (home)/                     # Route Group (URL에 영향 없음)
    ├── HeroSection.tsx         # Hero 섹션
    ├── FeatureSection.tsx      # Feature 섹션
    └── FeatureCard.tsx         # Feature 카드 컴포넌트
```

---

## 스타일 요약

### Colors (globals.css에서 정의)

| 요소 | 색상 |
|------|------|
| Primary | `#2463eb` (또는 `#4A90E2`) |
| Background | `#f6f6f8` (light) / `gray-900` (dark) |
| Text Heading | `gray-900` / `white` |
| Text Body | `gray-600` / `gray-400` |
| Border | `gray-200` / `gray-700` |

### Typography

| 요소 | 스타일 |
|------|--------|
| Main Headline | text-5xl sm:text-6xl font-black tracking-tighter |
| Subtext | text-lg font-normal |
| Feature Title | text-lg font-bold |
| Feature Description | text-sm font-normal |

### Spacing

| 요소 | 값 |
|------|-----|
| Hero Section | py-20 sm:py-28 |
| Feature Section | py-16 sm:py-20 |
| Feature Grid Gap | gap-6 |
| Feature Card Padding | p-6 |
| Container Max Width | max-w-5xl |

---

## 참고 사항

### Material Symbols → Lucide React 변환

| HTML (Material Symbols) | React (Lucide) |
|-------------------------|----------------|
| `draw` | `PenLine` |
| `rocket_launch` | `Rocket` |
| `lock` | `Lock` |

### 공통 컴포넌트 의존성

이 페이지는 다음 공통 컴포넌트가 먼저 구현되어야 합니다:

1. **Header** (`components/layout/Header.tsx`) - `variant="landing"` 필요
2. **Footer** (`components/layout/Footer.tsx`)
3. **Button** (`components/ui/Button.tsx`) - `variant`, `size`, `asChild` props 필요
4. **Logo** (`components/ui/Logo.tsx`) - Header 내부에서 사용

→ `shared-components-impl.md` 참조

---

## 추가 개선 사항 (선택)

### Phase 2: 인증 연동

- [x] 로그인 상태 확인 로직 추가
- [x] 로그인 시 "Get Started" → `/dashboard` 이동
- [x] Header에서 로그인 상태 표시

### Phase 3: 애니메이션

- [x] Hero 섹션 fade-in 애니메이션
- [x] Feature 카드 hover 효과
- [x] 스크롤 애니메이션 (Intersection Observer)
