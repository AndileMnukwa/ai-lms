"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EnvironmentChecker() {
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Check which environment variables are defined
    const vars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }

    setEnvVars(vars)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(envVars).map(([key, exists]) => (
            <div key={key} className="flex justify-between">
              <span>{key}</span>
              <span className={exists ? "text-green-500" : "text-red-500"}>{exists ? "✓ Set" : "✗ Missing"}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
