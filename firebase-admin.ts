import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// Initialize Firebase Admin
export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // Check if using service account or environment variables
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      // Using service account JSON
      const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, "base64").toString())

      initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    } else {
      // Using environment variables
      initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    }
  }

  return {
    auth: getAuth(),
    firestore: getFirestore(),
    storage: getStorage(),
  }
}

// Verify Firebase ID token
export async function verifyIdToken(token: string) {
  const { auth } = initializeFirebaseAdmin()
  try {
    const decodedToken = await auth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error("Error verifying ID token:", error)
    throw new Error("Invalid token")
  }
}

// Get user by ID
export async function getUserById(uid: string) {
  const { auth } = initializeFirebaseAdmin()
  try {
    const userRecord = await auth.getUser(uid)
    return userRecord
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export const auth = getAuth()
export const firestore = getFirestore()
export const storage = getStorage()
