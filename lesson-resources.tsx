"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Download, BookOpen, Video, Globe } from "lucide-react"

interface LessonResourcesProps {
  lesson: any
}

export default function LessonResources({ lesson }: LessonResourcesProps) {
  // Sample resources (in a real app, these would come from the lesson data)
  const resources = [
    {
      title: "Introduction to the Topic",
      type: "article",
      description: "A comprehensive overview of the key concepts covered in this lesson.",
      url: "#",
    },
    {
      title: "Supplementary Reading",
      type: "pdf",
      description: "Detailed explanation with examples and case studies.",
      url: "#",
    },
    {
      title: "Video Tutorial",
      type: "video",
      description: "Step-by-step video guide demonstrating practical applications.",
      url: "#",
    },
    {
      title: "Interactive Exercise",
      type: "exercise",
      description: "Practice what you've learned with this interactive exercise.",
      url: "#",
    },
    {
      title: "External Reference",
      type: "link",
      description: "Additional information from an authoritative source.",
      url: "https://example.com",
    },
  ]

  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5 text-primary" />
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />
      case "exercise":
        return <BookOpen className="h-5 w-5 text-green-500" />
      case "link":
        return <Globe className="h-5 w-5 text-purple-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-4">Supplementary Resources</h2>
        <p className="text-text-light mb-6">
          Enhance your learning with these carefully selected resources related to this lesson.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start">
                <div className="mr-3 mt-1">{getResourceIcon(resource.type)}</div>
                <div>
                  <CardTitle className="text-lg font-medium text-secondary">{resource.title}</CardTitle>
                  <CardDescription className="text-text-light">{resource.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary text-primary hover:bg-primary/10"
                onClick={() => window.open(resource.url, "_blank")}
              >
                {resource.type === "link" ? (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Resource
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-secondary mb-3">Additional References</h3>
        <ul className="space-y-2 text-text-light">
          <li className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2 text-accent" />
            <a href="#" className="hover:text-primary hover:underline">
              Comprehensive Guide to the Subject
            </a>
          </li>
          <li className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2 text-accent" />
            <a href="#" className="hover:text-primary hover:underline">
              Research Paper: Latest Developments
            </a>
          </li>
          <li className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-2 text-accent" />
            <a href="#" className="hover:text-primary hover:underline">
              Community Forum Discussion
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
