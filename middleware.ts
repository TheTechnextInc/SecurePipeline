import { NextResponse, type NextRequest } from "next/server"

const publicPaths = ["/auth/login", "/auth/sign-up", "/auth/sign-up-success", "/auth/error"]
const AUTH_COOKIE = "securepipe_session"

export function middleware(request: NextRequest) {
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  )

  const session = request.cookies.get(AUTH_COOKIE)

  // Allow public paths without auth
  if (isPublicPath) {
    // Redirect logged-in users away from auth pages
    if (session?.value) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Protect all other routes
  if (!session?.value) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
