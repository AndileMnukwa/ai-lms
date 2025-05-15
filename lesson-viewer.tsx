"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, BookOpen, FileText, MessageSquare, CheckCircle } from "lucide-react"
import LessonContent from "./lesson-content"
import LessonResources from "./lesson-resources"
import LessonNotes from "./lesson-notes"
import LessonQuiz from "./lesson-quiz"
import { useToast } from "@/components/ui/use-toast"
import { markLessonComplete, isEnrolledInCourse } from "@/lib/firebase/course-utils"
import { useAuth } from "@/contexts/firebase-auth-context"

interface LessonViewerProps {
  courseId: string
  moduleId: string
  lessonId: string
}

export default function LessonViewer({ courseId, moduleId, lessonId }: LessonViewerProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [lesson, setLesson] = useState<any>(null)
  const [module, setModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("content")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)

  useEffect(() => {
    fetchLesson()
    fetchModule()
    checkEnrollmentStatus()
  }, [courseId, moduleId, lessonId])

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLesson(data.lesson)

        // Check if lesson is completed
        if (data.progress && data.progress.completedLessons) {
          setIsCompleted(data.progress.completedLessons.includes(lessonId))
        }
      } else {
        console.error("Failed to fetch lesson")
        toast({
          title: "Error",
          description: "Failed to load lesson content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching lesson:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchModule = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/modules/${moduleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setModule(data.module)
      } else {
        console.error("Failed to fetch module")
      }
    } catch (error) {
      console.error("Error fetching module:", error)
    }
  }

  const checkEnrollmentStatus = async () => {
    if (user) {
      const enrolled = await isEnrolledInCourse(courseId)
      setIsEnrolled(enrolled)
    }
  }

  const handleMarkComplete = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to track your progress",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!isEnrolled) {
      toast({
        title: "Enrollment Required",
        description: "Please enroll in this course to track your progress",
        variant: "destructive",
      })
      router.push(`/courses/${courseId}`)
      return
    }

    setMarkingComplete(true)
    try {
      const result = await markLessonComplete(courseId, lessonId)

      if (result.success) {
        setIsCompleted(true)
        toast({
          title: "Progress Updated",
          description: "Lesson marked as complete",
          variant: "default",
        })

        // Show quiz after marking complete
        setShowQuiz(true)
        setActiveTab("quiz")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update progress",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking lesson complete:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setMarkingComplete(false)
    }
  }

  const handleQuizComplete = () => {
    // Navigate to next lesson or back to course
    if (module && module.lessons) {
      const currentLessonIndex = module.lessons.findIndex((l: any) => l.lessonId === lessonId)

      if (currentLessonIndex < module.lessons.length - 1) {
        // Navigate to next lesson
        const nextLesson = module.lessons[currentLessonIndex + 1]
        router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.lessonId}`)
      } else {
        // Navigate back to course page
        router.push(`/courses/${courseId}`)
      }
    }
  }

  const navigateToLesson = (direction: "prev" | "next") => {
    if (!module || !module.lessons) return

    const currentLessonIndex = module.lessons.findIndex((l: any) => l.lessonId === lessonId)

    if (direction === "prev" && currentLessonIndex > 0) {
      const prevLesson = module.lessons[currentLessonIndex - 1]
      router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${prevLesson.lessonId}`)
    } else if (direction === "next" && currentLessonIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentLessonIndex + 1]
      router.push(`/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.lessonId}`)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-16 w-16 text-text-light mb-4" />
          <h2 className="text-2xl font-bold text-secondary mb-2">Lesson Not Found</h2>
          <p className="text-text-light mb-6">The lesson you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => router.push(`/courses/${courseId}`)} className="bg-primary hover:bg-primary/90">
            Back to Course
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Lesson header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-1">{lesson.title}</h1>
          <p className="text-text-light">
            {module?.title} • {lesson.estimatedMinutes} min
            {lesson.contentType === "video" && " • Video"}
            {lesson.contentType === "interactive" && " • Interactive"}
          </p>
        </div>

        {isCompleted ? (
          <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-md mt-4 md:mt-0">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Completed</span>
          </div>
        ) : (
          <Button
            onClick={handleMarkComplete}
            disabled={markingComplete || !isEnrolled}
            className="bg-primary hover:bg-primary/90 mt-4 md:mt-0"
          >
            {markingComplete ? "Updating..." : "Mark as Complete"}
          </Button>
        )}
      </div>

      {/* Lesson navigation */}
      <div className="flex justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToLesson("prev")}
          disabled={!module || !module.lessons || module.lessons.findIndex((l: any) => l.lessonId === lessonId) === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Lesson
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToLesson("next")}
          disabled={
            !module ||
            !module.lessons ||
            module.lessons.findIndex((l: any) => l.lessonId === lessonId) === module.lessons.length - 1
          }
        >
          Next Lesson
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Lesson content */}
      <Card className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-0">
            <TabsTrigger value="content">
              <BookOpen className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="resources">
              <FileText className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="notes">
              <MessageSquare className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="quiz" disabled={!showQuiz && !isCompleted}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Quiz
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-6">
            <LessonContent lesson={lesson} />
          </TabsContent>

          <TabsContent value="resources" className="p-6">
            <LessonResources lesson={lesson} />
          </TabsContent>

          <TabsContent value="notes" className="p-6">
            <LessonNotes lessonId={lessonId} />
          </TabsContent>

          <TabsContent value="quiz" className="p-6">
            {showQuiz || isCompleted ? (
              <LessonQuiz lesson={lesson} onComplete={handleQuizComplete} />
            ) : (
              <div className="text-center py-8">
                <p className="text-text-light mb-4">Complete the lesson to unlock the quiz</p>
                <Button onClick={handleMarkComplete} disabled={markingComplete || !isEnrolled}>
                  Mark as Complete
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
