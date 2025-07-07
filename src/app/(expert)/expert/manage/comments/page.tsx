"use client"

import { useEffect, useState } from "react"
import { PacmanLoader } from "react-spinners"
import { Card } from "@/components/ui/card"
import { deleteCommentInCourse, getCoursesWithComments } from "@/lib/actions/course.action"
import { Button } from "@/components/ui/button"
import { Trash2, Clock, Filter, Search } from "lucide-react"
import { TShowComment, TCourseInfo } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@clerk/nextjs"
import { getUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TCourseWithComments = TCourseInfo & {
  comments: TShowComment[];
};

type TFilteredComment = TShowComment & {
  courseTitle: string;
};

const ITEMS_PER_PAGE = 15;

export default function ManageCommentsPage() {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser()
  const [coursesWithComments, setCoursesWithComments] = useState<TCourseWithComments[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    const fetchComments = async () => {
      if (!isUserLoaded) return;
      if (!clerkUser) {
        redirect("/sign-in");
        return;
      }

      try {
        const dbUser = await getUser(clerkUser.id);
        if (!dbUser) {
          redirect("/sign-in");
          return;
        }

        const data = await getCoursesWithComments(dbUser._id)
        setCoursesWithComments(data || null)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching comments:", error)
        toast({
          variant: "destructive",
          description: "Không thể tải bình luận. Vui lòng thử lại sau.",
        })
        setLoading(false)
      }
    }
    fetchComments()
  }, [clerkUser, isUserLoaded])

  const handleDelete = async (courseId: string, commentId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
      try {
        const result = await deleteCommentInCourse(courseId, commentId)
        if (result.success) {
          // Update local state to remove the deleted comment
          setCoursesWithComments(prev => {
            if (!prev) return null;
            return prev.map(course => ({
              ...course,
              comments: course._id === courseId 
                ? course.comments.filter(c => c._id !== commentId)
                : course.comments
            }));
          });
          toast({
            description: result.message,
          })
        } else {
          toast({
            variant: "destructive",
            description: result.message,
          })
        }
      } catch (error) {
        console.error("Error deleting comment:", error)
        toast({
          variant: "destructive",
          description: "Không thể xóa bình luận. Vui lòng thử lại.",
        })
      }
    }
  }

  // Transform comments for table display
  const getAllComments = (): TFilteredComment[] => {
    if (!coursesWithComments) return [];
    
    return coursesWithComments.flatMap(course => 
      course.comments.map(comment => ({
        ...comment,
        courseTitle: course.title
      }))
    );
  }

  // Filter and sort comments
  const getFilteredComments = (): TFilteredComment[] => {
    let comments = getAllComments();

    // Filter by course if selected
    if (selectedCourse !== "all") {
      comments = comments.filter(comment => 
        comment.courseTitle === selectedCourse
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      comments = comments.filter(comment =>
        comment.content.toLowerCase().includes(searchLower) ||
        comment.name.toLowerCase().includes(searchLower) ||
        comment.courseTitle.toLowerCase().includes(searchLower)
      );
    }

    // Sort comments
    comments.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return comments;
  }

  // Pagination
  const filteredComments = getFilteredComments();
  const totalPages = Math.ceil(filteredComments.length / ITEMS_PER_PAGE);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique course titles for filter dropdown
  const courseOptions = coursesWithComments 
    ? [...new Set(coursesWithComments.map(course => course.title))]
    : [];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader />
        </div>
      ) : (
        <div className="container mx-auto p-4 md:p-8">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-3xl font-bold">Quản lý bình luận</h1>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search input */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bình luận..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>

              {/* Course filter */}
              <Select
                value={selectedCourse}
                onValueChange={(value) => {
                  setSelectedCourse(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Chọn khóa học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khóa học</SelectItem>
                  {courseOptions.map(course => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort options */}
              <Select
                value={sortBy}
                onValueChange={(value: "newest" | "oldest") => setSortBy(value)}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertDescription>
              Hiển thị {paginatedComments.length} / {filteredComments.length} bình luận
            </AlertDescription>
          </Alert>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người bình luận</TableHead>
                  <TableHead className="w-[40%]">Nội dung</TableHead>
                  <TableHead>Khóa học</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedComments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell className="font-medium">
                      {comment.name}
                    </TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.courseTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(comment.created_at), { 
                          addSuffix: true,
                          locale: vi 
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          const course = coursesWithComments?.find(c => 
                            c.title === comment.courseTitle
                          );
                          if (course) {
                            handleDelete(course._id, comment._id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
} 