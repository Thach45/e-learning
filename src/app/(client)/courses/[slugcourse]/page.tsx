"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { PacmanLoader } from "react-spinners"
import { getCourseBySlug } from "@/lib/actions/course.action"
import { getUser } from "@/lib/actions/user.actions"
import { TShowCourse, TUserInfo } from "@/types"

// Components
import CourseHero from "@/components/layout/client/CourseHero"
import FeaturesCourse from "@/components/layout/client/FeaturesCourse"
import CourseBenefits from "@/components/layout/client/CourseBenefits"
import CourseCurriculum from "@/components/layout/client/CourseCurriculum"
import CourseInfo from "@/components/layout/client/CourseInfo"

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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <CourseHero
        courseInfo={courseInfo}
        userData={userData}
        isSignedIn={isSignedIn || false}
        slugcourse={slugcourse as string}
        onPlayVideo={() => setIsVideoPlaying(true)}
      />

      <div className="space-y-1">
        <FeaturesCourse />
        <CourseBenefits courseInfo={courseInfo} />
        <CourseCurriculum courseInfo={courseInfo} />
        <CourseInfo courseInfo={courseInfo} slugcourse={slugcourse as string} />
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-blue-950/90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              className="absolute -top-10 right-0 text-blue-100 hover:text-blue-300 transition-colors"
              onClick={() => setIsVideoPlaying(false)}
            >
              Đóng
            </button>
            <div className="aspect-video bg-blue-900 rounded-lg border border-blue-700">
              <div className="flex items-center justify-center h-full text-blue-100">
                Video đang được phát triển
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
