"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

type TShowLesson = {
  _id: string
  title: string
  slug: string
  order: number
  videoType: string
  videoURL: string
  content: string
  type: string
  course: string
  lecture: string
  deleted: boolean
}

// Mock data (replace with actual data fetching in a real application)
const mockLessons: TShowLesson[] = [
  {
    _id: "1",
    title: "What is React?",
    slug: "what-is-react",
    order: 1,
    videoType: "youtube",
    videoURL: "https://youtu.be/example1",
    content: "React is a JavaScript library...",
    type: "video",
    course: "1",
    lecture: "1",
    deleted: false,
  },
  {
    _id: "2",
    title: "Setting up a React Project",
    slug: "setup-react-project",
    order: 2,
    videoType: "youtube",
    videoURL: "https://youtu.be/example2",
    content: "To set up a React project...",
    type: "video",
    course: "1",
    lecture: "1",
    deleted: false,
  },
  {
    _id: "3",
    title: "React Hooks",
    slug: "react-hooks",
    order: 1,
    videoType: "youtube",
    videoURL: "https://youtu.be/example3",
    content: "React Hooks allow you to...",
    type: "video",
    course: "1",
    lecture: "2",
    deleted: false,
  },
  {
    _id: "4",
    title: "Custom Hooks",
    slug: "custom-hooks",
    order: 2,
    videoType: "youtube",
    videoURL: "https://youtu.be/example4",
    content: "You can create your own hooks...",
    type: "video",
    course: "1",
    lecture: "2",
    deleted: false,
  },
]

export default function LessonViewer() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const currentLesson = mockLessons[currentLessonIndex]

  const goToNextLesson = () => {
    if (currentLessonIndex < mockLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <iframe
          src={currentLesson.videoURL}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: currentLesson.content }}></div>
      <div className="flex justify-between">
        <Button onClick={goToPreviousLesson} disabled={currentLessonIndex === 0}>
          Previous Lesson
        </Button>
        <Button onClick={goToNextLesson} disabled={currentLessonIndex === mockLessons.length - 1}>
          Next Lesson
        </Button>
      </div>
    </div>
  )
}

