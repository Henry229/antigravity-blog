# Next.js Supabase Auth Template Installation

You are installing a production-ready authentication system for a Next.js 15 + Supabase project.

## Your Task

1. **Verify Prerequisites**:
   - Confirm this is a Next.js 15+ project (check package.json)
   - Confirm Supabase is configured (check for existing supabase config)
   - Check if shadcn/ui is installed

2. **Copy Template Files**:
   Copy all files from the skill's `templates/` directory to the project:

   ```
   templates/app/actions/auth.ts                 → app/actions/auth.ts
   templates/app/auth/*                          → app/auth/*
   templates/components/auth/*                   → components/auth/*
   templates/lib/auth.config.ts                  → lib/auth.config.ts
   templates/lib/env.ts                          → lib/env.ts
   templates/lib/supabase/*                      → lib/supabase/*
   templates/middleware.ts                       → middleware.ts
   templates/supabase/migrations/*               → supabase/migrations/*
   ```

3. **Show Installation Guide**:
   Display the contents of `templates/INSTALL.md` to the user.

4. **Provide Next Steps**:
   ```
   ✅ Files copied successfully!

   📋 Next Steps:

   1. Install dependencies:
      npm install @supabase/supabase-js @supabase/ssr lucide-react

   2. Set up environment variables (.env.local):
      NEXT_PUBLIC_SUPABASE_URL=your-url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
      NEXT_PUBLIC_SITE_URL=http://localhost:3000

   3. Create profiles table (SQL in INSTALL.md)

   4. Configure auth.config.ts:
      - Update redirects.afterLogin to your dashboard path

   5. Test:
      npm run dev
      Visit: http://localhost:3000/auth/signup

   📖 Full guide: See INSTALL.md in project root
   ```

## Important Notes

- **DO NOT** overwrite existing auth files without asking
- **DO NOT** modify existing database tables
- **DO** ask user for confirmation if files already exist
- **DO** provide clear next steps

## File Locations

All template files are in: `~/.claude/skills/nextjs-supabase-auth/templates/`

## Expected Outcome

After running this skill:
- ✅ All auth files copied to project
- ✅ Configuration files created
- ✅ User has clear installation guide
- ✅ User knows exactly what to do next
