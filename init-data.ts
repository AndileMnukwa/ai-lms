import { autoGenerateCourses } from "@/lib/ai/auto-course-generator"
import { queryDocuments } from "@/lib/firebase/firestore-utils"

// Initialize data for the application
export async function initializeAppData() {
  try {
    console.log("Initializing app data...")

    // Check if we already have courses
    const existingCourses = await queryDocuments("courses", [])

    // If we don't have any courses, generate some
    if (existingCourses.length === 0) {
      console.log("No courses found. Generating initial courses...")
      await autoGenerateCourses()
      console.log("Initial courses generated successfully")
    } else {
      console.log(`Found ${existingCourses.length} existing courses`)
    }

    return { success: true }
  } catch (error) {
    console.error("Error initializing app data:", error)
    return { success: false, error }
  }
}
