"use client"
import Image from "next/image"
import { ArrowRight, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TShowCourse, TUserInfo } from "@/types"

interface CourseHeroProps {
  courseInfo: TShowCourse | null;
  userData: TUserInfo | null;
  isSignedIn: boolean;
  slugcourse: string;
  onPlayVideo: () => void;
}

export default function CourseHero({
  courseInfo,
  userData,
  isSignedIn,
  slugcourse,
  onPlayVideo
}: CourseHeroProps) {
  const handleStartLearning = () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in"
      return
    }
    if (courseInfo?.sale_price === 0 || userData?.courses.includes(courseInfo!._id)) {
      window.location.href = `/courses/${slugcourse}/lesson/${courseInfo?.lectures[0].lessons[0].slug}`
    } else {
      window.location.href = `/courses/${slugcourse}/pay`
    }
  }

  const averageRating = courseInfo?.ratings && courseInfo.ratings.length > 0
    ? (courseInfo.ratings.reduce((total: number, r: { rating: number }) => total + r.rating, 0) / courseInfo.ratings.length).toFixed(1)
    : "Chưa có đánh giá"

  return (
    <div className="bg-gradient-to-br from-blue-900 to-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-blue-500/20 px-4 py-2 rounded-full">
              🔥 Khóa học hot nhất {new Date().getFullYear()}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {courseInfo?.title}
            </h1>
            <p className="text-lg opacity-90">{courseInfo?.description}</p>
            <div className="flex flex-wrap gap-6">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleStartLearning}
              >
                Học ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
            </div>
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {courseInfo?.students.length}
                </div>
                <div className="text-sm opacity-80">Học viên</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {averageRating}
                </div>
                <div className="text-sm opacity-80">Đánh giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(courseInfo?.lectures?.length ?? 0) > 0
                    ? courseInfo?.lectures.reduce((total, value) => total + value.lesson.length, 0)
                    : "Chưa có bài học"}
                </div>
                <div className="text-sm opacity-80">Bài học</div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Image
              src={courseInfo?.thumbnail ?? ""}
              alt="Course Preview"
              width={600}
              height={400}
              className="rounded-lg shadow-xl transform transition-transform group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 