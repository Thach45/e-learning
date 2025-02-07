import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Slogan = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
        <h1 className="text-4xl font-bold mb-4">HÃY HỌC THEO CÁCH RIÊNG CỦA BẠN</h1>
        <p className="text-blue-100 mb-6">
            Hãy cùng chúng tôi khám phá tri thức và nâng cao kỹ năng qua những buổi học online linh hoạt, đầy cảm
            hứng. Chọn chúng tôi, bạn chọn một tương lai tươi sáng và thành công.
        </p>
        <Button className="bg-white text-indigo-600 hover:bg-blue-50">Học ngay</Button>
        </div>
        <div className="absolute right-8 bottom-0 w-72">
        <Image
            src="https://res.cloudinary.com/drblblupt/image/upload/v1738673133/vfygaevofgqircj4xfzt.webp"
            alt="Education Illustration"
            width={300}
            height={200}
            className="object-contain"
        />
        </div>
    </div>
  )
}

export default Slogan