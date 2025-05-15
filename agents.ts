// AI Agent System Implementation

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { connectToDatabase } from "../mongodb/db"
import type { Course, Lesson, Assessment, Module } from "../mongodb/models"

// Manager Agent - Orchestrates the AI system
export class ManagerAgent {
  async orchestrateJobQueue(jobType: string, jobData: any) {
    switch (jobType) {
      case "generate_curriculum":
        const curriculumAgent = new CurriculumAgent()
        return await curriculumAgent.generateCurriculum(
          jobData.topic,
          jobData.timelineMonths,
          jobData.difficulty,
          jobData.description,
          jobData.targetAudience,
          jobData.learningObjectives,
        )
      case "generate_content":
        const contentAgent = new ContentGeneratorAgent()
        return await contentAgent.generateLessonContent(
          jobData.lessonId,
          jobData.moduleId,
          jobData.topic,
          jobData.timelineMonths,
        )
      case "generate_assessment":
        const assessmentAgent = new AssessmentAgent()
        return await assessmentAgent.generateAssessment(jobData.moduleId, jobData.topics, jobData.difficulty)
      case "generate_module":
        const moduleAgent = new ModuleGeneratorAgent()
        return await moduleAgent.generateModule(
          jobData.courseId,
          jobData.moduleTitle,
          jobData.moduleDescription,
          jobData.timelineMonths,
          jobData.order,
        )
      default:
        throw new Error(`Unknown job type: ${jobType}`)
    }
  }
}

// Curriculum Agent - Generates course structure
export class CurriculumAgent {
  async generateCurriculum(
    topic: string,
    timelineMonths: number,
    difficulty: string,
    description?: string,
    targetAudience?: string,
    learningObjectives?: string,
  ): Promise<Course> {
    const { db } = await connectToDatabase()

    // Check cache first
    const cacheKey = `${topic}-${timelineMonths}-${difficulty}`.toLowerCase().replace(/\s+/g, "-")
    const cachedCurriculum = await db.collection("ai_cache").findOne({
      type: "curriculum",
      cacheKey,
    })

    if (cachedCurriculum) {
      return cachedCurriculum.data as Course
    }

    // Generate curriculum with AI
    const prompt = `
      Create a comprehensive curriculum for a course on "${topic}" that can be completed in ${timelineMonths} months.
      The difficulty level is ${difficulty}.
      
      ${description ? `Course description: ${description}` : ""}
      ${targetAudience ? `Target audience: ${targetAudience}` : ""}
      ${learningObjectives ? `Learning objectives: ${learningObjectives}` : ""}
      
      The curriculum should include:
      1. A course title and description
      2. 4-8 modules depending on the timeline (${timelineMonths} months)
      3. Each module should have 4-6 lessons with titles and brief descriptions
      4. Learning objectives for each module
      5. Skills that will be developed
      6. Prerequisites if any
      
      Format the response as a structured JSON object with the following structure:
      {
        "title": "Course Title",
        "description": "Comprehensive course description",
        "categories": ["category1", "category2"],
        "modules": [
          {
            "title": "Module 1 Title",
            "description": "Module 1 description",
            "order": 1,
            "lessons": [
              {
                "title": "Lesson 1 Title",
                "description": "Brief description of lesson content",
                "order": 1,
                "estimatedMinutes": 30
              }
            ]
          }
        ],
        "skills": ["skill1", "skill2"],
        "prerequisites": ["prerequisite1", "prerequisite2"]
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    try {
      const curriculumData = JSON.parse(text)

      // Create course structure
      const course: Course = {
        title: curriculumData.title,
        description: curriculumData.description,
        category: curriculumData.categories || [topic],
        isAIGenerated: true,
        creator: "AI",
        timelineVariations: [
          {
            months: timelineMonths,
            modules: [], // Will be filled with module IDs after creation
          },
        ],
        skillsTargeted: curriculumData.skills || [],
        difficulty: difficulty as any,
        prerequisites: curriculumData.prerequisites || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save course to database
      const courseResult = await db.collection("courses").insertOne(course)
      course._id = courseResult.insertedId.toString()

      // Create modules
      const moduleIds: string[] = []
      for (const moduleData of curriculumData.modules) {
        const module: Module = {
          courseId: course._id,
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order,
          timelineMonths: timelineMonths,
          lessons: [], // Will be filled with lesson IDs after creation
          estimatedHours: moduleData.lessons.reduce(
            (total: number, lesson: any) => total + (lesson.estimatedMinutes || 30) / 60,
            0,
          ),
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Save module to database
        const moduleResult = await db.collection("modules").insertOne(module)
        module._id = moduleResult.insertedId.toString()
        moduleIds.push(module._id)

        // Create lessons
        const lessonIds: { lessonId: string; order: number }[] = []
        for (const lessonData of moduleData.lessons) {
          const lesson: Lesson = {
            moduleId: module._id,
            title: lessonData.title,
            content: `<h1>${lessonData.title}</h1><p>${lessonData.description}</p><p>Full content will be generated when you access this lesson.</p>`,
            contentType: "text",
            mediaUrls: [],
            estimatedMinutes: lessonData.estimatedMinutes || 30,
            aiGeneratedContent: {
              promptUsed: `Generate content for lesson: ${lessonData.title}`,
              model: "gpt-4o",
              version: 1,
            },
            interactiveElements: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          // Save lesson to database
          const lessonResult = await db.collection("lessons").insertOne(lesson)
          lesson._id = lessonResult.insertedId.toString()
          lessonIds.push({ lessonId: lesson._id, order: lessonData.order })
        }

        // Update module with lesson IDs
        await db.collection("modules").updateOne({ _id: module._id }, { $set: { lessons: lessonIds } })
      }

      // Update course with module IDs
      await db
        .collection("courses")
        .updateOne({ _id: course._id }, { $set: { "timelineVariations.0.modules": moduleIds } })

      // Cache the result
      await db.collection("ai_cache").insertOne({
        type: "curriculum",
        cacheKey,
        data: course,
        createdAt: new Date(),
      })

      return course
    } catch (error) {
      console.error("Error parsing AI response:", error)
      throw new Error("Failed to generate curriculum")
    }
  }
}

// Module Generator Agent - Creates module structure
export class ModuleGeneratorAgent {
  async generateModule(
    courseId: string,
    moduleTitle: string,
    moduleDescription: string,
    timelineMonths: number,
    order: number,
  ): Promise<Module> {
    const { db } = await connectToDatabase()

    // Get course info
    const course = await db.collection("courses").findOne({ _id: courseId })
    if (!course) {
      throw new Error(`Course not found: ${courseId}`)
    }

    // Generate module structure with AI
    const prompt = `
      Create a detailed module structure for a module titled "${moduleTitle}" 
      with the description "${moduleDescription}" for a course on "${course.title}".
      
      This module should be designed for a ${timelineMonths}-month timeline.
      
      Generate 4-6 lessons for this module, each with:
      1. A descriptive title
      2. A brief description of the lesson content
      3. Estimated time to complete in minutes
      
      Format the response as a structured JSON object with the following structure:
      {
        "title": "${moduleTitle}",
        "description": "Expanded module description",
        "lessons": [
          {
            "title": "Lesson 1 Title",
            "description": "Brief description of lesson content",
            "order": 1,
            "estimatedMinutes": 30
          }
        ],
        "estimatedHours": 3
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      const moduleData = JSON.parse(text)

      // Create module structure
      const module: Module = {
        courseId,
        title: moduleData.title || moduleTitle,
        description: moduleData.description || moduleDescription,
        order,
        timelineMonths,
        lessons: [], // Will be filled with lesson IDs after creation
        estimatedHours:
          moduleData.estimatedHours ||
          moduleData.lessons.reduce((total: number, lesson: any) => total + (lesson.estimatedMinutes || 30) / 60, 0),
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save module to database
      const moduleResult = await db.collection("modules").insertOne(module)
      module._id = moduleResult.insertedId.toString()

      // Create lessons
      const lessonIds: { lessonId: string; order: number }[] = []
      for (const lessonData of moduleData.lessons) {
        const lesson: Lesson = {
          moduleId: module._id,
          title: lessonData.title,
          content: `<h1>${lessonData.title}</h1><p>${lessonData.description}</p><p>Full content will be generated when you access this lesson.</p>`,
          contentType: "text",
          mediaUrls: [],
          estimatedMinutes: lessonData.estimatedMinutes || 30,
          aiGeneratedContent: {
            promptUsed: `Generate content for lesson: ${lessonData.title}`,
            model: "gpt-4o",
            version: 1,
          },
          interactiveElements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        // Save lesson to database
        const lessonResult = await db.collection("lessons").insertOne(lesson)
        lesson._id = lessonResult.insertedId.toString()
        lessonIds.push({ lessonId: lesson._id, order: lessonData.order })
      }

      // Update module with lesson IDs
      await db.collection("modules").updateOne({ _id: module._id }, { $set: { lessons: lessonIds } })

      // Update course with module ID
      await db
        .collection("courses")
        .updateOne({ _id: courseId }, { $push: { "timelineVariations.0.modules": module._id } })

      return module
    } catch (error) {
      console.error("Error parsing AI response:", error)
      throw new Error("Failed to generate module")
    }
  }
}

// Content Generator Agent - Creates lesson content
export class ContentGeneratorAgent {
  async generateLessonContent(
    lessonId: string,
    moduleId: string,
    topic: string,
    timelineMonths: number,
  ): Promise<Lesson> {
    const { db } = await connectToDatabase()

    // Check cache first
    const cachedContent = await db.collection("ai_cache").findOne({
      type: "lesson_content",
      lessonId,
      moduleId,
    })

    if (cachedContent) {
      return cachedContent.data as Lesson
    }

    // Get module and lesson info
    const module = await db.collection("modules").findOne({ _id: moduleId })
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`)
    }

    const lesson = await db.collection("lessons").findOne({ _id: lessonId })
    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId}`)
    }

    // Get course info
    const course = await db.collection("courses").findOne({ _id: module.courseId })
    if (!course) {
      throw new Error(`Course not found: ${module.courseId}`)
    }

    // Generate content with AI
    const prompt = `
      Create detailed lesson content for "${lesson.title}" that is part of the module "${module.title}" 
      in the course "${course.title}".
      
      This is for a ${timelineMonths}-month timeline, so adjust the depth accordingly.
      The course difficulty level is ${course.difficulty}.
      
      The content should include:
      1. An engaging introduction that explains why this topic is important
      2. Key concepts explained clearly with examples
      3. Code examples or practical applications where appropriate
      4. Visual explanations (describe what images or diagrams would be helpful)
      5. Practice exercises or reflection questions
      6. Summary of key points
      7. Additional resources for further learning
      
      Format the content with HTML for rich text formatting. Use appropriate heading tags (h1, h2, h3),
      paragraphs, lists, code blocks, etc. For code examples, use <pre><code> tags.
      
      Also include 3-5 quiz questions at the end to test understanding, with multiple-choice options and correct answers.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    // Extract quiz questions if they exist
    let content = text
    let quizQuestions = []

    // Simple regex to try to extract quiz section
    const quizMatch =
      text.match(/<h2>Quiz Questions<\/h2>([\s\S]*?)(?:<h2>|$)/i) ||
      text.match(/<h3>Quiz Questions<\/h3>([\s\S]*?)(?:<h3>|$)/i) ||
      text.match(/<h2>Quiz<\/h2>([\s\S]*?)(?:<h2>|$)/i) ||
      text.match(/<h3>Quiz<\/h3>([\s\S]*?)(?:<h3>|$)/i)

    if (quizMatch) {
      const quizSection = quizMatch[1]

      // Try to parse quiz questions
      const questionMatches = quizSection.match(/<p>(\d+)\.\s+(.*?)<\/p>([\s\S]*?)(?=<p>\d+\.|$)/g)

      if (questionMatches) {
        quizQuestions = questionMatches.map((match) => {
          const questionMatch = match.match(/<p>(\d+)\.\s+(.*?)<\/p>/)
          const question = questionMatch ? questionMatch[2] : "Question"

          // Try to extract options
          const options = []
          const optionMatches = match.match(/<li>(.*?)<\/li>/g)
          if (optionMatches) {
            optionMatches.forEach((optionMatch) => {
              const option = optionMatch.replace(/<li>(.*?)<\/li>/, "$1")
              options.push(option)
            })
          }

          // Try to find correct answer
          let correctAnswer = ""
          const correctMatch = match.match(/correct answer[:\s]*([A-D])|answer[:\s]*([A-D])/i)
          if (correctMatch) {
            correctAnswer = (correctMatch[1] || correctMatch[2]).trim()
          }

          return {
            question,
            options,
            correctAnswer,
          }
        })

        // Remove quiz section from content
        content = text.replace(quizMatch[0], "")
      }
    }

    // Create interactive elements for the quiz
    const interactiveElements =
      quizQuestions.length > 0
        ? [
            {
              type: "quiz",
              data: {
                questions: quizQuestions.map((q) => ({
                  question: q.question,
                  type: "multiple-choice",
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                })),
              },
            },
          ]
        : [
            {
              type: "quiz",
              data: {
                questions: [
                  {
                    question: "What is the main concept covered in this lesson?",
                    type: "open-ended",
                  },
                ],
              },
            },
          ]

    // Update lesson with generated content
    const updatedLesson: Lesson = {
      ...lesson,
      content,
      interactiveElements,
      updatedAt: new Date(),
    }

    // Save to database
    await db.collection("lessons").updateOne(
      { _id: lessonId },
      {
        $set: {
          content,
          interactiveElements,
          updatedAt: new Date(),
        },
      },
    )

    // Cache the result
    await db.collection("ai_cache").insertOne({
      type: "lesson_content",
      lessonId,
      moduleId,
      data: updatedLesson,
      createdAt: new Date(),
    })

    return updatedLesson
  }
}

// Assessment Agent - Creates quizzes and tests
export class AssessmentAgent {
  async generateAssessment(moduleId: string, topics: string[], difficulty: string): Promise<Assessment> {
    const { db } = await connectToDatabase()

    // Check cache first
    const cachedAssessment = await db.collection("ai_cache").findOne({
      type: "assessment",
      moduleId,
    })

    if (cachedAssessment) {
      return cachedAssessment.data as Assessment
    }

    // Get module info
    const module = await db.collection("modules").findOne({ _id: moduleId })
    if (!module) {
      throw new Error(`Module not found: ${moduleId}`)
    }

    // Get course info
    const course = await db.collection("courses").findOne({ _id: module.courseId })
    if (!course) {
      throw new Error(`Course not found: ${module.courseId}`)
    }

    // Get lesson titles for context
    const lessonIds = module.lessons.map((l: any) => l.lessonId)
    const lessons = await db
      .collection("lessons")
      .find({ _id: { $in: lessonIds } })
      .toArray()
    const lessonTitles = lessons.map((l: any) => l.title)

    // Generate assessment with AI
    const prompt = `
      Create a comprehensive assessment for the module "${module.title}" in the course "${course.title}".
      This module covers these lessons: ${lessonTitles.join(", ")}.
      The difficulty level is ${difficulty}.
      
      The assessment should include:
      1. 8 multiple-choice questions
      2. 4 true/false questions
      3. 3 open-ended questions
      
      For multiple-choice and true/false questions, include the correct answers.
      For open-ended questions, include evaluation criteria.
      
      Format the response as a structured JSON object with this structure:
      {
        "title": "Assessment title",
        "description": "Assessment description",
        "questions": [
          {
            "question": "Question text",
            "type": "multiple-choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A",
            "points": 10
          },
          {
            "question": "True/false question text",
            "type": "true-false",
            "options": ["True", "False"],
            "correctAnswer": "True",
            "points": 5
          },
          {
            "question": "Open-ended question text",
            "type": "open-ended",
            "points": 15,
            "evaluationCriteria": "What to look for in a good answer"
          }
        ],
        "passingScore": 70
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
    })

    try {
      const assessmentData = JSON.parse(text)

      // Create assessment structure
      const assessment: Assessment = {
        moduleId,
        title: assessmentData.title || `Assessment for ${module.title}`,
        description: assessmentData.description || `This assessment covers the key concepts from ${module.title}`,
        type: "quiz",
        questions: assessmentData.questions || [],
        passingScore: assessmentData.passingScore || 70,
        aiEvaluationParams: {
          rubric:
            "Evaluate based on understanding of key concepts, clarity of explanation, and application of knowledge.",
          evaluationPrompt: `Evaluate this answer for a question about ${module.title}. Consider accuracy, completeness, and clarity.`,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save to database
      const result = await db.collection("assessments").insertOne(assessment)
      assessment._id = result.insertedId.toString()

      // Update module with assessment ID
      await db.collection("modules").updateOne({ _id: moduleId }, { $set: { assessmentId: assessment._id } })

      // Cache the result
      await db.collection("ai_cache").insertOne({
        type: "assessment",
        moduleId,
        data: assessment,
        createdAt: new Date(),
      })

      return assessment
    } catch (error) {
      console.error("Error parsing AI response:", error)
      throw new Error("Failed to generate assessment")
    }
  }
}

// Resource Agent - Collects supplementary materials
export class ResourceAgent {
  async findResources(topic: string, resourceType: "article" | "video" | "book") {
    const prompt = `
      Find 3 high-quality ${resourceType} resources about "${topic}" for educational purposes.
      For each resource, provide:
      1. Title
      2. Author/Creator
      3. URL or reference
      4. A brief description of why it's valuable
      
      Format the response as a structured JSON array.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    try {
      return JSON.parse(text)
    } catch (error) {
      console.error("Error parsing AI response:", error)
      throw new Error("Failed to find resources")
    }
  }
}

// QA Agent - Verifies content quality
export class QAAgent {
  async verifyContent(content: string, topic: string) {
    const prompt = `
      Review this educational content about "${topic}" and evaluate it for:
      1. Accuracy - Is the information correct?
      2. Clarity - Is it easy to understand?
      3. Completeness - Does it cover the topic adequately?
      4. Engagement - Is it interesting and engaging?
      
      Provide specific suggestions for improvement in each area.
      Format the response as a structured JSON object.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system:
        "You are an expert educational content reviewer with deep knowledge of pedagogy and subject matter expertise.",
      temperature: 0.7,
    })

    try {
      return JSON.parse(text)
    } catch (error) {
      console.error("Error parsing AI response:", error)
      throw new Error("Failed to verify content")
    }
  }
}
