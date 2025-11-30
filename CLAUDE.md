# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint-config-next with TypeScript)
```

## Architecture

- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 (imported via `@import "tailwindcss"` in globals.css)
- **Fonts**: Geist Sans and Geist Mono via `next/font/google`

### Project Structure

```
app/
  layout.tsx    # Root layout with font configuration and metadata
  page.tsx      # Home page component
  globals.css   # Tailwind import + CSS custom properties for theming
```

### Path Aliases

`@/*` maps to project root (configured in tsconfig.json)

### Theming

CSS custom properties in `globals.css` handle light/dark mode:
- `--background` and `--foreground` switch based on `prefers-color-scheme`
- Tailwind theme extends these via `@theme inline` block
