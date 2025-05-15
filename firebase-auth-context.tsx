"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase/firebase-config"
import type { User } from "@/lib/types/user"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
})

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let unsubscribe = () => {}

    try {
      // Listen for auth state changes
      unsubscribe = onAuthStateChanged(
        auth,
        async (authUser) => {
          setFirebaseUser(authUser)

          if (authUser) {
            try {
              // Get user data from Firestore
              const userDoc = await getDoc(doc(db, "users", authUser.uid))

              if (userDoc.exists()) {
                setUser(userDoc.data() as User)
              } else {
                // User authenticated but no profile in Firestore
                console.log("User authenticated but no profile found in Firestore")
                setUser({
                  id: authUser.uid,
                  email: authUser.email || "",
                  name: authUser.displayName || "",
                  role: "student",
                  createdAt: new Date().toISOString(),
                })
              }
            } catch (err) {
              console.error("Error fetching user data:", err)
              setError(err instanceof Error ? err : new Error(String(err)))
            }
          } else {
            setUser(null)
          }

          setLoading(false)
        },
        (err) => {
          console.error("Auth state change error:", err)
          setError(err)
          setLoading(false)
        },
      )
    } catch (err) {
      console.error("Firebase Auth initialization error:", err)
      setError(err instanceof Error ? err : new Error(String(err)))
      setLoading(false)
    }

    // Cleanup subscription
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe()
      }
    }
  }, [])

  return <AuthContext.Provider value={{ user, firebaseUser, loading, error }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
