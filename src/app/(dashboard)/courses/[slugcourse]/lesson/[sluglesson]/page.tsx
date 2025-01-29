"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PlayCircle, Loader2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getCourseBySlug } from "@/lib/actions/course.action"
import { getLessonBySlug } from "@/lib/actions/lesson.action"
import type { TShowCourse, TShowLesson } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function CourseVideoPlayer() {
  const slug = useParams()
  const [courseInfo, setCourseInfo] = useState<TShowCourse | null | undefined>(null)
  const [lessons, setLessons] = useState<TShowLesson | undefined | null>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [course, lesson] = await Promise.all([getCourseBySlug(slug.slugcourse), getLessonBySlug(slug.sluglesson)])
        setCourseInfo(course)
        setLessons(lesson)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug.slugcourse, slug.sluglesson])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          {/* Video Section */}
          <div className="space-y-6">
            <div className="rounded-xl overflow-hidden bg-white/5 backdrop-blur">
              <h2 className="text-xl font-semibold p-4 border-b border-white/10">
                {isLoading ? <Skeleton className="h-7 w-48 bg-white/10" /> : "Video bài học"}
              </h2>
              <div className="p-4">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                    </div>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://drive.google.com/file/d/${lessons?.videoURL}/preview`}
                      title="Course Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )}
                </div>
                <div className="mt-4">
                  {isLoading ? (
                    <Skeleton className="h-20 w-full bg-white/10" />
                  ) : (
                    <p className="text-gray-400 text-sm leading-relaxed">{courseInfo?.lectures[0].lesson[0].content}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="rounded-xl bg-white/5 backdrop-blur overflow-hidden">
            <h2 className="text-lg font-semibold p-4 border-b border-white/10">Nội dung khóa học</h2>
            <div className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-white/10" />
                  ))}
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {courseInfo?.lectures.map((lecture) => (
                    <AccordionItem
                      key={lecture._id}
                      value={lecture._id}
                      className="border border-white/10 rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{lecture.title}</span>
                          <span className="text-xs text-white/60">{lecture.lesson.length} bài học</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-t border-white/10">
                        <div className="divide-y divide-white/10">
                          {lecture.lesson.map((lesson) => (
                            <Link
                              key={lesson._id}
                              href={`/courses/${slug.slugcourse}/lesson/${lesson.slug}`}
                              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                                lessons?.slug === lesson.slug ? "bg-white/10" : ""
                              }`}
                            >
                              <PlayCircle
                                className={`w-5 h-5 flex-shrink-0 ${
                                  lessons?.slug === lesson.slug ? "text-white" : "text-white/60"
                                }`}
                              />
                              <span className="text-sm font-medium">{lesson.title}</span>
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

