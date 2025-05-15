import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyIdToken } from "../firebase/firebase-admin"

export async function getServerSession() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    const decodedToken = await verifyIdToken(token)

    if (!decodedToken) {
      return null
    }

    return {
      user: {
        id: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || "student",
      },
    }
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decodedToken = await verifyIdToken(token)

    if (!decodedToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return null // Continue with the request
  } catch (error) {
    console.error("Error requiring auth:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export async function requireRole(request: NextRequest, requiredRole: string) {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  try {
    const decodedToken = await verifyIdToken(token)

    if (!decodedToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (decodedToken.role !== requiredRole && decodedToken.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    return null // Continue with the request
  } catch (error) {
    console.error("Error requiring role:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
