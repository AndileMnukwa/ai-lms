"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Search, Filter, Clock, Plus } from "lucide-react"
import { useAuth } from "@/contexts/firebase-auth-context"
import { getCourses } from "@/lib/firebase/firestore-utils"

export default function CoursesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [courses, setCourses] = useState<any[]>([])
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  // Check if user is admin or instructor
  const isAdminOrInstructor = user?.role === "admin" || user?.role === "instructor"

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, categoryFilter, difficultyFilter, activeTab])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const allCourses = await getCourses()
      setCourses(allCourses)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((course) => course.category?.includes(categoryFilter))
    }

    // Filter by difficulty
    if (difficultyFilter && difficultyFilter !== "all") {
      filtered = filtered.filter((course) => course.difficulty === difficultyFilter)
    }

    // Filter by tab
    if (activeTab === "enrolled" && user?.progress?.enrolledCourses) {
      filtered = filtered.filter((course) => user.progress.enrolledCourses.includes(course.id))
    } else if (activeTab === "ai-generated") {
      filtered = filtered.filter((course) => course.isAIGenerated)
    }

    setFilteredCourses(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value)
  }

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleCreateCourse = () => {
    router.push("/courses/create")
  }

  // Extract unique categories from courses
  const categories = Array.from(new Set(courses.flatMap((course) => course.category || [])))

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-secondary">Courses</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-12 col-span-1 md:col-span-2" />
          <Skeleton className="h-12" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary mb-4 md:mb-0">Courses</h1>
        {isAdminOrInstructor && (
          <Button onClick={handleCreateCourse} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" />
            <Input placeholder="Search courses..." value={searchTerm} onChange={handleSearchChange} className="pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select value={categoryFilter} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{categoryFilter === "all" ? "Category" : categoryFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>{difficultyFilter === "all" ? "Difficulty" : difficultyFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-white border border-gray">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
          {isAdminOrInstructor && <TabsTrigger value="ai-generated">AI-Generated</TabsTrigger>}
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-text-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">No Courses Found</h2>
              <p className="text-text-light">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-text-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">No Enrolled Courses</h2>
              <p className="text-text-light mb-6">You haven't enrolled in any courses yet</p>
              <Button onClick={() => setActiveTab("all")} className="bg-primary hover:bg-primary/90">
                Browse Courses
              </Button>
            </div>
          )}
        </TabsContent>

        {isAdminOrInstructor && (
          <TabsContent value="ai-generated" className="space-y-6">
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-text-light mx-auto mb-4" />
                <h2 className="text-xl font-bold text-secondary mb-2">No AI-Generated Courses</h2>
                <p className="text-text-light mb-6">Create your first AI-generated course</p>
                <Button onClick={handleCreateCourse} className="bg-primary hover:bg-primary/90">
                  Create Course
                </Button>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function CourseCard({ course }: { course: any }) {
  const router = useRouter()
  const { user } = useAuth()
  const isEnrolled = user?.progress?.enrolledCourses?.includes(course.id)
  const timelineMonths = course.timelineVariations?.[0]?.months || 6

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-secondary">{course.title}</CardTitle>
            <CardDescription className="mt-1">
              {course.category?.map((cat: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-secondary/10 text-secondary px-2 py-0.5 rounded text-xs mr-2 mb-2"
                >
                  {cat}
                </span>
              ))}
            </CardDescription>
          </div>
          {course.isAIGenerated && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">AI-Generated</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-text-light line-clamp-3 mb-4">{course.description}</p>
        <div className="flex items-center text-sm text-text-light">
          <Clock className="h-4 w-4 mr-1" />
          <span>{timelineMonths} months</span>
          <span className="mx-2">•</span>
          <span className="capitalize">{course.difficulty}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push(`/courses/${course.id}`)}
          className={`w-full ${isEnrolled ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}`}
        >
          {isEnrolled ? "Continue Learning" : "View Course"}
        </Button>
      </CardFooter>
    </Card>
  )
}
