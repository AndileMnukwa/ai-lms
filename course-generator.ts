import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { addDocument, updateDocument, getDocumentById } from "@/lib/firebase/firestore-utils"
import type { Course, Module, Lesson } from "@/lib/types/user"

// Generate a complete course with AI
export async function generateCourse(
  topic: string,
  timelineMonths: number,
  difficulty: "beginner" | "intermediate" | "advanced",
  description?: string,
  targetAudience?: string,
  learningObjectives?: string,
): Promise<Course> {
  try {
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
      difficulty: difficulty,
      prerequisites: curriculumData.prerequisites || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save course to Firebase
    const courseId = await addDocument("courses", course)

    // Create modules and lessons
    const moduleIds: string[] = []
    for (const moduleData of curriculumData.modules) {
      const module: Module = {
        courseId: courseId,
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

      // Save module to Firebase
      const moduleId = await addDocument("modules", module)
      moduleIds.push(moduleId)

      // Create lessons
      const lessonIds: { lessonId: string; order: number; title?: string; contentType?: string }[] = []
      for (const lessonData of moduleData.lessons) {
        const lesson: Lesson = {
          moduleId: moduleId,
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

        // Save lesson to Firebase
        const lessonId = await addDocument("lessons", lesson)
        lessonIds.push({
          lessonId,
          order: lessonData.order,
          title: lessonData.title,
          contentType: "text",
        })
      }

      // Update module with lesson IDs
      await updateDocument("modules", moduleId, { lessons: lessonIds })
    }

    // Update course with module IDs
    await updateDocument("courses", courseId, {
      "timelineVariations.0.modules": moduleIds,
      id: courseId,
    })

    return { ...course, id: courseId }
  } catch (error) {
    console.error("Error generating course:", error)
    throw new Error("Failed to generate course")
  }
}

// Generate content for a specific lesson
export async function generateLessonContent(lessonId: string): Promise<Lesson> {
  try {
    // Get lesson data
    const lesson = await getDocumentById<Lesson>("lessons", lessonId)
    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId}`)
    }

    // Get module data
    const module = await getDocumentById("modules", lesson.moduleId)
    if (!module) {
      throw new Error(`Module not found: ${lesson.moduleId}`)
    }

    // Get course data
    const course = await getDocumentById("courses", module.courseId)
    if (!course) {
      throw new Error(`Course not found: ${module.courseId}`)
    }

    // Generate content with AI
    const prompt = `
      Create detailed lesson content for "${lesson.title}" that is part of the module "${module.title}" 
      in the course "${course.title}".
      
      This is for a ${module.timelineMonths}-month timeline, so adjust the depth accordingly.
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
            type: "multiple-choice",
            points: 10,
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
                questions: quizQuestions,
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
                    type: "multiple-choice",
                    options: [
                      "Option A: First concept",
                      "Option B: Second concept",
                      "Option C: Third concept",
                      "Option D: Fourth concept",
                    ],
                    correctAnswer: "Option B: Second concept",
                    points: 10,
                  },
                  {
                    question: "True or False: The statement discussed in the lesson is accurate.",
                    type: "true-false",
                    options: ["True", "False"],
                    correctAnswer: "True",
                    points: 5,
                  },
                  {
                    question: "Explain in your own words the significance of the topic covered in this lesson.",
                    type: "open-ended",
                    points: 15,
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

    // Save to Firebase
    await updateDocument("lessons", lessonId, {
      content,
      interactiveElements,
      updatedAt: new Date(),
    })

    return updatedLesson
  } catch (error) {
    console.error("Error generating lesson content:", error)
    throw new Error("Failed to generate lesson content")
  }
}
