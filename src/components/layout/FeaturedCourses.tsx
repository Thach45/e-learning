import { Star } from 'lucide-react'
import Image from 'next/image'

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

export default function FeaturedCourses() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Featured courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={course.image} alt={course.title} className="w-full h-40 object-cover" width={400} height={200} />
              <div className="p-4">
                <h3 className="font-bold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 font-bold mr-1">{course.rating}</span>
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span className="text-sm text-gray-600 ml-1">({course.students.toLocaleString()})</span>
                </div>
                <p className="font-bold">${course.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

