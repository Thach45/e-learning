import { Button } from '@/components/ui/button'
import { TShowCourse } from '@/types'
import { BookOpen, CheckCircle2, GraduationCap, User } from 'lucide-react'

type props = {
    courseInfo: TShowCourse | null | undefined
    slugcourse: string
    isEnrolled?: boolean
}

const CourseInfo = ({courseInfo, slugcourse, isEnrolled = false}: props) => {
  const price = courseInfo?.sale_price === 0 ? "Miễn phí" : 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(courseInfo?.sale_price || 0)

  return (
    <div className="space-y-6">
      {/* Price and Enrollment */}
      <div className="space-y-4">
        <div className="text-3xl font-bold">{price}</div>
        <Button 
          size="lg"
          className={`w-full ${isEnrolled ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          onClick={() => !isEnrolled && (window.location.href = `/courses/${slugcourse}/pay`)}
          disabled={isEnrolled}
        >
          {isEnrolled ? 'Bạn đã là thành viên khóa học này rồi' : 'Đăng ký học ngay'}
        </Button>
      </div>

      {/* Course Features */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>Truy cập trọn đời</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>Cập nhật liên tục</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span>Hỗ trợ kỹ thuật</span>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="font-semibold text-lg">Thông tin giảng viên</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <span>{courseInfo?.author.name || "Chưa có thông tin"}</span>
          </div>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Giảng viên chính</span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>{courseInfo?.author.email || "Không có thông tin"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseInfo