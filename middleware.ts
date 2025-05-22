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
  "/auth/discord-callback",
]

// List of auth routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"]

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession()

    // Get session data
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
  } catch (error) {
    console.error("Middleware error:", error)
    // On error, allow the request to continue to avoid blocking the user
    return NextResponse.next()
  }
}

// Disable auth checks on static resources
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
