import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth, db } from "./firebase-config"
import { setDocument, getDocumentById } from "./firestore-utils"
import type { User } from "@/lib/types/user"

// Helper to check if Firebase is initialized
const isFirebaseInitialized = () => {
  if (!auth || !db) {
    console.error("Firebase services not initialized")
    return false
  }
  return true
}

// Register a new user
export async function registerUser(email: string, password: string, userData: Partial<User>) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase not initialized")
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const { uid } = userCredential.user

    // Update profile with name if provided
    if (userData.name) {
      await updateProfile(userCredential.user, { displayName: userData.name })
    }

    // Create user document in Firestore
    const newUser: User = {
      id: uid,
      email,
      name: userData.name || email.split("@")[0],
      role: userData.role || "student",
      preferences: {
        learningStyle: "visual",
        pacePreference: "moderate",
        notificationSettings: {
          email: true,
          inApp: true,
        },
      },
      progress: {
        enrolledCourses: [],
        completedLessons: [],
        currentTimeline: 6,
        skillLevels: {},
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...userData,
    }

    await setDocument("users", uid, newUser)
    return { user: newUser, success: true }
  } catch (error) {
    console.error("Error registering user:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to register user",
    }
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase not initialized")
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const userData = await getCurrentUserData(userCredential.user)
    return { user: userData, success: true }
  } catch (error) {
    console.error("Error logging in:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    }
  }
}

// Sign out
export async function signOut() {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase not initialized")
  }

  try {
    await firebaseSignOut(auth)
    return { success: true }
  } catch (error) {
    console.error("Error signing out:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign out",
    }
  }
}

// Reset password
export async function resetPassword(email: string) {
  if (!isFirebaseInitialized()) {
    throw new Error("Firebase not initialized")
  }

  try {
    await sendPasswordResetEmail(auth, email)
    return { success: true }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset password",
    }
  }
}

// Get current user data from Firestore
export async function getCurrentUserData(firebaseUser: FirebaseUser): Promise<User | null> {
  if (!isFirebaseInitialized() || !firebaseUser) {
    return null
  }

  try {
    return await getDocumentById<User>("users", firebaseUser.uid)
  } catch (error) {
    console.error("Error getting user data:", error)
    return null
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  if (!isFirebaseInitialized()) {
    return null
  }

  try {
    return await getDocumentById<User>("users", userId)
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}
