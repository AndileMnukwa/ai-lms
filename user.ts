// User Types for Firebase

export interface User {
  id?: string
  email: string
  name: string
  role: "student" | "instructor" | "admin"
  preferences?: {
    learningStyle?: string
    pacePreference?: "slow" | "moderate" | "fast"
    notificationSettings?: {
      email: boolean
      inApp: boolean
    }
  }
  progress?: {
    enrolledCourses?: string[]
    completedLessons?: string[]
    currentTimeline?: number
    skillLevels?: Record<string, number>
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface Course {
  id?: string
  title: string
  description: string
  category?: string[]
  isAIGenerated?: boolean
  creator?: string
  timelineVariations?: {
    months: number
    modules: string[]
  }[]
  skillsTargeted?: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  prerequisites?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Module {
  id?: string
  courseId: string
  title: string
  description: string
  order: number
  timelineMonths?: number
  lessons?: {
    lessonId: string
    order: number
    title?: string
    contentType?: string
  }[]
  assessmentId?: string
  estimatedHours?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Lesson {
  id?: string
  moduleId: string
  title: string
  content: string
  contentType?: "text" | "video" | "interactive"
  mediaUrls?: string[]
  estimatedMinutes?: number
  aiGeneratedContent?: {
    promptUsed?: string
    model?: string
    version?: number
  }
  interactiveElements?: {
    type: "quiz" | "exercise" | "simulation"
    data: any
  }[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Assessment {
  id?: string
  moduleId: string
  title: string
  description: string
  type: "quiz" | "project" | "exam"
  questions: {
    question: string
    type: "multiple-choice" | "true-false" | "open-ended"
    options?: string[]
    correctAnswer?: string | string[]
    points: number
  }[]
  passingScore: number
  aiEvaluationParams?: {
    rubric: string
    evaluationPrompt: string
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface Progress {
  id?: string
  userId: string
  courseId: string
  currentModule?: string
  currentLesson?: string
  completedLessons: string[]
  assessmentResults?: {
    assessmentId: string
    score: number
    passed: boolean
    attempts: number
    lastAttemptDate: Date
  }[]
  startDate: Date
  targetCompletionDate?: Date
  actualCompletionDate?: Date
  completionPercentage: number
  lastAccessDate: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface Certificate {
  id?: string
  userId: string
  courseId: string
  courseName: string
  userName: string
  issueDate: Date
  verificationCode: string
  imageUrl?: string
  createdAt?: Date
  updatedAt?: Date
}
