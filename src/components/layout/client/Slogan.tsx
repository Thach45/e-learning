import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
type SloganProps = {
  text: string
}
const Slogan = ({text}: SloganProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
      <div className="max-w-2xl relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          HÃY HỌC THEO CÁCH RIÊNG CỦA BẠN
        </h1>
        <p className="text-blue-100 mb-6 opacity-0 lg:opacity-100">
         {text}
        </p>
        <Button className="bg-white text-indigo-600 hover:bg-blue-50" onClick={() => window.location.href="/courses"}>
          Học ngay
        </Button>
      </div>
      <div className="absolute right-4 bottom-0 w-48 sm:w-56 md:w-72">
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