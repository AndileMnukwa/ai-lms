"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Clock, ArrowRight, BookOpen, Calendar, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/firebase-auth-context"
import { getUserProgress, getCourses, getModules, getLessons } from "@/lib/firebase/firestore-utils"

export default function LearningPath() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("path")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [learningPath, setLearningPath] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchLearningPathData()
    }
  }, [user])

  const fetchLearningPathData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user || !user.id) {
        throw new Error("User not authenticated")
      }

      // Get user progress
      const userProgress = await getUserProgress(user.id)

      if (!userProgress || !userProgress.enrolledCourses || userProgress.enrolledCourses.length === 0) {
        // User hasn't enrolled in any courses yet
        setLearningPath({
          title: "No Learning Path",
          description: "You haven't enrolled in any courses yet",
          timeline: 0,
          progress: 0,
          currentMonth: 0,
          modules: [],
          milestones: [],
        })
        setLoading(false)
        return
      }

      // Get the first enrolled course
      const courseId = userProgress.enrolledCourses[0]
      const courses = await getCourses({ id: courseId })

      if (!courses || courses.length === 0) {
        throw new Error("Course not found")
      }

      const course = courses[0]

      // Get modules for the course
      const moduleIds = course.timelineVariations[0]?.modules || []
      const modules = await Promise.all(
        moduleIds.map(async (moduleId: string) => {
          const moduleData = await getModules({ id: moduleId })
          return moduleData[0]
        }),
      )

      // Sort modules by order
      modules.sort((a, b) => a.order - b.order)

      // Get lessons for each module
      const modulesWithLessons = await Promise.all(
        modules.map(async (module: any) => {
          const lessonIds = module.lessons.map((lesson: any) => lesson.lessonId)
          const lessons = await Promise.all(
            lessonIds.map(async (lessonId: string) => {
              const lessonData = await getLessons({ id: lessonId })
              return lessonData[0]
            }),
          )

          // Sort lessons by order
          const sortedLessons = module.lessons
            .map((lessonRef: any, index: number) => ({
              ...lessons[index],
              order: lessonRef.order,
              status: userProgress.completedLessons?.includes(lessonRef.lessonId)
                ? "completed"
                : index === 0 ||
                    (index > 0 && userProgress.completedLessons?.includes(module.lessons[index - 1].lessonId))
                  ? "in-progress"
                  : "not-started",
            }))
            .sort((a: any, b: any) => a.order - b.order)

          // Calculate module progress
          const completedLessons = sortedLessons.filter((lesson: any) => lesson.status === "completed").length
          const moduleProgress =
            sortedLessons.length > 0 ? Math.round((completedLessons / sortedLessons.length) * 100) : 0

          // Determine module status
          let moduleStatus = "not-started"
          if (moduleProgress === 100) {
            moduleStatus = "completed"
          } else if (moduleProgress > 0) {
            moduleStatus = "in-progress"
          }

          return {
            ...module,
            lessons: sortedLessons,
            progress: moduleProgress,
            status: moduleStatus,
            assessment: {
              id: `assessment-${module.id}`,
              title: `${module.title} Assessment`,
              status: moduleProgress === 100 ? "completed" : moduleProgress > 75 ? "in-progress" : "not-started",
              score: moduleProgress === 100 ? Math.floor(85 + Math.random() * 15) : null,
            },
          }
        }),
      )

      // Calculate overall progress
      const totalLessons = modulesWithLessons.reduce((total: number, module: any) => total + module.lessons.length, 0)
      const completedLessons = userProgress.completedLessons?.length || 0
      const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

      // Calculate current month based on progress
      const timelineMonths = course.timelineVariations[0]?.months || 6
      const currentMonth = Math.max(1, Math.ceil((overallProgress / 100) * timelineMonths))

      // Create milestones
      const milestones = [
        {
          id: "milestone-1",
          title: "Getting Started",
          description: `Complete module ${modulesWithLessons[0]?.title}`,
          progress: modulesWithLessons[0]?.progress || 0,
          status: modulesWithLessons[0]?.status || "not-started",
        },
        {
          id: "milestone-2",
          title: "Halfway Point",
          description: `Complete ${Math.ceil(modulesWithLessons.length / 2)} modules`,
          progress: Math.min(100, Math.round((overallProgress / 50) * 100)),
          status: overallProgress >= 50 ? "completed" : overallProgress > 25 ? "in-progress" : "not-started",
        },
        {
          id: "milestone-3",
          title: "Course Completion",
          description: "Complete all modules and final assessment",
          progress: overallProgress,
          status: overallProgress === 100 ? "completed" : overallProgress > 75 ? "in-progress" : "not-started",
        },
      ]

      // Create learning path object
      const learningPathData = {
        title: course.title,
        description: course.description,
        timeline: timelineMonths,
        progress: overallProgress,
        currentMonth,
        modules: modulesWithLessons,
        milestones,
      }

      setLearningPath(learningPathData)
    } catch (err) {
      console.error("Error fetching learning path data:", err)
      setError("Failed to load learning path data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-primary">In Progress</Badge>
      case "not-started":
        return (
          <Badge variant="outline" className="text-text-light">
            Not Started
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">Error Loading Learning Path</h2>
              <p className="text-text-light mb-6">{error}</p>
              <Button onClick={fetchLearningPathData} className="bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-text-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">No Learning Path Available</h2>
              <p className="text-text-light mb-6">Enroll in a course to start your learning journey</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (learningPath.modules.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-text-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">No Courses Enrolled</h2>
              <p className="text-text-light mb-6">Enroll in a course to start your learning journey</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-secondary">{learningPath.title}</CardTitle>
              <CardDescription className="text-text-light">{learningPath.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{learningPath.timeline}-Month Timeline</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-text-light mr-2">Overall Progress</span>
                <Badge className="bg-primary/10 text-primary">
                  Month {learningPath.currentMonth} of {learningPath.timeline}
                </Badge>
              </div>
              <span className="text-sm font-medium text-secondary">{learningPath.progress}%</span>
            </div>
            <div className="relative">
              <Progress value={learningPath.progress} className="h-2" />
              <div className="absolute top-4 left-0 right-0 flex justify-between">
                <div className="text-xs text-text-light">Start</div>
                <div className="text-xs text-text-light">Current</div>
                <div className="text-xs text-text-light">Target</div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="path" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="path">Learning Path</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="path" className="space-y-6 mt-6">
              <div className="space-y-6">
                {learningPath.modules.map((module: any, index: number) => (
                  <Card key={module.id} className="border border-gray">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-primary mr-2">Module {index + 1}</span>
                            {getStatusBadge(module.status)}
                          </div>
                          <CardTitle className="text-xl font-bold text-secondary mt-1">{module.title}</CardTitle>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-secondary">{module.progress}%</div>
                          <Progress value={module.progress} className="h-1.5 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {module.lessons.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              lesson.status === "completed"
                                ? "bg-green-50"
                                : lesson.status === "in-progress"
                                  ? "bg-primary/5"
                                  : "bg-light-gray"
                            }`}
                          >
                            <div className="flex items-center">
                              {lesson.status === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                              ) : (
                                <div
                                  className={`h-5 w-5 rounded-full border mr-3 ${
                                    lesson.status === "in-progress" ? "border-primary" : "border-gray"
                                  }`}
                                ></div>
                              )}
                              <div>
                                <p className="font-medium text-sm text-secondary">{lesson.title}</p>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-3 w-3 text-text-light mr-1" />
                                  <span className="text-xs text-text-light">{lesson.estimatedMinutes} min</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              variant={lesson.status === "not-started" ? "outline" : "default"}
                              disabled={
                                lesson.status === "not-started" &&
                                index > 0 &&
                                module.lessons[index - 1]?.status !== "completed"
                              }
                            >
                              <Link href={`/courses/${module.courseId}/modules/${module.id}/lessons/${lesson.id}`}>
                                {lesson.status === "completed"
                                  ? "Review"
                                  : lesson.status === "in-progress"
                                    ? "Continue"
                                    : "Start"}
                              </Link>
                            </Button>
                          </div>
                        ))}

                        <div
                          className={`flex items-center justify-between p-3 rounded-lg mt-4 ${
                            module.assessment.status === "completed"
                              ? "bg-green-50"
                              : module.assessment.status === "in-progress"
                                ? "bg-primary/5"
                                : "bg-light-gray"
                          }`}
                        >
                          <div className="flex items-center">
                            {module.assessment.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
                            ) : (
                              <div
                                className={`h-5 w-5 rounded-full border mr-3 ${
                                  module.assessment.status === "in-progress" ? "border-primary" : "border-gray"
                                }`}
                              ></div>
                            )}
                            <div>
                              <p className="font-medium text-sm text-secondary">{module.assessment.title}</p>
                              {module.assessment.status === "completed" && (
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-green-500">Score: {module.assessment.score}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            asChild
                            size="sm"
                            variant={module.assessment.status === "not-started" ? "outline" : "default"}
                            disabled={
                              module.assessment.status === "completed" ||
                              module.lessons.some((l: any) => l.status !== "completed")
                            }
                          >
                            <Link href={`/courses/${module.courseId}/modules/${module.id}/assessment`}>
                              {module.assessment.status === "completed"
                                ? "Review"
                                : module.assessment.status === "in-progress"
                                  ? "Continue"
                                  : "Start"}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6 mt-6">
              <div className="space-y-6">
                {learningPath.milestones.map((milestone: any) => (
                  <Card key={milestone.id} className="border border-gray">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-secondary mb-1">{milestone.title}</h3>
                          <p className="text-sm text-text-light mb-3">{milestone.description}</p>
                          {getStatusBadge(milestone.status)}
                        </div>
                        <div className="md:text-right">
                          <div className="text-sm font-medium text-secondary mb-1">{milestone.progress}% Complete</div>
                          <Progress value={milestone.progress} className="h-2 w-full md:w-32" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6 mt-6">
              <Card className="border border-gray">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-secondary">Personalized Recommendations</CardTitle>
                  <CardDescription>Based on your learning progress and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-start">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-secondary">Focus on Current Module</h4>
                          <p className="text-sm text-text-light mt-1">
                            You're making good progress. Continue focusing on completing the current module before
                            moving on.
                          </p>
                          <Button asChild variant="link" className="p-0 h-auto mt-2">
                            <Link href={`/courses/${learningPath.modules[0]?.courseId}`}>
                              <span className="flex items-center">
                                Continue Learning <ArrowRight className="h-4 w-4 ml-1" />
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-secondary">Review Key Concepts</h4>
                          <p className="text-sm text-text-light mt-1">
                            Based on your progress, we recommend reviewing key concepts from previous lessons before
                            moving forward.
                          </p>
                          <Button asChild variant="link" className="p-0 h-auto mt-2">
                            <Link
                              href={`/courses/${learningPath.modules[0]?.courseId}/modules/${learningPath.modules[0]?.id}/lessons/${learningPath.modules[0]?.lessons[0]?.id}`}
                            >
                              <span className="flex items-center">
                                Review Lesson <ArrowRight className="h-4 w-4 ml-1" />
                              </span>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-light-gray rounded-lg border border-gray">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-text-light mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-secondary">Suggested Learning Schedule</h4>
                          <p className="text-sm text-text-light mt-1">
                            To stay on track with your {learningPath.timeline}-month timeline, we recommend completing
                            the current module within the next 2 weeks.
                          </p>
                          <Button variant="link" className="p-0 h-auto mt-2">
                            <span className="flex items-center">
                              View Detailed Schedule <ArrowRight className="h-4 w-4 ml-1" />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
