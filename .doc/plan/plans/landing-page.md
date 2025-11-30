# Landing Page 구현 계획

## 페이지 정보

| 항목 | 값 |
|------|-----|
| **라우트** | `/` |
| **파일** | `app/page.tsx` |
| **HTML 소스** | landing.html |
| **User Flow** | 사용자가 블로그에 처음 방문 |
| **인증 필요** | ❌ |

---

## HTML 구조 분석

```
- header (Landing variant)
  - logo (edit icon)
  - nav: Login button, Sign Up button
- main
  - hero-section
    - headline: "Write. Publish. Share."
    - subtext
    - CTA buttons: "Get Started", "Read Blog"
  - feature-section
    - section title
    - 3-column grid
      - feature-card (Markdown Editor)
      - feature-card (Instant Publish)
      - feature-card (Own Your Content)
- footer (간단한 버전)
  - copyright text
```

---

## 필요 컴포넌트

| 컴포넌트 | 유형 | 파일 |
|---------|------|------|
| Header | 공통 (landing variant) | `components/layout/Header.tsx` |
| Logo | 공통 | `components/ui/Logo.tsx` |
| Button | 공통 | `components/ui/Button.tsx` |
| HeroSection | 페이지전용 | `app/(home)/HeroSection.tsx` |
| FeatureSection | 페이지전용 | `app/(home)/FeatureSection.tsx` |
| FeatureCard | 페이지전용 | `app/(home)/FeatureCard.tsx` |
| Footer | 공통 (simple variant) | `components/layout/Footer.tsx` |

---

## 컴포넌트 상세

### HeroSection

```typescript
// app/(home)/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="py-20 sm:py-28 text-center">
      <div className="flex flex-col gap-6 px-4">
        <h1>Write. Publish. Share.</h1>
        <p>Minimal Markdown blogging for developers...</p>
        <div className="flex gap-4 justify-center">
          <Button>Get Started</Button>
          <Button variant="secondary">Read Blog</Button>
        </div>
      </div>
    </section>
  );
}
```

**HTML 추출**:
```html
<div class="py-20 sm:py-28 text-center">
  <div class="flex flex-col gap-6 px-4">
    <div class="flex flex-col gap-4 text-center items-center">
      <h1 class="text-gray-900 text-5xl font-black leading-tight tracking-tighter sm:text-6xl max-w-2xl">
        Write. Publish. Share.
      </h1>
      <h2 class="text-gray-600 text-lg font-normal leading-normal max-w-xl">
        Minimal Markdown blogging for developers. Everything you need to start your developer blog, and nothing you don't.
      </h2>
    </div>
    <div class="flex-wrap gap-4 flex items-center justify-center">
      <button class="... bg-primary text-white">Get Started</button>
      <button class="... bg-transparent border">Read Blog</button>
    </div>
  </div>
</div>
```

### FeatureCard

```typescript
// app/(home)/FeatureCard.tsx
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-1 gap-4 rounded-lg border border-gray-200 bg-white p-6 flex-col">
      <div className="text-primary">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-gray-900 text-lg font-bold">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
```

### Feature Data

```typescript
const features = [
  {
    icon: 'draw',
    title: 'Markdown Editor',
    description: 'A clean, intuitive writing environment that gets out of your way and lets you focus on your content.'
  },
  {
    icon: 'rocket_launch',
    title: 'Instant Publish',
    description: 'Go from draft to live in seconds. Share your ideas with the world without any friction.'
  },
  {
    icon: 'lock',
    title: 'Own Your Content',
    description: "You have full control over your data. Export your content anytime, no questions asked."
  }
];
```

---

## 비즈니스 로직 (PRD에서)

- [ ] "Get Started" 클릭 → `/signup` 이동
- [ ] "Read Blog" 클릭 → `/blog` 이동
- [ ] "Login" 클릭 → `/login` 이동
- [ ] "Sign Up" 클릭 → `/signup` 이동
- [ ] 로그인 상태면 "Get Started" → `/dashboard` 이동

---

## 구현 태스크

### Phase 1: 기본 구조
- [ ] `app/page.tsx` 생성
- [ ] 공통 Header 연결 (variant='landing')
- [ ] 공통 Footer 연결 (variant='simple')

### Phase 2: Hero Section
- [ ] `app/(home)/HeroSection.tsx` 구현
- [ ] Headline, Subtext 스타일링
- [ ] CTA 버튼 2개 배치
- [ ] 반응형 (sm:py-28, sm:text-6xl)

### Phase 3: Feature Section
- [ ] `app/(home)/FeatureSection.tsx` 구현
- [ ] `app/(home)/FeatureCard.tsx` 구현
- [ ] 3-column grid (lg:grid-cols-3)
- [ ] Material Symbols 아이콘 적용

### Phase 4: 연결
- [ ] Link 컴포넌트로 버튼 감싸기
- [ ] 로그인 상태 확인 로직 (선택적)

---

## 스타일 (HTML에서 추출)

### Colors
| 요소 | 색상 |
|------|------|
| Primary | `#2463eb` |
| Background | `#f6f6f8` (light) |
| Text Heading | `#1F2937` (gray-900) |
| Text Body | `#4B5563` (gray-600) |
| Border | `#E5E7EB` (gray-200) |

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

### Layout
| 요소 | 값 |
|------|-----|
| Max Width Container | max-w-5xl |
| Feature Grid | grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 |

---

## 파일 구조

```
app/
├── page.tsx                    # Landing Page (메인)
└── (home)/
    ├── HeroSection.tsx         # Hero 섹션
    ├── FeatureSection.tsx      # Feature 섹션
    └── FeatureCard.tsx         # Feature 카드
```

---

## 의존성

- Material Symbols Outlined (아이콘)
- next/link (라우팅)
- 공통 컴포넌트: Header, Footer, Button, Logo
