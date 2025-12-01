'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { authConfig } from '@/lib/auth.config'
import { env } from '@/lib/env'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect(authConfig.redirects.afterLogin)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const first_name = formData.get('first_name') as string
  const last_name = formData.get('last_name') as string
  const mobile = formData.get('mobile') as string

  // 1. 사용자 계정 생성 (이메일 확인 필요)
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

  // 이메일 확인이 필요한 경우 verify-email 페이지로 리다이렉트
  if (authData.user && !authData.user.email_confirmed_at && authConfig.emailConfirmation.required) {
    redirect(authConfig.emailConfirmation.verifyPage)
  }

  // 2. profiles 테이블에 프로필 생성 (트리거 대신 직접 생성)
  if (authData.user) {
    console.log('📝 User created:', authData.user.id, authData.user.email)
    console.log('📝 Profile data to insert:', { first_name, last_name, mobile })

    // profiles 레코드 직접 생성 (upsert 사용 - user_id 기준으로 충돌 시 업데이트)
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
        onConflict: 'user_id',  // user_id가 중복되면 업데이트
        ignoreDuplicates: false,  // 중복 시 무시하지 않고 업데이트
      })
      .select()

    if (profileError) {
      console.error('❌ Profile creation error:', profileError)
      return { error: 'Failed to create profile: ' + profileError.message }
    }

    console.log('✅ Profile created successfully:', profileData)
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
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url) // Redirect to Google OAuth page
  }
}
