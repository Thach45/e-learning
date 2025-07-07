"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Edit, Trash2, User, Search, GripVertical, BarChart } from "lucide-react"
import { getExpertCourses } from "@/lib/actions/course.action"
import { TCourseInfo, TCreateLecture, TCreateLesson, TLesson, TEditLesson } from "@/types"
import { createLecture, deleteLecture, getLectures } from "@/lib/actions/lecture.model"
import mongoose from "mongoose"
import { useForm } from "react-hook-form"
import { createLesson, deleteLesson, getLessons } from "@/lib/actions/lesson.action"
import EditLessonDialog from "@/components/layout/admin/EditLesson"
import { PacmanLoader } from "react-spinners"
import { useUser } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

export default function CourseManagement() {
  const { user } = useUser();
  const [courses, setCourses] = useState<TCourseInfo[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<string | undefined>("")
  const [lessons, setLessons] = useState<TLesson[] | undefined>([])
  const [editLesson, setEditLesson] = useState<boolean>(false)
  const [lessonToEdit, setLessonToEdit] = useState<TEditLesson | null>(null)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [chapters, setChapters] = useState<TCreateLecture[] | undefined>([])
  const [loading, setLoading] = useState(true)
  const [loadingPage, setLoadingPage] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TCreateLesson>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Format price with commas for VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  // Get status badge color and Vietnamese text
  const getStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PUBLISHED: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      REJECTED: "bg-red-100 text-red-800"
    };

    const statusText = {
      PENDING: "Chờ duyệt",
      PUBLISHED: "Đã xuất bản",
      DRAFT: "Bản nháp",
      REJECTED: "Từ chối"
    };

    return {
      color: statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800",
      text: statusText[status as keyof typeof statusText] || status
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const course = await getExpertCourses(user.id);
        setCourses(course || []);

        if (selectedCourse) {
          const chapter = await getChapter(selectedCourse);
          setChapters(chapter || []);

          if (selectedChapter) {
            const lesson = await getLessons(selectedChapter, selectedCourse);
            setLessons(lesson || []);
          } else {
            setLessons([]);
          }
        }

        setLoading(false);
        setLoadingPage(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setLoadingPage(false);
      }
    };
    fetchData();
  }, [refreshTrigger, selectedCourse, selectedChapter, user?.id]);

  // Filter chapters based on search term
  const filteredChapters = chapters?.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addChapter = async () => {
    try {
      if (!selectedCourse || !newChapterTitle.trim()) {
        console.error("Missing required data");
        return;
      }

      const data: TCreateLecture = {
        title: newChapterTitle,
        course: new mongoose.Types.ObjectId(selectedCourse),
        deleted: false
      };

      await createLecture(data);
      setLoading(true);
      setRefreshTrigger(prev => prev + 1);
      setNewChapterTitle("");
    }
    catch (error) {
      console.error("Error adding chapter:", error);
    }
  };

  const getChapter = async (selectedCourse: string) => {
    try {
      if (!selectedCourse) {
        console.error("No course selected");
        return [];
      }
      const chapter = await getLectures(selectedCourse);
      return chapter;
    }
    catch (error) {
      console.error("Error getting chapters:", error);
      return [];
    }
  };

  const handleDeleteLecture = async (id: string) => {
    await deleteLecture(id)
    setLoading(true)
    setRefreshTrigger(prev => prev + 1) // Trigger re-fetch
  }

  const handleDeleteLesson = async (id: string) => {
    await deleteLesson(id)
    setLoading(true)
    setRefreshTrigger(prev => prev + 1) // Trigger re-fetch
  }

  const handleEditLesson = (lesson: TLesson) => {
    const editLesson: TEditLesson = {
      ...lesson,
      deleted: false
    }
    setLessonToEdit(editLesson)
    setEditLesson(true)
  }

  const handleCloseDialog = () => {
    setEditLesson(false)
    setLessonToEdit(null)
    setLoading(true)
    setRefreshTrigger(prev => prev + 1)
  }

  const onSubmit = async (data: TCreateLesson) => {
    data.course = new mongoose.Types.ObjectId(selectedCourse)
    data.lecture = new mongoose.Types.ObjectId(selectedChapter)
    setLoading(true)
    await createLesson(data)
    reset() // Reset form sau khi submit thành công
  }

  return (
   <>
   {loadingPage ? (
    <div className="flex justify-center items-center h-screen">
      <PacmanLoader />
    </div>
   ) : (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
        <Button 
          className="bg-primary hover:bg-primary/90" 
          onClick={() => window.location.href = "/expert/manage/courses/create"}
        >
          <Plus className="mr-2 h-4 w-4" /> Thêm khóa học mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khóa học</TableHead>
              <TableHead>Giảng viên</TableHead>
              <TableHead>Giá gốc</TableHead>
              <TableHead>Giá khuyến mãi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course._id} className="hover:bg-gray-50">
                <TableCell className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image 
                      src={course.thumbnail || '/placeholder.png'} 
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{course.title}</span>
                </TableCell>
                <TableCell>{course.author}</TableCell>
                <TableCell>{formatPrice(course.price)}</TableCell>
                <TableCell>{formatPrice(course.sale_price)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(course.status).color}>
                    {getStatusBadge(course.status).text}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <TooltipProvider>
                    <Dialog>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedCourse(course._id)
                              setLoading(true)
                            }}>
                              Quản lý nội dung
                            </Button>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Quản lý chương và bài học</p>
                        </TooltipContent>
                      </Tooltip>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            Nội dung khóa học: {course.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                              <Input
                                placeholder="Tên chương mới"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                className="w-full"
                              />
                            </div>
                            <Button onClick={addChapter} className="shrink-0">
                              <Plus className="mr-2 h-4 w-4" /> Thêm chương
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Tìm kiếm chương..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="max-w-sm"
                            />
                          </div>

                          {loading ? (
                            <div className="flex justify-center items-center h-32">
                              <PacmanLoader />
                            </div>
                          ) : (
                            <ScrollArea className="h-[500px] pr-4">
                              <Accordion type="single" collapsible>
                                {filteredChapters?.map((chapter, chapterIndex) => (
                                  <AccordionItem 
                                    key={chapter._id || chapterIndex} 
                                    value={chapter._id || chapterIndex.toString()}
                                    className="border rounded-lg mb-2 shadow-sm"
                                  >
                                    <AccordionTrigger 
                                      className="flex relative px-4 py-2 hover:bg-gray-50"
                                      onClick={() => {
                                        setSelectedChapter(chapter._id)
                                        setRefreshTrigger(prev => prev + 1)
                                      }}
                                    >
                                      <div className="flex items-center gap-2 flex-1">
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium">{chapter.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8"
                                              >
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Sửa chương</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                className="h-8 w-8"
                                                onClick={() => handleDeleteLecture(chapter._id ?? '')}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Xóa chương</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 bg-gray-50">
                                      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 mb-4">
                                        <div className="flex-1">
                                          <Input
                                            placeholder="Tên bài học"
                                            {...register("title", { required: "Vui lòng nhập tên bài học" })}
                                            className="mb-2"
                                          />
                                          {errors.title && (
                                            <p className="text-red-500 text-sm">{String(errors.title.message)}</p>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <Input
                                            placeholder="Đường dẫn bài học"
                                            {...register("slug", { required: "Vui lòng nhập đường dẫn" })}
                                            className="mb-2"
                                          />
                                          {errors.slug && (
                                            <p className="text-red-500 text-sm">{String(errors.slug.message)}</p>
                                          )}
                                        </div>
                                        <Button 
                                          type="submit" 
                                          className="shrink-0"
                                          onClick={() => setRefreshTrigger(prev => prev + 1)}
                                        >
                                          <Plus className="mr-2 h-4 w-4" /> Thêm bài học
                                        </Button>
                                      </form>

                                      {lessons && lessons.length > 0 ? (
                                        <div className="space-y-2">
                                          {lessons.map((lesson, lessonIndex) => (
                                            <div
                                              key={lesson._id || lessonIndex}
                                              className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                                            >
                                              <div className="flex items-center gap-2">
                                                <GripVertical className="h-5 w-5 text-gray-400" />
                                                <span className="font-medium">{lesson.title}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-7 w-7"
                                                        onClick={() => handleEditLesson(lesson)}
                                                      >
                                                        <Edit className="h-4 w-4" />
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Sửa bài học</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger asChild>
                                                      <Button 
                                                        variant="destructive" 
                                                        size="icon" 
                                                        className="h-7 w-7"
                                                        onClick={() => handleDeleteLesson(lesson._id)}
                                                      >
                                                        <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                      <p>Xóa bài học</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-center py-8 text-gray-500">
                                          Chưa có bài học nào trong chương này
                                        </div>
                                      )}
                                    </AccordionContent>
                                  </AccordionItem>
                                ))}
                              </Accordion>
                            </ScrollArea>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.location.href = `/expert/manage/courses/users/${course._id}`}
                        >
                          <User className="mr-2 h-4 w-4" /> Học viên
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quản lý học viên</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.location.href = `/expert/manage/courses/edit/${course._id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Sửa
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chỉnh sửa thông tin khóa học</p>
                      </TooltipContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/expert/manage/courses/${course._id}/dashboard`}>
                            <BarChart className="mr-2 h-4 w-4" /> Bảng điều khiển
                          </Button>
                        </TooltipTrigger>
                      </Tooltip>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditLessonDialog
        editLesson={editLesson}
        lesson={lessonToEdit}
        onClose={handleCloseDialog}
      />
    </div>
   )}
   </>
  )
}