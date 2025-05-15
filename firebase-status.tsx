"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase/firebase-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export function FirebaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    try {
      // Simple check to see if Firebase Auth is initialized
      if (auth && typeof auth.onAuthStateChanged === "function") {
        const unsubscribe = auth.onAuthStateChanged(
          () => {
            setStatus("connected")
          },
          (error) => {
            setStatus("error")
            setErrorMessage(error.message)
          },
        )

        return () => unsubscribe()
      } else {
        setStatus("error")
        setErrorMessage("Firebase Auth not properly initialized")
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : String(error))
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Firebase Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" && <p>Checking Firebase connection...</p>}

        {status === "connected" && (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>Firebase connected successfully</span>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-2">
            <div className="flex items-center text-red-500">
              <XCircle className="mr-2 h-5 w-5" />
              <span>Firebase connection error</span>
            </div>
            {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
