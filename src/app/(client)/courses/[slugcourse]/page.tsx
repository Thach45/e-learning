"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { PacmanLoader } from "react-spinners"
import { getCourseBySlug } from "@/lib/actions/course.action"
import { getUser } from "@/lib/actions/user.actions"
import { TShowCourse, TUserInfo } from "@/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Components
import CourseHero from "@/components/layout/client/CourseHero"
import FeaturesCourse from "@/components/layout/client/FeaturesCourse"
import CourseBenefits from "@/components/layout/client/CourseBenefits"
import CourseCurriculum from "@/components/layout/client/CourseCurriculum"
import CourseInfo from "@/components/layout/client/CourseInfo"
import CourseRating from "@/components/layout/client/CourseRating"

export default function InfoCourse() {
  const { isSignedIn, user } = useUser()
  const { slugcourse } = useParams()
  const userId = user?.id

  const [loading, setLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [courseInfo, setCourseInfo] = useState<TShowCourse | null>(null)
  const [userData, setUserData] = useState<TUserInfo | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [course, userInfo] = await Promise.all([
          getCourseBySlug(slugcourse as string),
          userId ? getUser(userId) : null
          
        ])

        setCourseInfo(course || null)
        if (userInfo) {
          setUserData(userInfo)
        }
        console.log("courseInfo", course)
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slugcourse, userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-blue-950">
        <PacmanLoader color="#2563eb" />
      </div>
    )
  }

  if (!courseInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-blue-950">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
          Không tìm thấy khóa học
        </h1>
        <p className="text-blue-700 dark:text-blue-300">
          Khóa học này không tồn tại hoặc đã bị xóa
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <CourseHero
        courseInfo={courseInfo}
        userData={userData}
        isSignedIn={isSignedIn || false}
        slugcourse={slugcourse as string}
        onPlayVideo={() => setIsVideoPlaying(true)}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-white dark:bg-gray-800 p-1 rounded-lg">
                <TabsTrigger value="overview" className="flex-1">
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="flex-1">
                  Nội dung
                </TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Đánh giá
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {courseInfo.description}
                  </p>
                </div>
                
                <FeaturesCourse />
                <CourseBenefits courseInfo={courseInfo} />
              </TabsContent>

              <TabsContent value="curriculum">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <CourseCurriculum courseInfo={courseInfo} />
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <CourseRating
                    courseInfo={courseInfo}
                    userData={userData}
                    isSignedIn={isSignedIn || false}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <CourseInfo 
                    courseInfo={courseInfo} 
                    slugcourse={slugcourse as string} 
                    isEnrolled={userData?.courses?.includes(courseInfo._id)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-5xl mx-4">
            <button
              className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors text-lg font-semibold"
              onClick={() => setIsVideoPlaying(false)}
            >
              Đóng
            </button>
            <div className="aspect-video bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl">
              <div className="flex items-center justify-center h-full text-gray-400">
                Video đang được phát triển
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
