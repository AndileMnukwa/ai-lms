"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, ChevronLeft, Video, FileText, Award } from "lucide-react"

interface CourseSidebarProps {
  courseId: string
}

export default function CourseSidebar({ courseId }: CourseSidebarProps) {
  const [course, setCourse] = useState<any>(null)
  const [modules, setModules] = useState<any[]>([])
  const [progress, setProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchCourse()
    fetchModules()
    fetchProgress()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
      } else {
        console.error("Failed to fetch course")
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    }
  }

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/modules?courseId=${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setModules(data.modules || [])
      } else {
        console.error("Failed to fetch modules")
      }
    } catch (error) {
      console.error("Error fetching modules:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/progress?courseId=${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProgress(data.progress)
      } else {
        console.error("Failed to fetch progress")
      }
    } catch (error) {
      console.error("Error fetching progress:", error)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessons?.includes(lessonId) || false
  }

  const isCurrentLesson = (lessonId: string) => {
    return pathname?.includes(`/lessons/${lessonId}`) || false
  }

  const getLessonIcon = (lesson: any) => {
    if (isLessonCompleted(lesson.lessonId)) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }

    if (isCurrentLesson(lesson.lessonId)) {
      return <Circle className="h-4 w-4 text-primary fill-primary" />
    }

    return <Circle className="h-4 w-4 text-text-light" />
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "video":
        return <Video className="h-4 w-4 text-text-light" />
      case "interactive":
        return <Award className="h-4 w-4 text-text-light" />
      case "text":
      default:
        return <FileText className="h-4 w-4 text-text-light" />
    }
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray">
      {/* Header */}
      <div className="p-4 border-b border-gray">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/courses")}
          className="text-text-light hover:text-secondary mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          All Courses
        </Button>

        <h2 className="text-lg font-bold text-secondary line-clamp-2">{course?.title || "Course Content"}</h2>

        {progress && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-text-light">Your Progress</span>
              <span className="text-xs font-medium text-secondary">{progress.completionPercentage || 0}%</span>
            </div>
            <Progress value={progress.completionPercentage || 0} className="h-1.5" />
          </div>
        )}
      </div>

      {/* Course content */}
      <div className="flex-grow overflow-y-auto p-2">
        <Accordion type="multiple" defaultValue={modules.map((m) => m._id)} className="w-full">
          {modules.map((module, moduleIndex) => (
            <AccordionItem key={module._id} value={module._id} className="border-b border-gray">
              <AccordionTrigger className="py-3 px-2 hover:bg-light-gray hover:no-underline rounded-md">
                <div className="flex items-center text-left">
                  <div className="bg-secondary/10 text-secondary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                    {moduleIndex + 1}
                  </div>
                  <span className="font-medium text-secondary line-clamp-1">{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-10 pr-2">
                <ul className="space-y-1 py-1">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <li key={lesson.lessonId}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/courses/${courseId}/modules/${module._id}/lessons/${lesson.lessonId}`)
                        }
                        className={`w-full justify-start text-left py-2 h-auto ${
                          isCurrentLesson(lesson.lessonId)
                            ? "bg-primary/10 text-primary font-medium"
                            : isLessonCompleted(lesson.lessonId)
                              ? "text-secondary"
                              : "text-text-light"
                        }`}
                      >
                        <div className="flex items-center w-full">
                          <div className="mr-2 flex-shrink-0">{getLessonIcon(lesson)}</div>
                          <span className="flex-grow line-clamp-2 text-sm">
                            {lessonIndex + 1}. {lesson.title || `Lesson ${lessonIndex + 1}`}
                          </span>
                          {lesson.contentType && (
                            <div className="ml-1 flex-shrink-0">{getContentTypeIcon(lesson.contentType)}</div>
                          )}
                        </div>
                      </Button>
                    </li>
                  ))}

                  {module.assessmentId && (
                    <li>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/courses/${courseId}/modules/${module._id}/assessment`)}
                        className="w-full justify-start text-left py-2 h-auto text-text-light hover:text-secondary"
                      >
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-accent" />
                          <span className="text-sm">Module Assessment</span>
                        </div>
                      </Button>
                    </li>
                  )}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
