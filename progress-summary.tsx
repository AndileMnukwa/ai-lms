import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

interface ProgressSummaryProps {
  enrolledCourses: number
  completedLessons: number
  totalLessons: number
  averageScore: number
  studyStreak: number
}

export default function ProgressSummary({
  enrolledCourses,
  completedLessons,
  totalLessons,
  averageScore,
  studyStreak,
}: ProgressSummaryProps) {
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <Card className="border border-gray">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-secondary">Your Progress</CardTitle>
        <CardDescription className="text-text-light">Track your learning journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-2">
              <CircularProgressbar
                value={completionPercentage}
                text={`${completionPercentage}%`}
                styles={buildStyles({
                  textSize: "1.5rem",
                  pathColor: "#41C9E2",
                  textColor: "#0D1B40",
                  trailColor: "#e0e0e0",
                })}
              />
            </div>
            <span className="text-sm text-text-light text-center">Completion</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-2">
              <CircularProgressbar
                value={averageScore}
                text={`${averageScore}%`}
                styles={buildStyles({
                  textSize: "1.5rem",
                  pathColor: "#FF5A8E",
                  textColor: "#0D1B40",
                  trailColor: "#e0e0e0",
                })}
              />
            </div>
            <span className="text-sm text-text-light text-center">Avg. Score</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-secondary mb-1">{enrolledCourses}</div>
            <span className="text-sm text-text-light">Enrolled Courses</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-primary mb-1">{studyStreak}</div>
            <span className="text-sm text-text-light">Day Streak</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-text-light">Lessons Completed</span>
            <span className="font-medium text-secondary">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
