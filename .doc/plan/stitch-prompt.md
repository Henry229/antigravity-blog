# Google Stitch 프롬프트: SimpleBlog

## 🎨 디자인 시스템

```
Design system for SimpleBlog - a minimal blogging platform.

Colors:
- Primary: #2563EB (Blue)
- Secondary: #64748B (Slate gray)
- Background: #FFFFFF (White)
- Surface: #F8FAFC (Light gray)
- Text: #1E293B (Dark slate)
- Success: #22C55E (Green)
- Border: #E2E8F0 (Light border)

Typography:
- Headings: Inter, bold
- Body: Inter, regular
- Code/Monospace: JetBrains Mono

Spacing:
- Base: 16px
- Large: 24px
- XLarge: 32px

Border radius: 8px
Shadow: subtle, 0 1px 3px rgba(0,0,0,0.1)
```

---

## 📱 페이지별 프롬프트

### 1. Landing Page
**User Flow Step**: 사용자가 블로그에 처음 방문
**Stitch 프롬프트**:
```
Create a web landing page for SimpleBlog - a minimal blogging platform.

Purpose: Introduce the product and direct users to login/signup or read blog posts

Layout:
- Header: Logo on left, "Login" and "Sign Up" buttons on right
- Hero: Large headline, subtext, primary CTA button
- Features: 3-column grid showing key benefits
- Footer: Minimal with copyright

Components:
- Logo text "SimpleBlog" with pen icon
- Hero headline "Write. Publish. Share."
- Subtext "Minimal Markdown blogging for developers"
- Primary button "Get Started" (blue, rounded)
- Secondary button "Read Blog" (outlined)
- Feature cards: "Markdown Editor", "Instant Publish", "Own Your Content"

Design:
- White background
- Blue primary (#2563EB)
- Clean, modern, lots of whitespace
- 16px base padding
- Rounded corners 8px
```

---

### 2. Blog List Page
**User Flow Step**: 5. 공개 URL 확인 - 블로그 글 목록
**Stitch 프롬프트**:
```
Create a web blog listing page for SimpleBlog.

Purpose: Display all published blog posts in a clean list format

Layout:
- Header: Logo left, navigation links right (Home, Login)
- Main: List of blog post cards, single column, centered
- Footer: Minimal with links

Components:
- Navigation bar with logo and links
- Post cards in vertical list (max-width 720px, centered)
- Each card shows: title, excerpt (2 lines), published date, read time
- "Load more" button at bottom

Design:
- White background
- Cards have subtle shadow and border
- Blue title links (#2563EB)
- Gray meta text (#64748B)
- 24px spacing between cards
- Rounded corners 8px
```

---

### 3. Single Post Page
**User Flow Step**: 5. /blog/[slug] 개별 포스트 페이지
**Stitch 프롬프트**:
```
Create a web blog post reading page for SimpleBlog.

Purpose: Display a single blog post with full content in Markdown-rendered format

Layout:
- Header: Logo and back link to blog list
- Main: Article content (max-width 680px, centered)
- Footer: Author info, published date

Components:
- Back arrow link "← All posts"
- Article title (large, 36px heading)
- Meta: Published date, reading time
- Article body with Markdown styling (headings, paragraphs, code blocks, lists)
- Horizontal divider
- Footer with "Written by [Author]"

Design:
- White background
- Typography-focused, readable line-height (1.7)
- Code blocks with gray background (#F8FAFC)
- Blue links
- Generous padding and whitespace
```

---

### 4. Login Page
**User Flow Step**: 1. 로그인/회원가입
**Stitch 프롬프트**:
```
Create a web login page for SimpleBlog.

Purpose: Allow existing users to sign in with email and password

Layout:
- Centered card on light gray background
- Logo at top
- Form fields in card
- Links below form

Components:
- Logo "SimpleBlog" centered at top
- Card container (max-width 400px, white, shadow)
- Heading "Welcome back"
- Email input field with label
- Password input field with label
- "Sign In" primary button (full-width, blue)
- Text link "Don't have an account? Sign up"
- Text link "Forgot password?"

Design:
- Light gray background (#F8FAFC)
- White card with rounded corners (12px)
- Blue primary button (#2563EB)
- Input fields with border, rounded 8px
- 16px spacing between elements
```

---

### 5. Signup Page
**User Flow Step**: 1. 로그인/회원가입
**Stitch 프롬프트**:
```
Create a web signup page for SimpleBlog.

Purpose: Allow new users to create an account with email and password

Layout:
- Centered card on light gray background
- Logo at top
- Form fields in card
- Link to login below

Components:
- Logo "SimpleBlog" centered at top
- Card container (max-width 400px, white, shadow)
- Heading "Create your account"
- Email input field with label
- Password input field with label
- Confirm password input field with label
- "Create Account" primary button (full-width, blue)
- Text link "Already have an account? Sign in"

Design:
- Light gray background (#F8FAFC)
- White card with rounded corners (12px)
- Blue primary button (#2563EB)
- Input fields with border, rounded 8px
- 16px spacing between elements
```

---

### 6. Dashboard Page
**User Flow Step**: 2. 대시보드 진입 - 글 목록 확인
**Stitch 프롬프트**:
```
Create a web dashboard page for SimpleBlog - post management.

Purpose: Show user's posts (drafts and published) with management actions

Layout:
- Header: Logo, user avatar with dropdown, "New Post" button
- Sidebar: Navigation (All Posts, Drafts, Published)
- Main: Post list table or cards

Components:
- Top bar with logo, "New Post" button (blue), user avatar
- Sidebar navigation with active state indicator
- Stats summary: "X Published, Y Drafts"
- Post list table with columns: Title, Status badge, Updated date, Actions
- Status badges: "Published" (green), "Draft" (gray)
- Action buttons: Edit, Delete (icon buttons)
- Empty state if no posts

Design:
- White background
- Sidebar light gray (#F8FAFC)
- Blue "New Post" button
- Green published badge, gray draft badge
- Table rows with hover state
- 16px padding throughout
```

---

### 7. New Post / Edit Post Page
**User Flow Step**: 3. 새 글 작성 - Markdown 에디터
**Stitch 프롬프트**:
```
Create a web post editor page for SimpleBlog with Markdown editor.

Purpose: Write and edit blog posts using Markdown with preview

Layout:
- Header: Back link, post title input, Save Draft and Publish buttons
- Main: Split view - editor left, preview right (or tabbed on mobile)

Components:
- Back arrow link "← Dashboard"
- Title input (large, borderless, placeholder "Post title...")
- Toolbar: Bold, Italic, Heading, Link, Code, Image URL buttons
- Markdown editor textarea (monospace font)
- Preview panel showing rendered Markdown
- Bottom bar: "Save Draft" button (outlined), "Publish" button (blue)
- Auto-save indicator "Saved just now"

Design:
- Clean, distraction-free writing experience
- Editor: monospace font, line numbers optional
- Preview: styled like blog post page
- Minimal chrome, maximum content area
- Blue publish button, gray save draft button
- Split view with subtle divider
```

---

### 8. Post Published Success
**User Flow Step**: 4. 발행 클릭 → 즉시 공개
**Stitch 프롬프트**:
```
Create a web success modal/page for SimpleBlog after publishing.

Purpose: Confirm post was published and provide share options

Layout:
- Centered modal or full page
- Success icon, message, action buttons

Components:
- Success checkmark icon (green, large)
- Heading "Post Published!"
- Subtext "Your post is now live at:"
- Post URL in copyable field with copy button
- "View Post" primary button (blue)
- "Back to Dashboard" secondary link
- Share buttons: Twitter, LinkedIn, Copy link

Design:
- White background or modal overlay
- Green success icon (#22C55E)
- URL field with copy icon button
- Blue primary action button
- Clean, celebratory but minimal
```

---

## 💡 Stitch 사용 가이드

### 순서
1. **디자인 시스템** 프롬프트를 먼저 Stitch에서 생성하여 일관된 스타일 확립
2. **Landing Page**부터 시작하여 순차적으로 생성
3. 각 페이지 생성 후 "Edit" 기능으로 세부 조정

### 저장 구조
```
/ui-spec/
├── design-system.html
├── landing-page.html
├── blog-list-page.html
├── single-post-page.html
├── login-page.html
├── signup-page.html
├── dashboard-page.html
├── post-editor-page.html
└── publish-success-modal.html
```

### Tips
- Stitch에서 생성 후 마음에 들지 않으면 "Regenerate" 클릭
- 색상이나 레이아웃 수정은 "Edit" 모드에서 직접 수정
- 생성된 HTML 코드를 다운로드하여 프로젝트에 통합

---

## 📋 페이지-PRD 매핑 요약

| Page | PRD Section | MVP Feature |
|------|-------------|-------------|
| Landing | One-Liner, Solution | 공개 블로그 페이지 |
| Blog List | Page Structure /blog | 공개 글 목록 |
| Single Post | Page Structure /blog/[slug] | 개별 포스트 URL |
| Login | User Flow Step 1 | 기본 인증 |
| Signup | User Flow Step 1 | 기본 인증 |
| Dashboard | User Flow Step 2 | 글 목록 (대시보드) |
| Post Editor | User Flow Step 3 | Markdown 에디터, 글 발행/임시저장 |
| Publish Success | User Flow Step 4-5 | 글 발행 |