"use client"
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { getCourses } from '@/lib/actions/course.action'
import { useEffect, useState } from 'react'

import { TCourseInfo } from '@/types'



export default function CoursesPage() {
  const [courses, setCourses] = useState<TCourseInfo[] | undefined>([])
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await getCourses()
      setCourses(response)
    }
    fetchCourses()
  }, [])
 
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses ? courses!.map((course) => (
          <Card key={course._id} className="flex flex-col">
            <Link href={`/courses/${course.slug}`}>
              <CardHeader className="p-1">
                <Image 
                  src={course.thumbnail} 
                  alt={course.title} 
                  width={400} 
                  height={200} 
                  // layout="responsive"
                  className="w-full h-48 object-contain rounded-t-lg"
                />
              </CardHeader>
            </Link > 
              <CardContent className="flex-grow p-4">
                <Link href="#">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                </Link>
                <p className="text-sm text-gray-600 mb-2">Instructor: {course.author.name}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">200</span>
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.students} students</span>
                </div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {course.technology.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            
            <CardFooter className="p-4 bg-gray-50 rounded-b-lg  dark:bg-black">
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-bold">${course.sale_price}</span>
                <Button>Enroll Now</Button>
              </div>
            </CardFooter>
          </Card>
        )): <p>Loading...</p>}
      </div>
    </div>
  )
}

