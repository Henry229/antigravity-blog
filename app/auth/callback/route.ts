import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authConfig } from '@/lib/auth.config'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('Auth callback started')
  console.log('Code:', code ? 'received' : 'missing')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(error.message)}`)
    }

    console.log('Session created:', data.session?.user?.email)
    console.log('User ID:', data.session?.user?.id)

    // Check if profile exists (after email confirmation or OAuth login)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', data.session.user.id)
      .single()

    // Create default profile if it doesn't exist (OAuth or email confirmation complete)
    if (!profile && data.session.user) {
      console.log('Creating profile for confirmed user:', data.session.user.email)

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.session.user.id,
          email: data.session.user.email,
          role: authConfig.profile.defaultRole,
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent('Failed to create profile')}`)
      }

      console.log('Profile created successfully')
    }
  }

  // Redirect to the configured afterLogin page
  return NextResponse.redirect(`${origin}${authConfig.redirects.afterLogin}`)
}
