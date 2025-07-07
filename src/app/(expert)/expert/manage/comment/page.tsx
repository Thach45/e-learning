"use client"

import { useEffect, useState } from "react"
import { PacmanLoader } from "react-spinners"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { deleteCommentInCourse, getCoursesWithComments } from "@/lib/actions/course.action"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, MessageSquare, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TShowComment, TCourseInfo } from "@/types"

type TCourseWithComments = TCourseInfo & {
  comments: TShowComment[];
};

export default function ManageCommentsPage() {
  const [coursesWithComments, setCoursesWithComments] = useState<TCourseWithComments[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingComment, setLoadingComment] = useState(true)
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getCoursesWithComments()
      setCoursesWithComments(data || null)
      setLoading(false)
      setLoadingComment(false)
    }
    fetchComments()
  }, [loadingComment])

  const toggleOpen = (courseId: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }
  const handleDelete =(courseId:string, commentId: string) => async () => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
      try{
        setLoadingComment(true)
        await deleteCommentInCourse(courseId, commentId)
      }
      catch (error) {
        console.error("Error deleting comment:", error)
      }
      setLoadingComment(false)
      
    }

  }
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader />
        </div>
      ) : (
        <div className="container mx-auto p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Quản lý bình luận</h1>

          <div className="grid gap-6">
            {coursesWithComments &&
              coursesWithComments.map((course: TCourseWithComments) => (
                <Card key={course._id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{course.title}</h2>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {course.comments.length}
                      </Badge>
                    </div>
                  </CardHeader>

                  {course.comments.length > 0 ? (
                    <Collapsible
                      open={openStates[course._id]}
                      onOpenChange={() => toggleOpen(course._id)}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-between p-4 rounded-none border-t"
                        >
                          <span>{course.comments.length} bình luận</span>
                          {openStates[course._id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="p-4 pt-0">
                          {loadingComment ? (
                            <div className="flex justify-center items-center h-32">
                              <PacmanLoader />
                            </div>
                          ) : <ul className="space-y-3">
                          {course.comments.map((comment: TShowComment) => (
                            <li key={comment._id} className="p-3 rounded-lg bg-muted/30">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <p className="font-medium text-sm">{comment.name}</p>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={handleDelete(course._id, comment._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground italic">Không có bình luận nào.</p>
                    </CardContent>
                  )}
                </Card>
              ))}
          </div>
        </div>
      )}
    </>
  )
}

