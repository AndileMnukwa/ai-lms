import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseAuthProvider } from "@/contexts/firebase-auth-context"
import { Toaster } from "@/components/ui/toaster"
import { initializeAppData } from "@/lib/firebase/init-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LMS System",
  description: "A modern learning management system",
    generator: 'v0.dev'
}

// Initialize app data on server start
initializeAppData()
  .then((result) => {
    if (result.success) {
      console.log("App data initialized successfully")
    } else {
      console.error("Failed to initialize app data:", result.error)
    }
  })
  .catch((error) => {
    console.error("Error during app data initialization:", error)
  })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FirebaseAuthProvider>
            {children}
            <Toaster />
          </FirebaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
