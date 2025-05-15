"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { RefreshCw } from "lucide-react"

interface LessonContentProps {
  lesson: any
}

export default function LessonContent({ lesson }: LessonContentProps) {
  const { toast } = useToast()
  const [content, setContent] = useState<string>(lesson?.content || "")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isContentEmpty, setIsContentEmpty] = useState<boolean>(false)

  useEffect(() => {
    // Check if content is empty or just a placeholder
    if (!lesson?.content || lesson.content.includes("Full content will be generated when you access this lesson")) {
      setIsContentEmpty(true)
      generateContent()
    } else {
      setContent(lesson.content)
      setIsContentEmpty(false)
    }
  }, [lesson])

  const generateContent = async () => {
    if (!lesson || isGenerating) return

    setIsGenerating(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/lessons/generate/${lesson._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.lesson) {
          setContent(data.lesson.content)
          setIsContentEmpty(false)
          toast({
            title: "Content Generated",
            description: "Lesson content has been generated successfully",
            variant: "default",
          })
        } else {
          toast({
            title: "Generation Failed",
            description: data.error || "Failed to generate content",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate content",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating || (isContentEmpty && !content)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-text-light">Generating content...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={generateContent}
          disabled={isGenerating}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate Content
        </Button>
      </div>

      <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
