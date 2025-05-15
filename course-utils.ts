import { db, auth } from "./firebase-config"
import { doc, updateDoc, arrayUnion, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { getDocumentById } from "./firestore-utils"
import type { Course, Progress } from "@/lib/types/user"

// Enroll user in a course
export async function enrollInCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    // Get user document
    const userDoc = await getDocumentById("users", user.uid)
    if (!userDoc) {
      return { success: false, error: "User not found" }
    }

    // Get course document to verify it exists
    const course = await getDocumentById<Course>("courses", courseId)
    if (!course) {
      return { success: false, error: "Course not found" }
    }

    // Check if user is already enrolled
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      const enrolledCourses = userData.progress?.enrolledCourses || []

      if (enrolledCourses.includes(courseId)) {
        return { success: true } // Already enrolled
      }

      // Update user document to add course to enrolledCourses
      await updateDoc(userRef, {
        "progress.enrolledCourses": arrayUnion(courseId),
        updatedAt: Timestamp.now(),
      })
    }

    // Create initial progress document
    const progressId = `${user.uid}_${courseId}`
    const progressRef = doc(db, "progress", progressId)
    const progressSnap = await getDoc(progressRef)

    if (!progressSnap.exists()) {
      // Create new progress document
      const newProgress: Progress = {
        userId: user.uid,
        courseId: courseId,
        completedLessons: [],
        startDate: new Date(),
        lastAccessDate: new Date(),
        completionPercentage: 0,
      }

      await setDoc(progressRef, newProgress)
    }

    return { success: true }
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enroll in course",
    }
  }
}

// Update lesson completion status
export async function markLessonComplete(
  courseId: string,
  lessonId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    const progressId = `${user.uid}_${courseId}`
    const progressRef = doc(db, "progress", progressId)
    const progressSnap = await getDoc(progressRef)

    if (!progressSnap.exists()) {
      return { success: false, error: "Progress record not found" }
    }

    // Update progress document to add lesson to completedLessons
    await updateDoc(progressRef, {
      completedLessons: arrayUnion(lessonId),
      lastAccessDate: Timestamp.now(),
    })

    // Recalculate completion percentage
    const progressData = progressSnap.data() as Progress
    const completedLessons = [...(progressData.completedLessons || []), lessonId]

    // Get course to determine total lessons
    const course = await getDocumentById<Course>("courses", courseId)
    if (!course) {
      return { success: false, error: "Course not found" }
    }

    // Calculate total lessons in the course
    let totalLessons = 0
    for (const timelineVariation of course.timelineVariations || []) {
      for (const moduleId of timelineVariation.modules) {
        const module = await getDocumentById("modules", moduleId)
        if (module) {
          totalLessons += module.lessons?.length || 0
        }
      }
    }

    // Calculate new completion percentage
    const completionPercentage = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0

    // Update completion percentage
    await updateDoc(progressRef, {
      completionPercentage,
      updatedAt: Timestamp.now(),
    })

    return { success: true }
  } catch (error) {
    console.error("Error marking lesson complete:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark lesson complete",
    }
  }
}

// Check if user is enrolled in a course
export async function isEnrolledInCourse(courseId: string): Promise<boolean> {
  try {
    const user = auth.currentUser
    if (!user) {
      return false
    }

    const userDoc = await getDocumentById("users", user.uid)
    if (!userDoc) {
      return false
    }

    return userDoc.progress?.enrolledCourses?.includes(courseId) || false
  } catch (error) {
    console.error("Error checking enrollment:", error)
    return false
  }
}
