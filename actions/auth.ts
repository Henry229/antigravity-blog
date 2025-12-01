"use server"

import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  // 서버 측 입력값 검증
  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    return { error: "Invalid input" }
  }

  // 기본 유효성 검사
  if (!email.includes("@") || password.length < 6) {
    return { error: "Invalid email or password" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // 보안: 구체적인 에러 메시지 대신 일반화된 메시지 반환
    return { error: "Invalid email or password" }
  }

  return { success: true }
}
