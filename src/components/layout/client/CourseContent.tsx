
"use client"
import { useState } from "react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TShowCourse } from "@/types"



async function getLectureData(lectureId: string) {
  
}

async function getLessonData(lessonId: string) {
  
}

export default async function CourseContent({ course }: { course: TShowCourse }) {

  const [expandedLecture, setExpandedLecture] = useState<string | null>(null)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
      <Accordion type="single" collapsible>
        {course.lectures.map(async (lectureId) => {
          const lecture = await getLectureData(lectureId)
          return (
            <AccordionItem key={lecture._id} value={lecture._id}>
              <AccordionTrigger>{lecture.title}</AccordionTrigger>
              <AccordionContent>
                <ul>
                  {lecture.lessons.map(async (lessonId) => {
                    const lesson = await getLessonData(lessonId)
                    return (
                      <li key={lesson._id} className="py-2">
                        <Link
                          href={`/courses/${course._id}/lessons/${lesson.slug}`}
                          className="text-blue-500 hover:underline"
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

