"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PlayCircle, Loader2, ChevronLeft, ChevronRight, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import LessonAttachment from "@/components/client/LessonAttachment"

import { getCourseBySlug } from "@/lib/actions/course.action"
import { getLessonBySlug } from "@/lib/actions/lesson.action"
import type { TCreateComment, TShowComment, TShowCourse, TShowLesson } from "@/types"
import { createComment, getCommentsByLessonId } from "@/lib/actions/comment.action"
import { useUser } from "@clerk/nextjs"

function CommentItem({ comment, onReply }: { comment: TShowComment; onReply: (parentId: string) => void }) {
  return (
    <div className="flex space-x-4 border-b pb-4 mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-sm font-medium">{comment.name.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-semibold">{comment.name}</h4>
          <span className="text-sm text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>
        <p className="mt-1">{comment.content}</p>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => onReply(comment._id)}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Trả lời
        </Button>
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CourseVideoPlayer() {
  const { user } = useUser()
  const slug = useParams()
  const [courseInfo, setCourseInfo] = useState<TShowCourse | null>(null)
  const [lesson, setLesson] = useState<TShowLesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<TShowComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [course, lessonData] = await Promise.all([
          getCourseBySlug(slug.slugcourse as string),
          getLessonBySlug(slug.sluglesson as string),
        ])
        setCourseInfo(course)
        setLesson(lessonData || null)
        const commentLesson = await getCommentsByLessonId(lessonData!._id)
        setComments(commentLesson || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
        setIsSubmitting(false)
      }
    }

    fetchData()
  }, [slug.slugcourse, slug.sluglesson, isSubmitting])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (newComment.trim()) {
      const comment: TCreateComment = {
        name: user!.username,
        lesson: lesson!._id,
        user: user!.id,
        content: newComment,
        parent: replyTo || undefined,
      }
      console.log(comment)
      await createComment(comment)
      setComments([])
      setNewComment("")
      setReplyTo(null)
      setIsSubmitting(false)
    }
  }

  const handleReply = (parentId: string) => {
    setReplyTo(parentId)
  }

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
    currentLecture.lessons[currentLessonIndex + 1] || courseInfo.lectures[currentLectureIndex + 1]?.lessons[0]
  const prevLesson =
    currentLecture.lessons[currentLessonIndex - 1] || courseInfo.lectures[currentLectureIndex - 1]?.lessons.slice(-1)[0]

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
              <Tabs defaultValue="description" className="mb-6">
                <TabsList>
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="attachments">Tài liệu đính kèm</TabsTrigger>
                  <TabsTrigger value="discussion">Thảo luận & Đánh giá</TabsTrigger>
                </TabsList>

                <TabsContent value="description">
                  <div className="prose max-w-none">{lesson.description || "Không có mô tả cho bài học này."}</div>
                </TabsContent>

                <TabsContent value="attachments">
                  {lesson.attachments && lesson.attachments.length > 0 ? (
                    <LessonAttachment attachments={lesson.attachments} />
                  ) : (
                    <p className="text-muted-foreground">Không có tài liệu đính kèm cho bài học này.</p>
                  )}
                </TabsContent>

                <TabsContent value="discussion">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <CommentItem key={comment._id} comment={comment} onReply={handleReply} />
                      ))}

                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <Textarea
                          placeholder={replyTo ? "Viết câu trả lời..." : "Thêm bình luận của bạn..."}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between">
                          <Button type="submit" className="flex items-center">
                            <Send className="w-4 h-4 mr-2" />
                            {replyTo ? "Gửi trả lời" : "Gửi bình luận và đánh giá"}
                          </Button>
                          {replyTo && (
                            <Button type="button" variant="outline" onClick={() => setReplyTo(null)}>
                              Hủy trả lời
                            </Button>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
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
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Nội dung khóa học</h3>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-6">
                  {courseInfo.lectures.map((lecture, lectureIndex) => (
                    <div key={lecture._id}>
                      <h4 className="font-medium mb-2">
                        Chương {lectureIndex + 1}: {lecture.title}
                      </h4>
                      <ul className="space-y-2">
                        {lecture.lessons.map((lessonItem: TShowLesson) => (
                          <li key={lessonItem._id}>
                            <Link
                              href={`/courses/${slug.slugcourse}/lesson/${lessonItem.slug}`}
                              className={`flex items-center p-2 rounded hover:bg-accent ${
                                lesson.slug === lessonItem.slug ? "bg-accent" : ""
                              }`}
                            >
                              <PlayCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{lessonItem.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

