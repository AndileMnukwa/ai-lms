import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that require authentication
const protectedPaths = ["/dashboard", "/courses", "/profile", "/settings"]

// Paths that are public
const publicPaths = ["/", "/login", "/register", "/verify-certificate"]

// Admin paths
const adminPaths = [
  "/admin/dashboard",
  "/admin/courses",
  "/admin/certificates",
  "/admin/generate-course",
  "/admin/seed-course",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path))
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path))

  // Get the token from the cookies
  const token = request.cookies.get("authToken")?.value
  const adminToken = request.cookies.get("adminToken")?.value

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // If the path is for admin and there's no admin token, redirect to admin login
  if (isAdminPath && !adminToken) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // If the user is logged in and trying to access login/register, redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
