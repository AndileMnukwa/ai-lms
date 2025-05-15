import { NextResponse } from "next/server"
import { autoGenerateCourses } from "@/lib/ai/auto-course-generator"
import { auth } from "@/lib/firebase/firebase-admin"

// Verify Firebase ID token
async function verifyToken(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : authHeader

    if (!token) {
      return { isAuthenticated: false, error: "Authentication required" }
    }

    const decodedToken = await auth.verifyIdToken(token)
    return { isAuthenticated: true, userId: decodedToken.uid, role: decodedToken.role || "student" }
  } catch (error) {
    console.error("Token verification error:", error)
    return { isAuthenticated: false, error: "Invalid token" }
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const { isAuthenticated, userId, role, error } = await verifyToken(request)
    if (!isAuthenticated) {
      return NextResponse.json({ error }, { status: 401 })
    }

    // Only allow admins to trigger auto-generation
    if (role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 })
    }

    // Auto-generate courses
    const courses = await autoGenerateCourses()

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${courses.length} courses`,
      courses,
    })
  } catch (error: any) {
    console.error("Error auto-generating courses:", error)
    return NextResponse.json({ error: error.message || "Failed to auto-generate courses" }, { status: 500 })
  }
}
