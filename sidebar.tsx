"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  BookOpen,
  BarChart2,
  Calendar,
  Settings,
  Menu,
  X,
  GraduationCap,
  MessageSquare,
  Award,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/contexts/firebase-auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    if (path !== "/dashboard" && pathname?.startsWith(path)) {
      return true
    }
    return false
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Courses", path: "/courses", icon: <BookOpen className="h-5 w-5" /> },
    { name: "Learning Path", path: "/learning-path", icon: <GraduationCap className="h-5 w-5" /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart2 className="h-5 w-5" /> },
    { name: "Schedule", path: "/schedule", icon: <Calendar className="h-5 w-5" /> },
    { name: "Achievements", path: "/achievements", icon: <Award className="h-5 w-5" /> },
    { name: "Community", path: "/community", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="bg-white border-gray">
          <Menu className="h-5 w-5 text-secondary" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">EduAI</span>
              <span className="text-xl font-bold text-secondary">LMS</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
              <X className="h-5 w-5 text-secondary" />
            </Button>
          </div>

          {/* User profile section */}
          <div className="p-4 border-b border-gray">
            {loading ? (
              <div className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={user.photoURL || ""} alt={user.name || user.email} />
                  <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-secondary">{user.name || user.email}</p>
                  <p className="text-xs text-text-light">{user.role || "Student"}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-light hover:bg-light-gray"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray">
            {user ? (
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50 flex items-center justify-center"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Need Help?
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleSidebar}></div>}
    </>
  )
}
