'use client'


import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus } from "lucide-react"

interface Course {
  id: number
  name: string
  instructor: string
  duration: string
}

export default function CourseManagement() {
  const courses: Course[] = [
    {
      id: 1,
      name: "React",
      instructor: "John Doe",
      duration: "2 weeks",
    },
    {
      id: 2,
      name: "Vue",
      instructor: "Jane Doe",
      duration: "3 weeks",
    },
  ]
  const handleEditCourse = (id: number) => {
    console.log(`Edit course with id: ${id}`)
  }
  const handleDeleteCourse = (id: number) => {
    console.log(`Delete course with id: ${id}`)
  }
  const handleAdd = () => {
    window.location.href = "/admin/manage/courses/create"
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      <Button className="mb-4" onClick={handleAdd}>
        <Plus/> Add Course
      </Button>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Name</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.instructor}</TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditCourse(course.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

