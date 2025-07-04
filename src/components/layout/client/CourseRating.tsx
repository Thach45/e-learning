"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TShowCourse, TUserInfo } from "@/types"
import { toast } from "@/components/ui/use-toast"
import { rateCourse } from "@/lib/actions/course.action"

interface CourseRatingProps {
  courseInfo: TShowCourse
  userData: TUserInfo | null
  isSignedIn: boolean
}

export default function CourseRating({
  courseInfo,
  userData,
  isSignedIn,
}: CourseRatingProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get user's current rating if exists
  useEffect(() => {
    if (userData && courseInfo.ratings) {
      const userRating = courseInfo.ratings.find(r => r.userId === userData._id)
      if (userRating) {
        setRating(userRating.rating)
      }
    }
  }, [userData, courseInfo.ratings])

  const averageRating = courseInfo.ratings && courseInfo.ratings.length > 0
    ? (courseInfo.ratings.reduce((total: number, r: { rating: number }) => total + r.rating, 0) / courseInfo.ratings.length)
    : 0

  const isEnrolled = userData?.courses?.includes(courseInfo._id)

  const handleRatingSubmit = async () => {
    if (!isSignedIn) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để đánh giá khóa học",
        variant: "destructive",
      })
      return
    }

    if (!isEnrolled) {
      toast({
        title: "Chưa tham gia khóa học",
        description: "Bạn cần tham gia khóa học để có thể đánh giá",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Chưa chọn số sao",
        description: "Vui lòng chọn số sao để đánh giá",
        variant: "destructive",
      })
      return
    }

    if (!userData) {
      return
    }

    try {
      setIsSubmitting(true)
      const result = await rateCourse(courseInfo._id, rating, userData._id)

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Thành công",
        description: result.message,
      })
      
      // Refresh the page to show updated rating
      window.location.reload()
    } catch (error) {
      toast({
        title: "Đánh giá thất bại",
        description: error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại sau",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">Đánh giá khóa học</h3>
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= averageRating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({courseInfo.ratings?.length || 0} đánh giá)
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-lg mb-4">
            {rating > 0 ? "Cập nhật đánh giá của bạn:" : "Đánh giá của bạn:"}
          </p>
          {!isSignedIn ? (
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Vui lòng đăng nhập để đánh giá khóa học
            </p>
          ) : !isEnrolled ? (
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Bạn cần tham gia khóa học để có thể đánh giá
            </p>
          ) : (
            <>
              <div className="flex items-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button
                onClick={handleRatingSubmit}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Đang gửi..." : rating > 0 ? "Cập nhật đánh giá" : "Gửi đánh giá"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 