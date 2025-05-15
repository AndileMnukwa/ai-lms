import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CourseCardProps {
  id: string
  title: string
  description: string
  category: string[]
  difficulty: string
  progress?: number
  timeline?: number
}

export default function CourseCard({
  id,
  title,
  description,
  category,
  difficulty,
  progress = 0,
  timeline = 6,
}: CourseCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden border border-gray hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-secondary line-clamp-2">{title}</CardTitle>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
            {difficulty}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {category.map((cat, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/10 text-secondary border-secondary">
              {cat}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-text-light line-clamp-3 mb-4">{description}</CardDescription>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-text-light mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="mt-4 text-sm text-text-light">
          <span className="font-medium">Timeline:</span> {timeline} months
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/courses/${id}`} className="w-full">
          <Button className="w-full bg-primary hover:bg-primary/90">
            {progress > 0 ? "Continue Learning" : "Start Course"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
