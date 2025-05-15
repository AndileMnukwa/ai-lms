"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, AlertCircle, Award } from "lucide-react"

interface LessonQuizProps {
  lesson: any
  onComplete: () => void
}

export default function LessonQuiz({ lesson, onComplete }: LessonQuizProps) {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Record<number, string>>({})

  // Get quiz questions from lesson or use sample questions
  const questions = lesson.interactiveElements?.find((e) => e.type === "quiz")?.data?.questions || [
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
  ]

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer,
    })
  }

  const handleSubmit = () => {
    // Calculate score for auto-graded questions
    let totalPoints = 0
    let earnedPoints = 0
    const newFeedback: Record<number, string> = {}

    questions.forEach((question, index) => {
      totalPoints += question.points || 0

      if (question.type === "multiple-choice" || question.type === "true-false") {
        if (answers[index] === question.correctAnswer) {
          earnedPoints += question.points || 0
          newFeedback[index] = "Correct!"
        } else {
          newFeedback[index] = `Incorrect. The correct answer is: ${question.correctAnswer}`
        }
      } else if (question.type === "open-ended" && answers[index]) {
        // For open-ended questions, give full points if answered
        // In a real app, this would be graded by AI or an instructor
        earnedPoints += question.points || 0
        newFeedback[index] = "Your answer has been recorded."
      }
    })

    const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

    setScore(percentage)
    setFeedback(newFeedback)
    setSubmitted(true)
  }

  const isQuizComplete = submitted && score !== null && score >= 70

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-2">Knowledge Check</h2>
        <p className="text-text-light mb-4">Test your understanding of the key concepts covered in this lesson.</p>
      </div>

      {submitted && score !== null && (
        <Card className={`mb-6 ${score >= 70 ? "bg-green-50" : "bg-amber-50"}`}>
          <CardContent className="p-4 flex items-center">
            {score >= 70 ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">Congratulations! You scored {score}%</p>
                  <p className="text-sm text-green-700">You have successfully completed this quiz.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
                <div>
                  <p className="font-medium text-amber-800">You scored {score}%</p>
                  <p className="text-sm text-amber-700">You need 70% to pass. Review the feedback and try again.</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-start">
              <span className="bg-secondary/10 text-secondary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                {index + 1}
              </span>
              <div className="space-y-2 flex-grow">
                <p className="font-medium text-secondary">{question.question}</p>

                {question.type === "multiple-choice" && (
                  <RadioGroup
                    value={answers[index] as string}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    disabled={submitted}
                  >
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                          <Label htmlFor={`q${index}-o${optionIndex}`} className="flex-grow">
                            {option}
                          </Label>
                          {submitted &&
                            answers[index] === option &&
                            (option === question.correctAnswer ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ))}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {question.type === "true-false" && (
                  <RadioGroup
                    value={answers[index] as string}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    disabled={submitted}
                  >
                    <div className="space-y-2">
                      {["True", "False"].map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                          <Label htmlFor={`q${index}-o${optionIndex}`} className="flex-grow">
                            {option}
                          </Label>
                          {submitted &&
                            answers[index] === option &&
                            (option === question.correctAnswer ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ))}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {question.type === "open-ended" && (
                  <Textarea
                    value={(answers[index] as string) || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                    className="border-gray focus:border-primary"
                    rows={4}
                    disabled={submitted}
                  />
                )}

                {submitted && feedback[index] && (
                  <p
                    className={`text-sm ${feedback[index].startsWith("Correct") ? "text-green-600" : feedback[index].startsWith("Incorrect") ? "text-red-600" : "text-text-light"}`}
                  >
                    {feedback[index]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit Answers
          </Button>
        ) : isQuizComplete ? (
          <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
            <Award className="h-4 w-4 mr-2" />
            Complete Lesson
          </Button>
        ) : (
          <Button
            onClick={() => {
              setSubmitted(false)
              setScore(null)
              setFeedback({})
            }}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
