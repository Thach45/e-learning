import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Clock, Users, Star } from 'lucide-react'
import Link from 'next/link'

const courses:{
  id: number,
  title: string,
  instructor: string,
  price: number,
  duration: string,
  students: number,
  rating: number,
  image: string,
  tags: string[]
}[] = [
  { 
    id: 1, 
    title: 'Introduction to Web Development', 
    instructor: 'John Doe', 
    price: 49.99,
    duration: '6 weeks',
    students: 1234,
    rating: 4.7,
    image: "https://cdn.freebiesupply.com/logos/large/2x/html-5-logo-png-transparent.png",
    tags: ['HTML', 'CSS', 'JavaScript']
  },
  { 
    id: 2, 
    title: 'Advanced JavaScript Concepts', 
    instructor: 'Jane Smith', 
    price: 79.99,
    duration: '8 weeks',
    students: 987,
    rating: 4.9,
    image: "https://cdn.freebiesupply.com/logos/large/2x/html-5-logo-png-transparent.png",
    tags: ['JavaScript', 'ES6+', 'Async']
  },
  { 
    id: 3, 
    title: 'React for Beginners', 
    instructor: 'Bob Johnson', 
    price: 59.99,
    duration: '4 weeks',
    students: 2345,
    rating: 4.8,
    image: "https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png",
    tags: ['React', 'JSX', 'Hooks']
  },
  {
    id: 4,
    title: 'React Native for Mobile Development',
    instructor: 'Alice Williams',
    price: 69.99,
    duration: '6 weeks',
    students: 3456,
    rating: 4.6,
    image: "https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png",
    tags: ['React Native', 'Mobile', 'Expo']
  },
  {
    id: 5,
    title: 'Node.js and Express for Backend Development',
    instructor: 'Sam Brown',
    price: 89.99,
    duration: '8 weeks',
    students: 4567,
    rating: 4.5,
    image: "https://cdn.freebiesupply.com/logos/large/2x/nodejs-1-logo-png-transparent.png",
    tags: ['Node.js', 'Express', 'REST API']
  }
]

export default function CoursesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <Link href="#">
              <CardHeader className="p-1">
                <Image 
                  src={course.image} 
                  alt={course.title} 
                  width={400} 
                  height={200} 
                  // layout="responsive"
                  className="w-full h-48 object-contain rounded-t-lg"
                />
              </CardHeader>
            </Link> 
              <CardContent className="flex-grow p-4">
                <Link href="#">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                </Link>
                <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.duration}</span>
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{course.students} students</span>
                </div>
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            
            <CardFooter className="p-4 bg-gray-50 rounded-b-lg  dark:bg-black">
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-bold">${course.price}</span>
                <Button>Enroll Now</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

