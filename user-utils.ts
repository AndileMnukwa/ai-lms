import { db } from "./firebase-config"
import { doc, getDoc } from "firebase/firestore"
import type { User } from "@/lib/types/user"

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as User
    } else {
      console.error(`User with ID ${userId} not found`)
      return null
    }
