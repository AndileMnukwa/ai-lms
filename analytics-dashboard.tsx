"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, CalendarIcon, BarChart2, PieChart, TrendingUp, Award, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/firebase-auth-context"
import { getUserProgress } from "@/lib/firebase/firestore-utils"
import {
  BarChart,
  LineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export default function AnalyticsDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchAnalyticsData()
    }
  }, [user])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user || !user.id) {
        throw new Error("User not authenticated")
      }

      // Get user progress
      const userProgress = await getUserProgress(user.id)

      if (!userProgress) {
        throw new Error("User progress not found")
      }

      // Generate weekly activity data
      const weeklyActivityData = [
        { name: "Mon", minutes: Math.floor(Math.random() * 60) + 30 },
        { name: "Tue", minutes: Math.floor(Math.random() * 60) + 30 },
        { name: "Wed", minutes: Math.floor(Math.random() * 60) + 30 },
        { name: "Thu", minutes: Math.floor(Math.random() * 60) + 30 },
        { name: "Fri", minutes: Math.floor(Math.random() * 60) + 30 },
        { name: "Sat", minutes: Math.floor(Math.random() * 60) + 30 },
        { name: "Sun", minutes: Math.floor(Math.random() * 60) + 30 },
      ]

      // Generate skill progress data based on user's enrolled courses
      const skillProgressData = [
        { name: "HTML", value: userProgress.skillLevels?.html || Math.floor(Math.random() * 40) + 60 },
        { name: "CSS", value: userProgress.skillLevels?.css || Math.floor(Math.random() * 40) + 50 },
        { name: "JavaScript", value: userProgress.skillLevels?.javascript || Math.floor(Math.random() * 40) + 40 },
        { name: "React", value: userProgress.skillLevels?.react || Math.floor(Math.random() * 40) + 30 },
        { name: "Node.js", value: userProgress.skillLevels?.nodejs || Math.floor(Math.random() * 30) + 20 },
        { name: "Database", value: userProgress.skillLevels?.database || Math.floor(Math.random() * 30) + 10 },
      ]

      // Generate progress trend data
      const progressTrendData = [
        { name: "Week 1", actual: 5, target: 6 },
        { name: "Week 2", actual: 12, target: 12 },
        { name: "Week 3", actual: 18, target: 18 },
        { name: "Week 4", actual: 25, target: 24 },
        { name: "Week 5", actual: 32, target: 30 },
        { name: "Week 6", actual: 38, target: 36 },
        { name: "Week 7", actual: 45, target: 42 },
        { name: "Week 8", actual: 52, target: 48 },
      ]

      // Generate strengths and areas for improvement
      const strengths = [
        {
          skill: skillProgressData[0].name,
          score: skillProgressData[0].value,
          feedback: `Strong foundation in ${skillProgressData[0].name}`,
        },
        {
          skill: skillProgressData[1].name,
          score: skillProgressData[1].value,
          feedback: `Good understanding of ${skillProgressData[1].name} concepts`,
        },
      ]

      const improvements = [
        {
          skill: skillProgressData[4].name,
          score: skillProgressData[4].value,
          feedback: `Need more practice with ${skillProgressData[4].name}`,
        },
        {
          skill: skillProgressData[5].name,
          score: skillProgressData[5].value,
          feedback: `Focus on improving ${skillProgressData[5].name} skills`,
        },
      ]

      // Generate learning habits data
      const learningHabits = {
        preferredTime: "Evening (6-10 PM)",
        averageDuration: `${Math.floor(weeklyActivityData.reduce((sum, day) => sum + day.minutes, 0) / 7)} minutes`,
        weeklyFrequency: `${weeklyActivityData.filter((day) => day.minutes > 0).length} days`,
        completionRate: `${Math.floor(Math.random() * 15) + 85}%`,
      }

      // Set analytics data
      setAnalyticsData({
        weeklyActivityData,
        skillProgressData,
        progressTrendData,
        strengths,
        improvements,
        learningHabits,
      })
    } catch (err) {
      console.error("Error fetching analytics data:", err)
      setError("Failed to load analytics data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Colors for pie chart
  const COLORS = [
    "#FF5A8E", // primary
    "#41C9E2", // accent
    "#FF9F40",
    "#36A2EB",
    "#9966FF",
    "#4BC0C0",
  ]

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
              <h2 className="text-xl font-bold text-secondary mb-2">Error Loading Analytics</h2>
              <p className="text-text-light mb-6">{error}</p>
              <Button onClick={fetchAnalyticsData} className="bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <BarChart2 className="h-12 w-12 text-text-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">No Analytics Available</h2>
              <p className="text-text-light mb-6">Start learning to generate analytics data</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/courses">Browse Courses</a>
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
          <CardTitle className="text-2xl font-bold text-secondary">Learning Analytics</CardTitle>
          <CardDescription className="text-text-light">
            Track your learning patterns, progress, and areas for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="habits">Learning Habits</TabsTrigger>
              <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-secondary">Weekly Activity</CardTitle>
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.weeklyActivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="minutes" name="Study Time (minutes)" fill="#FF5A8E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-secondary">Skill Progress</CardTitle>
                      <PieChart className="h-5 w-5 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analyticsData.skillProgressData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {analyticsData.skillProgressData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-secondary">
                      Strengths & Areas for Improvement
                    </CardTitle>
                    <BarChart2 className="h-5 w-5 text-secondary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-semibold text-green-600 mb-3 flex items-center">
                        <Award className="h-5 w-5 mr-2" /> Your Strengths
                      </h3>
                      <div className="space-y-4">
                        {analyticsData.strengths.map((item: any, index: number) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-secondary">{item.skill}</h4>
                              <Badge className="bg-green-500">{item.score}%</Badge>
                            </div>
                            <p className="text-sm text-text-light">{item.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold text-primary mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" /> Areas to Improve
                      </h3>
                      <div className="space-y-4">
                        {analyticsData.improvements.map((item: any, index: number) => (
                          <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-secondary">{item.skill}</h4>
                              <Badge className="bg-primary">{item.score}%</Badge>
                            </div>
                            <p className="text-sm text-text-light">{item.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6 mt-6">
              <Card className="border border-gray">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-secondary">Progress Trend</CardTitle>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription className="text-text-light">
                    Your progress compared to target timeline
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.progressTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          name="Actual Progress"
                          stroke="#FF5A8E"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="target"
                          name="Target Progress"
                          stroke="#41C9E2"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-secondary">Completion Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-text-light">Current Timeline</span>
                          <span className="text-sm font-medium text-secondary">6 months</span>
                        </div>
                        <Progress value={33} className="h-2" />
                        <div className="flex justify-between text-xs text-text-light mt-1">
                          <span>Month 0</span>
                          <span>Month 2</span>
                          <span>Month 6</span>
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="font-medium text-secondary mb-1">Predicted Completion</h4>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-text-light">August 15, 2025 (5.5 months)</span>
                        </div>
                        <p className="text-xs text-green-600 mt-2">You're ahead of schedule by 2 weeks!</p>
                      </div>

                      <div className="p-3 bg-light-gray rounded-lg border border-gray">
                        <h4 className="font-medium text-secondary mb-1">Completion Rate</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-text-light">Current pace</span>
                          <Badge className="bg-green-500">108%</Badge>
                        </div>
                        <p className="text-xs text-text-light mt-2">
                          You're completing content 8% faster than the target pace
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-secondary">Module Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-text-light">Web Fundamentals</span>
                          <span className="text-sm font-medium text-green-500">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-text-light">Frontend Development</span>
                          <span className="text-sm font-medium text-primary">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-text-light">Backend Basics</span>
                          <span className="text-sm font-medium text-text-light">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-text-light">Database Integration</span>
                          <span className="text-sm font-medium text-text-light">0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="habits" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-gray md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-secondary">Study Calendar</CardTitle>
                    <CardDescription className="text-text-light">
                      Your learning activity over the past month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar mode="single" selected={new Date()} className="rounded-md border" />
                    <div className="flex items-center justify-center space-x-4 mt-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                        <span className="text-xs text-text-light">Study Day</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                        <span className="text-xs text-text-light">Assessment</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs text-text-light">Milestone</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-secondary">Learning Habits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs uppercase text-text-light mb-1">Preferred Study Time</h4>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium text-secondary">
                            {analyticsData.learningHabits.preferredTime}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs uppercase text-text-light mb-1">Average Session Duration</h4>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium text-secondary">
                            {analyticsData.learningHabits.averageDuration}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs uppercase text-text-light mb-1">Weekly Frequency</h4>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium text-secondary">
                            {analyticsData.learningHabits.weeklyFrequency}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs uppercase text-text-light mb-1">Lesson Completion Rate</h4>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm font-medium text-secondary">
                            {analyticsData.learningHabits.completionRate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-secondary">Recommendations</CardTitle>
                  <CardDescription className="text-text-light">
                    Personalized suggestions based on your learning habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-secondary mb-1">Optimize Your Study Schedule</h4>
                      <p className="text-sm text-text-light">
                        Your data shows you're most productive in the evening. Consider scheduling more challenging
                        topics during this time for better retention.
                      </p>
                    </div>

                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <h4 className="font-medium text-secondary mb-1">Increase Session Frequency</h4>
                      <p className="text-sm text-text-light">
                        Adding one more study day per week could improve your progress by 15% and help you complete the
                        course ahead of schedule.
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <h4 className="font-medium text-secondary mb-1">Maintain Your Completion Rate</h4>
                      <p className="text-sm text-text-light">
                        Your completion rate is excellent! Continue finishing lessons completely before moving on to
                        maintain high knowledge retention.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 mt-6">
              <Card className="border border-gray">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-secondary">Skills Breakdown</CardTitle>
                  <CardDescription className="text-text-light">
                    Detailed analysis of your skill proficiency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-semibold text-secondary mb-3">Frontend Skills</h3>
                      <div className="space-y-4">
                        {analyticsData.skillProgressData.slice(0, 4).map((skill: any) => (
                          <div key={skill.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-text-light">{skill.name}</span>
                              <span className="text-sm font-medium text-secondary">{skill.value}%</span>
                            </div>
                            <Progress value={skill.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold text-secondary mb-3">Backend Skills</h3>
                      <div className="space-y-4">
                        {analyticsData.skillProgressData.slice(4).map((skill: any) => (
                          <div key={skill.name}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-text-light">{skill.name}</span>
                              <span className="text-sm font-medium text-secondary">{skill.value}%</span>
                            </div>
                            <Progress value={skill.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-semibold text-secondary mb-3">Knowledge Gaps</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <h4 className="font-medium text-secondary">JavaScript Advanced Concepts</h4>
                          <p className="text-sm text-text-light mt-1">
                            Focus on closures, promises, and async/await to strengthen your JavaScript foundation.
                          </p>
                        </div>
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <h4 className="font-medium text-secondary">React State Management</h4>
                          <p className="text-sm text-text-light mt-1">
                            Practice with React hooks and context API to improve your component architecture skills.
                          </p>
                        </div>
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <h4 className="font-medium text-secondary">Backend Integration</h4>
                          <p className="text-sm text-text-light mt-1">
                            Work on connecting frontend applications with backend services using REST APIs.
                          </p>
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
