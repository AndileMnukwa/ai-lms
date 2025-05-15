"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, Trash2 } from "lucide-react"

interface LessonNotesProps {
  lessonId: string
}

export default function LessonNotes({ lessonId }: LessonNotesProps) {
  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load saved notes from localStorage
    const savedData = localStorage.getItem(`lesson_notes_${lessonId}`)
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setNotes(data.notes)
        setSavedNotes(data.notes)
        setLastSaved(new Date(data.timestamp))
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    }
  }, [lessonId])

  const saveNotes = async () => {
    setSaving(true)

    try {
      // In a real app, you would save to the server here
      // For now, we'll just use localStorage
      const timestamp = new Date()
      localStorage.setItem(
        `lesson_notes_${lessonId}`,
        JSON.stringify({
          notes,
          timestamp: timestamp.toISOString(),
        }),
      )

      setSavedNotes(notes)
      setLastSaved(timestamp)
    } catch (error) {
      console.error("Error saving notes:", error)
    } finally {
      setSaving(false)
    }
  }

  const clearNotes = () => {
    if (window.confirm("Are you sure you want to clear your notes? This cannot be undone.")) {
      setNotes("")
      setSavedNotes("")
      setLastSaved(null)
      localStorage.removeItem(`lesson_notes_${lessonId}`)
    }
  }

  const hasUnsavedChanges = notes !== savedNotes

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-2">Your Notes</h2>
        <p className="text-text-light mb-4">
          Take notes as you go through the lesson. Your notes are saved automatically and are only visible to you.
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type your notes here..."
          className="min-h-[200px] border-gray focus:border-primary"
        />

        <div className="flex justify-between items-center">
          <div className="text-sm text-text-light">
            {lastSaved ? <>Last saved: {lastSaved.toLocaleString()}</> : <>Not saved yet</>}
            {hasUnsavedChanges && <span className="ml-2 text-primary">(Unsaved changes)</span>}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearNotes}
              className="border-red-500 text-red-500 hover:bg-red-50"
              disabled={!notes}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>

            <Button
              size="sm"
              onClick={saveNotes}
              className="bg-primary hover:bg-primary/90"
              disabled={saving || !hasUnsavedChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
