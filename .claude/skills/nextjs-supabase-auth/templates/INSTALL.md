# Installation Guide

## Prerequisites

1. Next.js 15+ project
2. Supabase project created
3. shadcn/ui installed with these components:
   ```bash
   npx shadcn@latest add button input label card
   ```

## Step 1: Copy Files

All files from `templates/` directory have been copied to your project:

```
✅ app/actions/auth.ts
✅ app/auth/* (login, signup, callback, etc.)
✅ components/auth/* (forms & buttons)
✅ lib/auth.config.ts
✅ lib/env.ts
✅ lib/supabase/*
✅ middleware.ts
✅ supabase/migrations/*
```

## Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react
```

## Step 3: Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 4: Database Setup

### Create Profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  mobile TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own complete profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### Apply Migration

Run the migration in `supabase/migrations/fix_function_search_path.sql` to secure your functions.

## Step 5: Configure Auth

Edit `lib/auth.config.ts`:

```typescript
export const authConfig = {
  redirects: {
    afterLogin: '/dashboard',      // ← Change to your path
    afterLogout: '/auth/login',
    afterSignup: '/dashboard',
    protectedRoute: '/auth/login',
  },
  // ... rest stays the same
}
```

## Step 6: Enable OAuth (Optional)

In Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Google**
3. Add redirect URL: `{NEXT_PUBLIC_SITE_URL}/auth/callback`
4. Configure Google OAuth credentials

## Step 7: Update Root Layout

Add environment validation to `app/layout.tsx`:

```typescript
import { validateEnv } from '@/lib/env'

// Add at the top level
validateEnv()
```

## Step 8: Test

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/auth/signup`
3. Create account
4. Check Supabase Dashboard → Authentication → Users
5. Check Database → profiles table

## Customization

### Change Profile Fields

Edit `app/actions/auth.ts` signup function:

```typescript
.upsert({
  user_id: authData.user.id,
  email: authData.user.email,
  first_name,  // ← Add/remove fields
  last_name,
  mobile,
  role: 'user',
})
```

### Change UI Text

Edit component files in `components/auth/`:
- LoginForm.tsx
- SignupForm.tsx
- etc.

### Change Password Policy

Edit `lib/auth.config.ts`:

```typescript
password: {
  minLength: 8,  // ← Change requirements
  requireUppercase: false,
  // ...
}
```

## Troubleshooting

**Environment variable error on startup?**
→ Check `.env.local` has all required variables

**Profile not created after signup?**
→ Check Supabase logs and RLS policies

**OAuth redirect not working?**
→ Verify redirect URL in Supabase Dashboard matches your SITE_URL

**Session expires immediately?**
→ Check middleware.ts is configured correctly

## Security Checklist

✅ RLS enabled on profiles table
✅ Environment variables not committed (.gitignore includes .env*)
✅ PKCE flow enabled for OAuth
✅ Function search_path set
✅ Password policy enforced

## Next Steps

- [ ] Customize redirect paths in `auth.config.ts`
- [ ] Enable email confirmation in Supabase Dashboard (optional)
- [ ] Configure OAuth providers (optional)
- [ ] Customize UI components to match your design
- [ ] Add role-based access control (if needed)
- [ ] Enable leaked password protection in Supabase Dashboard

Done! 🎉
