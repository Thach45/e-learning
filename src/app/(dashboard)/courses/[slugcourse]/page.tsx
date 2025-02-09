"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { getCourseBySlug } from "@/lib/actions/course.action"
import { useParams } from "next/navigation"
import { TShowCourse } from "@/types"
import { ListLesson } from "@/components/layout/client/ListLesson"
import FeaturesCourse from "@/components/layout/client/FeaturesCourse"
import CourseInfo from "@/components/layout/client/CourseInfo"
import { PacmanLoader } from "react-spinners"
import { useAuth } from "@clerk/nextjs"



export default function InfoCourse() {
  const {isSignedIn} = useAuth()
    const slugCourse = useParams()
  const [loading, setLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [courseInfo, setCourseInfo] = useState<TShowCourse | null| undefined>(null)

  useEffect(() => {
    const fetchData= async ()=>{
        const course = await getCourseBySlug(slugCourse.slugcourse as string)
        if(!course) return
        setCourseInfo(course)
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
    ):(
      <div className="min-h-screen bg-white text-black rounded-lg">
      {/* Hero Section */}
      <div className="bg-black text-white rounded-lg">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-white/10 px-4 py-2 rounded-full">🔥 Khóa học hot nhất 2024</div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{courseInfo?.title}</h1>
              <p className="text-lg opacity-90">
                {courseInfo?.description}
              </p>
              <div className="flex flex-wrap gap-6">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100" 
                onClick={()=>{
                  if(!isSignedIn){
                    window.location.href="/sign-in"
                    return
                  }
                  if(courseInfo?.sale_price === 0)
                    {
                      window.location.href=`/courses/${slugCourse.slugcourse}/lesson/${courseInfo?.lectures[0].lessons[0].slug}`
                      return
                    }
                  
                  }}>
                  Học ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white  text-black"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Xem giới thiệu
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{courseInfo?.students.length}</div>
                  <div className="text-sm opacity-80">Học viên</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">
                        {courseInfo?.rating && courseInfo.rating.length > 0
                        ? (courseInfo.rating.reduce((total, value) => total + value, 0) / courseInfo.rating.length).toFixed(1)
                        : "Chưa có đánh giá"}
                    </div>
            
                  <div className="text-sm opacity-80">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{
                        (courseInfo?.lectures?.length ?? 0) > 0
                        ? courseInfo?.lectures.reduce((total, value) => total + value.lesson.length, 0)
                        : "Chưa có bài học"
                    }</div>
                  <div className="text-sm opacity-80">Bài học</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src={courseInfo?.thumbnail ?? ""}
                alt="Course Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                    <PlayCircle className="w-12 h-12 text-black" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>



      {/* Features Section */}
      <FeaturesCourse />
      {/* What You'll Learn Section */}
      <div className="bg-gray-100 py-16 rounded-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Bạn sẽ học được gì?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courseInfo?.info.benefits.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-black mt-1" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Curriculum Section */}
      <div className="rounded-lg max-w-6xl bg-gray-100 my-16 p-4">
            <h2 className="text-3xl font-bold mb-8 pt-4 text-center">Nội dung khóa học</h2>
            <div className="space-y-4"></div>
            <ListLesson courseInfo={courseInfo}/>
      </div>
      {/* Course Info Section */}
      <CourseInfo  courseInfo={courseInfo}/>
      
    </div>
    )}
    </>
   
  )
}

