import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/markets",
  "/about",
  "/features",
  "/auth/callback",
]

// List of auth routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isAuthenticated = !!session
  const path = req.nextUrl.pathname

  // If user is on an auth route and is already authenticated, redirect to dashboard
  if (isAuthenticated && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If user is not authenticated and not on a public route, redirect to login
  if (!isAuthenticated && !publicRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
