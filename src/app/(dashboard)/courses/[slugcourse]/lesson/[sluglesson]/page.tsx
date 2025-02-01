"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PlayCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCourseBySlug } from "@/lib/actions/course.action"
import { getLessonBySlug } from "@/lib/actions/lesson.action"
import type { TShowCourse, TShowLesson } from "@/types"

export default function CourseVideoPlayer() {
  const slug = useParams()
  const [courseInfo, setCourseInfo] = useState<TShowCourse | null>(null)
  const [lesson, setLesson] = useState<TShowLesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [course, lessonData] = await Promise.all([
          getCourseBySlug(slug.slugcourse as string),
          getLessonBySlug(slug.sluglesson as string), ,
        ])
        setCourseInfo(course)
        setLesson(lessonData || null)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug.slugcourse, slug.sluglesson])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!courseInfo || !lesson) {
    return <div className="flex items-center justify-center h-screen">Không tìm thấy khóa học hoặc bài học</div>
  }

  const currentLectureIndex = courseInfo.lectures.findIndex((lecture) =>
    lecture.lessons.some((l: TShowLesson) => l.slug === lesson.slug),
  )
  const currentLecture = courseInfo.lectures[currentLectureIndex]
  const currentLessonIndex = currentLecture.lessons.findIndex((l: TShowLesson) => l.slug === lesson.slug)
  const nextLesson =
    currentLecture.lesson[currentLessonIndex + 1] || courseInfo.lectures[currentLectureIndex + 1]?.lessons[0]
  const prevLesson =
    currentLecture.lesson[currentLessonIndex - 1] || courseInfo.lectures[currentLectureIndex - 1]?.lessons.slice(-1)[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
       

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Video Player */}
            <div className="aspect-video bg-black mb-6">
              {lesson.videoType === "DRIVE" ? (
                <iframe
                  src={`https://drive.google.com/file/d/${lesson.videoURL}/preview`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />

              ) : (
                <iframe
                src={`https://www.youtube.com/embed/${lesson.videoURL}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              )}

            </div>

            {/* Video Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
              <p className="text-muted-foreground">{lesson.content || "Không có mô tả cho video này."}</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mb-8">
              {prevLesson ? (
                <Button variant="outline" asChild>
                  <Link href={`/courses/${slug.slugcourse}/lesson/${prevLesson.slug}`}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Bài trước
                  </Link>
                </Button>
              ) : (
                <div></div>
              )}
              {nextLesson && (
                <Button asChild>
                  <Link href={`/courses/${slug.slugcourse}/lesson/${nextLesson.slug}`}>
                    Bài tiếp theo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Lesson Content */}
            <div className="prose max-w-none">{lesson.content}</div>
          </div>

          {/* Sidebar - List of Lessons */}
          <div className="lg:w-1/3">
            <div className="bg-muted rounded-lg p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4">Danh sách bài học</h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {courseInfo.lectures.map((lecture) => (
                  <div key={lecture._id} className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {lecture.title}
                    </h4>
                    <ul className="space-y-1">
                      {lecture.lessons.map((lessonItem: TShowLesson) => (
                        <li key={lessonItem._id}>
                          <Link
                            href={`/courses/${slug.slugcourse}/lesson/${lessonItem.slug}`}
                            className={`
                              flex items-center p-2 rounded text-sm
                              ${
                                lesson.slug === lessonItem.slug
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted-foreground/10"
                              }
                            `}
                          >
                            <PlayCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="line-clamp-2">{lessonItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

