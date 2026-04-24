import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const AUTH_COOKIE = "securepipe_session"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  return NextResponse.json({ success: true })
}
