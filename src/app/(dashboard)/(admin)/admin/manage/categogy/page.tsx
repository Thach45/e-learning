"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Edit, Trash2 } from "lucide-react"
import { TCourseInfo,TShowCategory, TShowCourse } from "@/types"
import { PacmanLoader } from "react-spinners"
import { addCourseToCategory, courseNotInCategory, deleteCourseInCategory, getCategories } from "@/lib/actions/categogy.action"
import { SearchableDropdown } from "@/components/layout/client/ListCategory"


export default function CourseManagement() {
  const [category, setCategory] = useState<TShowCategory[] | undefined | null>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [course, setCourse] = useState<TCourseInfo[] | null | undefined>([])
  const [loading, setLoading] = useState(true)
  const [loadingPage, setLoadingPage] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)


  useEffect(() => {
    const fetchData = async () => {
      const res = await getCategories()
      const resCourse = await courseNotInCategory()
      setCourse(resCourse)
      setLoading(false)
      setLoadingPage(false)
      setCategory(res)
    }
    fetchData()
  }, [refreshTrigger,selectedCourse])

  
  

  const handleDeleteCourse = async (idCourse: string, idCategory: string) => {
    setLoading(true)
    console.log(idCourse, idCategory)
    
    const res = await deleteCourseInCategory(idCategory, idCourse)
    if (res) {
      setRefreshTrigger(prev => prev + 1)
      console.log("Deleted")
    }
   
  }
  const addCourse= async (idCategory: string) => {
    setLoading(true)
    const res = await addCourseToCategory(idCategory, selectedCourse)
    if (res) {
      
      setRefreshTrigger(prev => prev + 1)
    }
    console.log(res)

  }
  
  return (
   <>
   {loadingPage ? (
    <div className="flex justify-center items-center h-screen">
      <PacmanLoader />
    </div>
   ) : (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Course Management</h1>
    <Button className="mb-4" onClick={() => window.location.href = "/admin/manage/categogy/create"}>
      <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
    </Button>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Số lượng</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {category?.map((item: TShowCategory) => (
          <TableRow key={item._id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.courses.length}</TableCell>
            <TableCell className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => {
                     setSelectedCourse(item._id)
                     setLoading(true)
                     }}>
                    Manage
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Manage Course: {item.title}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className="flex space-x-2 mb-4">
                        <SearchableDropdown
                          items={course || []}
                          placeholder="Select a course..."
                          emptyMessage="No course found."
                          onChange={(value) => setSelectedCourse(value)}
                        />
                        <Button variant="outline" onClick={() => addCourse(item._id)}>
                          <Plus className="mr-2 h-4 w-4" /> Thêm bài học
                        </Button>
                    </div>
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <PacmanLoader />
                      </div>
                    ) : (

                    <Accordion type="single" collapsible className="max-h-[300px] overflow-y-auto">
                      {item.courses?.map((course:TShowCourse) => (
                        <AccordionItem key={course._id } value={course._id }>
                          <AccordionTrigger className="flex relative" onClick={() => {   
                            setRefreshTrigger(prev => prev + 1)
                          }}>
                            <span className="">{course.title}</span>
                            <div className="absolute right-0 flex items-center space-x-2">
                              <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteCourse(course._id, item._id )}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </AccordionTrigger>      
                        </AccordionItem>
                      ))}
                    </Accordion>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => window.location.href = `/admin/manage/courses/${item._id}`}>
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
    
  </div>
   )}
   </>
  )
}