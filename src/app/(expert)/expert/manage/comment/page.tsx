"use client"

import { useEffect, useState } from "react"
import { PacmanLoader } from "react-spinners"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { deleteCommentInCourse, getCoursesWithComments } from "@/lib/actions/course.action"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, MessageSquare, Trash2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TShowComment, TCourseInfo } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/nextjs"
import { getUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"

type TCourseWithComments = TCourseInfo & {
  comments: TShowComment[];
};

const COMMENTS_PER_PAGE = 10;

export default function ManageCommentsPage() {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser()
  const [coursesWithComments, setCoursesWithComments] = useState<TCourseWithComments[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingComment, setLoadingComment] = useState(true)
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({})

  useEffect(() => {
    const fetchComments = async () => {
      if (!isUserLoaded) return;
      if (!clerkUser) {
        redirect("/sign-in");
        return;
      }

      try {
        // Get the user's MongoDB ID
        const dbUser = await getUser(clerkUser.id);
        if (!dbUser) {
          redirect("/sign-in");
          return;
        }

        const data = await getCoursesWithComments(dbUser._id)
        setCoursesWithComments(data || null)
        setLoading(false)
        setLoadingComment(false)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          variant: "destructive",
          description: "Không thể tải bình luận. Vui lòng thử lại sau.",
        })
        setLoading(false)
        setLoadingComment(false)
      }
    }
    fetchComments()
  }, [loadingComment, clerkUser, isUserLoaded])

  const toggleOpen = (courseId: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }))
  }

  const handleDelete = (courseId: string, commentId: string) => async () => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
      try {
        setLoadingComment(true)
        await deleteCommentInCourse(courseId, commentId)
        toast({
          description: "Đã xóa bình luận thành công",
        })
      } catch (error) {
        console.error("Error deleting comment:", error)
        toast({
          variant: "destructive",
          description: "Không thể xóa bình luận. Vui lòng thử lại.",
        })
      }
      setLoadingComment(false)
    }
  }

  const filteredCourses = coursesWithComments?.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.comments.some(comment => 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const totalComments = coursesWithComments?.reduce(
    (sum, course) => sum + course.comments.length, 
    0
  ) || 0

  const handlePageChange = (courseId: string, newPage: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [courseId]: newPage,
    }))
  }

  const getPaginatedComments = (comments: TShowComment[], courseId: string) => {
    const page = currentPage[courseId] || 1;
    const start = (page - 1) * COMMENTS_PER_PAGE;
    const end = start + COMMENTS_PER_PAGE;
    return comments.slice(start, end);
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader />
        </div>
      ) : (
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold">Quản lý bình luận</h1>
            <div className="mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Tìm kiếm bình luận..."
                className="px-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              Tổng cộng có {totalComments} bình luận trong {coursesWithComments?.length || 0} khóa học
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {filteredCourses && filteredCourses.length > 0 ? (
              filteredCourses.map((course: TCourseWithComments) => (
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
                          ) : (
                            <>
                              <ul className="space-y-3">
                                {getPaginatedComments(course.comments, course._id).map((comment: TShowComment) => (
                                  <li key={comment._id} className="p-3 rounded-lg bg-muted/30">
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <p className="font-medium text-sm">{comment.name}</p>
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(comment.created_at), { 
                                              addSuffix: true,
                                              locale: vi 
                                            })}
                                          </span>
                                        </div>
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
                              </ul>
                              {course.comments.length > COMMENTS_PER_PAGE && (
                                <div className="flex justify-center gap-2 mt-4">
                                  {Array.from({ length: Math.ceil(course.comments.length / COMMENTS_PER_PAGE) }).map((_, i) => (
                                    <Button
                                      key={i}
                                      variant={currentPage[course._id] === i + 1 ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handlePageChange(course._id, i + 1)}
                                    >
                                      {i + 1}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground italic">Không có bình luận nào.</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                {searchTerm ? "Không tìm thấy bình luận phù hợp." : "Chưa có bình luận nào."}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

