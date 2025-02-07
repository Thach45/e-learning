import { Button } from '@/components/ui/button'
import { TCourseInfo } from '@/types'
import Image from 'next/image'
import React from 'react'
type props = {
    course: TCourseInfo[] | undefined
  }
const NewCourse = ({course}:props) => {
  return (
    <>
    {
        course!.map((item:TCourseInfo) => (
            <div key={item._id} className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-black h-[400px] flex flex-col"
            style={{ boxShadow: '0 4px 8px rgba(255, 255, 255, 0.5)' }}
            >
            {/* Thumbnail với kích thước cố định */}
            <div className="relative h-48 w-full flex-shrink-0">
              <Image 
                src={item.thumbnail}
                alt="Course thumbnail"
                layout="fill"
                className="object-cover"
              />
            </div>
      
            {/* Content container với chiều cao cố định */}
            <div className="p-4 flex flex-col justify-between h-[208px]">
              {/* Top section */}
              <div className="space-y-3">
                {/* Title với chiều cao cố định 2 dòng */}
                <h3 className="text-lg font-semibold dark:text-white text-gray-900 line-clamp-2 h-[56px]">
                  {item.title}
                </h3>
      
                {/* Author section với chiều cao cố định */}
                <div className="flex items-center space-x-2 h-8">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm dark:text-black font-medium">{item.author && item.author.charAt(0).toUpperCase()}</span>
                  </div>
                    <div className="text-sm dark:text-white text-gray-500">
                        {item.author}
                    </div>
                </div>
              </div>
      
              {/* Price section với chiều cao cố định */}
              <div className="h-[60px]">
                {item.sale_price ? (
                  <div className="space-y-2">
                    <div className="inline-block bg-red-100 text-red-600 text-sm font-medium px-2 py-0.5 rounded">
                      Giảm {Math.round((1 - item.sale_price/item.price) * 100)}%
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.sale_price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                        </span>
                        </div>
                        <Button className="w-32 dark:text-white bg-blue-500">Xem ngay</Button>
                    </div>
                  </div>
                ) : (
                    <div className="space-y-2">
                    <div className="inline-block bg-red-100 text-red-600 text-sm font-medium px-2 py-0.5 rounded">
                      Giảm 100%
                    </div>
                    <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-blue-600">
                        Miễn phí 
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                           0 đ
                        </span>
                        </div>
                        <Button onClick={()=>window.location.href=`/courses/${item.slug}`} className="w-32 dark:text-white bg-blue-500">Xem ngay</Button>
                    </div>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        ))
    }
        
    </>
  )
}

export default NewCourse