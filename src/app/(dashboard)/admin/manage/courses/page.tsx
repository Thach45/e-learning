"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Edit, Trash2 } from "lucide-react"
import { getCourses } from "@/lib/actions/course.action"
import { TCourseInfo, TCreateLecture, TCreateLesson, TLesson, TEditLesson } from "@/types"
import { createLecture, deleteLecture, getLectures } from "@/lib/actions/lecture.model"
import mongoose from "mongoose"
import { useForm } from "react-hook-form"
import { createLesson, deleteLesson, getLessons } from "@/lib/actions/lesson.action"
import EditLessonDialog from "@/components/layout/admin/EditLesson"

export default function CourseManagement() {
  const [courses, setCourses] = useState<TCourseInfo[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<string | undefined>("")
  const [lessons, setLessons] = useState<TLesson[] | undefined>([])
  const [editLesson, setEditLesson] = useState<boolean>(false)
  const [lessonToEdit, setLessonToEdit] = useState<TEditLesson | null>(null)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [chapters, setChapters] = useState<TCreateLecture[] | undefined>([])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TCreateLesson>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const course = await getCourses()
      const chapter = await getChapter(selectedCourse)
      const lesson = await getLessons(selectedChapter!, selectedCourse)

      setLessons(lesson || [])
      setChapters(chapter || [])
      setCourses(course || [])
    }
    fetchData()
  }, [refreshTrigger, selectedCourse])

  const addChapter = async () => {
    try {
      const data: TCreateLecture = {
        title: newChapterTitle,
        course: new mongoose.Types.ObjectId(selectedCourse),
        deleted: false
      }

      await createLecture(data)
      setRefreshTrigger(prev => prev + 1) // Trigger re-fetch
      setNewChapterTitle("") // Optional: Clear input
    }
    catch (error) {
      console.log("lỗi nè", error)
    }
  }

  const getChapter = async (selectedCourse: string) => {
    try {
      console.log("selectedCourse", selectedCourse)
      const chapter = await getLectures(selectedCourse)
      return chapter
    }
    catch (error) {
      console.log("lỗi nè", error)
    }
  }

  const handleDeleteLecture = async (id: string) => {
    await deleteLecture(id)
    setRefreshTrigger(prev => prev + 1) // Trigger re-fetch
  }

  const handleDeleteLesson = async (id: string) => {
    await deleteLesson(id)
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
    setRefreshTrigger(prev => prev + 1)
  }

  const onSubmit = async (data: TCreateLesson) => {
    data.course = new mongoose.Types.ObjectId(selectedCourse)
    data.lecture = new mongoose.Types.ObjectId(selectedChapter)
    await createLesson(data)
    reset() // Reset form sau khi submit thành công
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      <Button className="mb-4" onClick={() => window.location.href = "/admin/manage/courses/create"}>
        <Plus className="mr-2 h-4 w-4" /> Add Course
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Sale Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.author}</TableCell>
              <TableCell>${course.price}</TableCell>
              <TableCell>${course.sale_price}</TableCell>
              <TableCell>{course.status}</TableCell>
              <TableCell className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course._id)}>
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Manage Course: {course.title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="flex space-x-2 mb-4">
                        <Input
                          placeholder="New Chapter Title"
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                        />
                        <Button onClick={addChapter}>Add Chapter</Button>
                      </div>
                      <Accordion type="single" collapsible className="max-h-[300px] overflow-y-auto">
                        {chapters?.map((chapter, chapterIndex) => (
                          <AccordionItem key={chapter._id || chapterIndex} value={chapter._id || chapterIndex.toString()}>
                            <AccordionTrigger className="flex relative" onClick={() => {
                              setSelectedChapter(chapter._id)
                              setRefreshTrigger(prev => prev + 1)
                            }}>
                              <span className="">{chapter.title}</span>
                              <div className="absolute right-0 flex items-center space-x-2">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteLecture(chapter._id ?? '')}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2 mb-4">
                                <Input
                                  placeholder="New Lesson Title"
                                  {...register("title", { required: "Lesson Title is required" })}
                                  className="flex-grow"
                                />
                                {errors.title && (
                                  <p className="text-red-500 text-sm">{String(errors.title.message)}</p>
                                )}
                                <Input
                                  placeholder="New Lesson Slug"
                                  {...register("slug", { required: "Lesson Slug is required" })}
                                  className="flex-grow"
                                />
                                {errors.slug && (
                                  <p className="text-red-500 text-sm">{String(errors.slug.message)}</p>
                                )}
                                <Button type="submit" className="shrink-0" onClick={() => { setRefreshTrigger(prev => prev + 1) }}>
                                  <Plus className="mr-2 h-4 w-4" /> Add Lesson
                                </Button>
                              </form>
                              {lessons && lessons.length > 0 ? (
                                <ul className="space-y-2">
                                  {lessons.map((lesson, lessonIndex) => (
                                    <li
                                      key={lesson._id || lessonIndex}
                                      className="flex justify-between items-center p-2 bg-gray-100 rounded"
                                    >
                                      <span>{lesson.title}</span>
                                      <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditLesson(lesson)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteLesson(lesson._id)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 text-center">No lessons in this chapter</p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => window.location.href = `/admin/manage/courses/${course._id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditLessonDialog
        editLesson={editLesson}
        lesson={lessonToEdit}
        onClose={handleCloseDialog}
      />
    </div>
  )
}