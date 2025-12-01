'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authConfig } from '@/lib/auth.config'
import { env } from '@/lib/env'

/**
 * Validates and sanitizes a redirect URL to prevent open redirect vulnerabilities
 * Only allows relative paths starting with '/'
 */
function getValidRedirectUrl(redirectTo: string | null): string {
  if (!redirectTo) {
    return authConfig.redirects.afterLogin
  }

  // Only allow relative paths starting with '/'
  // Prevent protocol-relative URLs (//evil.com) and absolute URLs
  if (
    redirectTo.startsWith('/') &&
    !redirectTo.startsWith('//') &&
    !redirectTo.includes(':')
  ) {
    return redirectTo
  }

  return authConfig.redirects.afterLogin
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const redirectTo = formData.get('redirectTo') as string | null

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(getValidRedirectUrl(redirectTo))
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const mobile = formData.get('mobile') as string

  // 1. Create user account (email confirmation required)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${env.site.url}/auth/callback`,
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // If email confirmation is required, redirect to verify-email page
  if (authData.user && !authData.user.email_confirmed_at && authConfig.emailConfirmation.required) {
    redirect(authConfig.emailConfirmation.verifyPage)
  }

  // 2. Create profile in profiles table
  if (authData.user) {
    console.log('User created:', authData.user.id, authData.user.email)
    console.log('Profile data to insert:', { first_name, last_name, mobile })

    // Create profile record (upsert based on user_id)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: authData.user.id,
        email: authData.user.email,
        first_name,
        last_name,
        mobile: mobile || null,
        role: 'user',
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false,
      })
      .select()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: 'Failed to create profile: ' + profileError.message }
    }

    console.log('Profile created successfully:', profileData)
  }

  revalidatePath('/', 'layout')
  redirect(authConfig.redirects.afterLogin)
}

export async function logout() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(authConfig.redirects.afterLogout)
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${env.site.url}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${env.site.url}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}
