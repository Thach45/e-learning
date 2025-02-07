"use client"
import { Button } from "@/components/ui/button"
import NewCourse from "@/components/layout/client/NewCourse"
import { getCourses } from "@/lib/actions/course.action"
import { TCourseInfo } from "@/types"
import { useEffect, useState } from "react"
import { PacmanLoader } from "react-spinners"
import Slogan from "@/components/layout/client/Slogan"



export default function Page() {
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<TCourseInfo[] | undefined>([])

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const res = await getCourses()
      const course =  res?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3)
      if(!res) return
      setData(course)
      setLoading(false)
    }
    fetchData()
  }, [])



  return (
    <>
       
      {loading ? (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader />
      </div>
      ) : (
      <div className="flex min-h-screen bg-slate-50 dark:bg-black">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Hero Section */}
          <Slogan />
    
          {/* Latest Courses */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">KHOÁ HỌC MỚI NHẤT</h2>
              <Button variant="ghost" className="text-indigo-600 dark:text-white">
                Xem thêm →
              </Button>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course Card */}
              <NewCourse course={data}/>   
            </div>
          </div>
        </main>
      </div>
        
      )}
    </>
 
  )
}


