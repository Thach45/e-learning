import { Button } from '@/components/ui/button'
import { TShowCourse } from '@/types'
import { BookOpen, CheckCircle2, User } from 'lucide-react'
import React from 'react'
type props = {
    courseInfo: TShowCourse | null | undefined
    slugcourse: string
}
const CourseInfo = ({courseInfo,slugcourse}:props) => {
  return (
    <div className="bg-gray-100 py-16 rounded-lg">
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
              <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={()=> window.location.href = `/courses/${slugcourse}/pay`} >Liên hệ</Button> 
            </div>
          </div>
        </div>
      </div>
  )
}

export default CourseInfo