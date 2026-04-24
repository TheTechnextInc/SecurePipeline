import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const DEFAULT_USERS = [
  { email: "admin@securepipe.dev", password: "Admin@123456", name: "Admin User", role: "admin" },
  { email: "demo@securepipe.dev", password: "Demo@123456", name: "Demo User", role: "user" },
]

const AUTH_COOKIE = "securepipe_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = DEFAULT_USERS.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session data
    const sessionData = JSON.stringify({ email: user.email, name: user.name, role: user.role })
    
    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE, sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    })

    return NextResponse.json({ success: true, user: { email: user.email, name: user.name } })
  } catch (error) {
    console.error("[v0] Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
