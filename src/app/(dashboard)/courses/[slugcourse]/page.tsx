"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import {
 
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
  Trophy,
 
  User,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getCourseBySlug } from "@/lib/actions/course.action"
import { useParams } from "next/navigation"
import { TShowCourse } from "@/types"
import { ListLesson } from "@/components/layout/client/ListLesson"



export default function InfoCourse() {
    const slugCourse = useParams()

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [courseInfo, setCourseInfo] = useState<TShowCourse | null| undefined>(null)

  useEffect(() => {
    const fetchData= async ()=>{
        const course = await getCourseBySlug(slugCourse.slugcourse as string)
        setCourseInfo(course)
         
    }
    
    fetchData()
  }, [])
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="bg-black text-white">
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
                onClick={()=>{window.location.href=`/courses/${slugCourse.slugcourse}/lesson/${courseInfo?.lectures[0].lesson[0].slug}`}}>
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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tại sao chọn khóa học này?</h2>
          <p className="text-gray-600">Những gì bạn sẽ nhận được từ khóa học</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Học theo tốc độ của bạn",
              description: "Truy cập không giới hạn và học mọi lúc mọi nơi",
            },
            {
              icon: <Trophy className="w-8 h-8" />,
              title: "Dự án thực tế",
              description: "Xây dựng portfolio với các dự án thực tế",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Hỗ trợ 1-1",
              description: "Được mentor hỗ trợ trực tiếp khi gặp khó khăn",
            },
          ].map((feature, index) => (
            <Card key={index} className="bg-white border border-gray-200 p-6">
              <div className="text-black mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* What You'll Learn Section */}
      <div className="bg-gray-100 py-16">
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
      <div className="max-w-6xl bg-gray-100 mx-auto p-4 my-8">
            <h2 className="text-3xl font-bold mb-8 text-center">Nội dung khóa học</h2>
            <div className="space-y-4"></div>
            <ListLesson courseInfo={courseInfo}/>
      </div>
      


      {/* Course Info Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Thông tin người dạy</h2>
            <div className="space-y-4">
                
                {/* Tên giảng viên */}
                <div className="flex items-center gap-4">
                    <User className="w-6 h-6 text-black" />
                    <span>{courseInfo?.author.name || "Chưa có thông tin"}</span>
                </div>

                {/* Mô tả giảng viên */}
                <div className="flex items-center gap-4">
                    <BookOpen className="w-6 h-6 text-black" />
                    <span>{courseInfo?.author.email || "Không có thông tin"}</span>
                </div>

                
            </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-3xl font-bold mb-4">Miễn phí</div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Truy cập trọn đời</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Cập nhật liên tục</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Hỗ trợ kỹ thuật</span>
                </div>
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800">Liên hệ</Button> 
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

