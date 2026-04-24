"use server"

import { cookies } from "next/headers"

// Default admin credentials
export const DEFAULT_USERS = [
  { email: "admin@securepipe.dev", password: "Admin@123456", name: "Admin User", role: "admin" },
  { email: "demo@securepipe.dev", password: "Demo@123456", name: "Demo User", role: "user" },
]

const AUTH_COOKIE = "securepipe_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface User {
  email: string
  name: string
  role: string
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const user = DEFAULT_USERS.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }
  
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, JSON.stringify({ email: user.email, name: user.name, role: user.role }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
  
  return { success: true }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(AUTH_COOKIE)
  
  if (!session?.value) {
    return null
  }
  
  try {
    return JSON.parse(session.value) as User
  } catch {
    return null
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}
