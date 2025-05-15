"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, BookOpen, Award, Clock, BarChart2, CheckCircle2 } from "lucide-react"
import ProgressSummary from "./progress-summary"
import CourseCard from "./course-card"

interface DashboardOverviewProps {
  user: any
  courses: any[]
  progress: any
}

export default function DashboardOverview({ user, courses, progress }: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate overall progress
  const overallProgress = user?.progress?.overallCompletion || 0
  const enrolledCourses = user?.progress?.enrolledCourses?.length || 0
  const completedLessons = user?.progress?.completedLessons || 0
  const totalLessons = user?.progress?.totalLessons || 0
  const averageScore = user?.progress?.averageScore || 0
  const studyStreak = user?.progress?.studyStreak || 0

  // Get current course and next lesson
  const currentCourse = courses[0] || null
  const nextLesson = {
    id: "lesson-1",
    title: "Introduction to the Course",
    module: "Getting Started",
    duration: "15 min",
  }

  // Recent achievements
  const recentAchievements = [
    {
      id: "achievement-1",
      title: "First Lesson Completed",
      date: "2 days ago",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      id: "achievement-2",
      title: "3-Day Study Streak",
      date: "Yesterday",
      icon: <Award className="h-5 w-5 text-yellow-500" />,
    },
  ]

  // Upcoming deadlines
  const upcomingDeadlines = [
    {
      id: "deadline-1",
      title: "Complete Module 1 Quiz",
      course: "Web Development Fundamentals",
      dueDate: "Tomorrow",
    },
    {
      id: "deadline-2",
      title: "Submit Project Proposal",
      course: "UX Design Principles",
      dueDate: "In 3 days",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Welcome Card */}
          <Card className="border border-gray">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-secondary">
                Welcome back, {user?.name || user?.email || "Student"}!
              </CardTitle>
              <CardDescription className="text-text-light">
                Your learning journey continues. Here's your progress so far.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="w-full md:w-2/3">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-text-light">Overall Progress</span>
                      <span className="text-sm font-medium text-secondary">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col items-center justify-center bg-light-gray rounded-lg p-4">
                      <BookOpen className="h-6 w-6 text-primary mb-2" />
                      <span className="text-2xl font-bold text-secondary">{enrolledCourses}</span>
                      <span className="text-xs text-text-light">Courses</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-light-gray rounded-lg p-4">
                      <CheckCircle2 className="h-6 w-6 text-accent mb-2" />
                      <span className="text-2xl font-bold text-secondary">{completedLessons}</span>
                      <span className="text-xs text-text-light">Lessons</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-light-gray rounded-lg p-4">
                      <Award className="h-6 w-6 text-yellow-500 mb-2" />
                      <span className="text-2xl font-bold text-secondary">{averageScore}%</span>
                      <span className="text-xs text-text-light">Avg. Score</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-light-gray rounded-lg p-4">
                      <CalendarDays className="h-6 w-6 text-green-500 mb-2" />
                      <span className="text-2xl font-bold text-secondary">{studyStreak}</span>
                      <span className="text-xs text-text-light">Day Streak</span>
                    </div>
                  </div>

                  {currentCourse && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-secondary mb-2">Continue Learning</h3>
                      <Card className="border border-gray">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-secondary">{currentCourse.title}</h4>
                              <p className="text-sm text-text-light">
                                Next: {nextLesson.module} - {nextLesson.title}
                              </p>
                              <div className="flex items-center mt-2">
                                <Clock className="h-4 w-4 text-text-light mr-1" />
                                <span className="text-xs text-text-light">{nextLesson.duration}</span>
                              </div>
                            </div>
                            <Button asChild size="sm">
                              <Link href={`/courses/${currentCourse.id}/modules/1/lessons/${nextLesson.id}`}>
                                Continue
                              </Link>
                            </Button>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-text-light">Course Progress</span>
                              <span>{progress[currentCourse.id]?.completionPercentage || 0}%</span>
                            </div>
                            <Progress value={progress[currentCourse.id]?.completionPercentage || 0} className="h-1.5" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/3 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2">Recent Achievements</h3>
                    {recentAchievements.length > 0 ? (
                      <div className="space-y-2">
                        {recentAchievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-center p-3 bg-light-gray rounded-lg">
                            <div className="mr-3">{achievement.icon}</div>
                            <div>
                              <p className="font-medium text-sm text-secondary">{achievement.title}</p>
                              <p className="text-xs text-text-light">{achievement.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-light">No achievements yet. Keep learning!</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2">Upcoming Deadlines</h3>
                    {upcomingDeadlines.length > 0 ? (
                      <div className="space-y-2">
                        {upcomingDeadlines.map((deadline) => (
                          <div key={deadline.id} className="p-3 bg-light-gray rounded-lg">
                            <p className="font-medium text-sm text-secondary">{deadline.title}</p>
                            <p className="text-xs text-text-light">{deadline.course}</p>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                                Due {deadline.dueDate}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-text-light">No upcoming deadlines.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link href="/learning-path">View Complete Learning Path</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Progress Summary */}
          <ProgressSummary
            enrolledCourses={enrolledCourses}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
            averageScore={averageScore}
            studyStreak={studyStreak}
          />
        </TabsContent>

        <TabsContent value="courses" className="space-y-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-secondary">My Courses</h2>
            <Button asChild variant="outline">
              <Link href="/courses">Browse All Courses</Link>
            </Button>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  category={course.category || ["General"]}
                  difficulty={course.difficulty || "Beginner"}
                  progress={progress[course.id]?.completionPercentage || 0}
                  timeline={course.timeline || 6}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="mb-4">You haven't enrolled in any courses yet.</p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your progress across all courses and skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Timeline Progress</h3>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                          Month 2 of 6
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-primary">33% Complete</span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-light-gray">
                      <div
                        style={{ width: "33%" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-text-light">
                      <span>Start</span>
                      <span>Current</span>
                      <span>Target</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Skills Mastery</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">HTML & CSS</span>
                        <span className="text-sm font-medium text-secondary">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">JavaScript</span>
                        <span className="text-sm font-medium text-secondary">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">React</span>
                        <span className="text-sm font-medium text-secondary">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">Node.js</span>
                        <span className="text-sm font-medium text-secondary">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">Learning Pace</h3>
                  <div className="bg-light-gray p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-secondary">Current Pace</span>
                      <Badge className="bg-green-500">Ahead of Schedule</Badge>
                    </div>
                    <p className="text-sm text-text-light mb-2">
                      You're learning 20% faster than your timeline requires. Keep up the good work!
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-light">Estimated completion: August 15, 2025</span>
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        Adjust Timeline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Certifications</CardTitle>
              <CardDescription>Track your accomplishments and earned credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-4">Badges Earned</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-secondary text-center">First Course</span>
                      <span className="text-xs text-text-light">Earned 2 weeks ago</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                        <CheckCircle2 className="h-8 w-8 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-secondary text-center">5 Lessons</span>
                      <span className="text-xs text-text-light">Earned 1 week ago</span>
                    </div>
                    <div className="flex flex-col items-center opacity-40">
                      <div className="w-16 h-16 rounded-full bg-gray flex items-center justify-center mb-2">
                        <BarChart2 className="h-8 w-8 text-text-light" />
                      </div>
                      <span className="text-sm font-medium text-secondary text-center">Perfect Quiz</span>
                      <span className="text-xs text-text-light">Not earned yet</span>
                    </div>
                    <div className="flex flex-col items-center opacity-40">
                      <div className="w-16 h-16 rounded-full bg-gray flex items-center justify-center mb-2">
                        <CalendarDays className="h-8 w-8 text-text-light" />
                      </div>
                      <span className="text-sm font-medium text-secondary text-center">7-Day Streak</span>
                      <span className="text-xs text-text-light">Not earned yet</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-4">Certifications</h3>
                  <div className="space-y-4">
                    <Card className="border border-gray">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-secondary">Introduction to Web Development</h4>
                            <p className="text-sm text-text-light">Completion Certificate</p>
                            <div className="flex items-center mt-2">
                              <CalendarDays className="h-4 w-4 text-text-light mr-1" />
                              <span className="text-xs text-text-light">Issued: May 10, 2025</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Share
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="text-center p-4 border border-dashed border-gray rounded-lg">
                      <p className="text-sm text-text-light mb-2">
                        Complete more courses to earn additional certifications
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
