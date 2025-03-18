"use client"
import Slogan from '@/components/layout/client/Slogan'
import { getCourseBySlug } from '@/lib/actions/course.action'
import {  getUserRole } from '@/lib/actions/user.actions'
import { TShowCourse, TUserInfo } from '@/types'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PacmanLoader } from 'react-spinners'



const Page = () => {
    const data = "Hãy liên hệ với chúng tôi để đăng ký khóa học và được hỗ trợ tốt nhất"
    const slugCourse = useParams()
    const [loading, setLoading] = useState<boolean>(true)
    const [courseInfo, setCourseInfo] = useState<TShowCourse | null| undefined>(null)
    const [user, setUser] = useState<TUserInfo[] | undefined >(undefined)
    useEffect(() => {
        const fetchData= async ()=>{
            const course = await getCourseBySlug(slugCourse.slugcourse as string)
            const user = await getUserRole("ADMIN")
            if(!course) return
            setCourseInfo(course)
            setLoading(false)
            setUser(user)
        }
        
        fetchData()
      }, [])
  return (
    <>
        {loading ? (
            <div className="flex justify-center items-center h-screen">
              <PacmanLoader />
            </div>
        ) : (
        <div className="flex min-h-screen  bg-slate-50 dark:bg-black"> 
                <main className="flex-1 p-8">
                <Slogan text={data} />
                <div className="flex gap-4 justify-between flex-wrap">
                    <div className="w-[100%] lg:w-[48%] h-64 rounded-xl bg-slate-300 dark:bg-blue-500">
                    <h1 className="text-xl flex justify-center items-center font-bold m-6">THÔNG TIN GIẢNG VIÊN</h1>
                    <div className="m-2 p-2">
                            <div className='m-2 py-2 text-xl'>
                                <span className="font-semibold">Tên:</span> 
                                <span className="font-normal">{courseInfo?.author.name}</span>
                        
                            </div>
                            <div className='m-2 py-2 text-xl'>
                                <span className="font-semibold">Email:</span> 
                                <span className="font-normal">{courseInfo?.author.email} </span>
                            </div>
                            
                        </div>
                    </div>
                    {user?.map((item, index) => (
                        <div className="w-[100%] lg:w-[48%] h-64 rounded-xl bg-slate-300  dark:bg-blue-500" key={index}>
                            <h1 className="text-xl flex justify-center items-center font-bold m-6">THÔNG TIN ADMIN</h1>
                            <div className="m-2 p-2">
                                <div className='m-2 py-2 text-xl'>
                                    <span className="font-semibold">Tên:</span> 
                                    <span className="font-normal">{item.name}</span>
                            
                                </div>
                                <div className='m-2 py-2 text-xl'>
                                    <span className="font-semibold">Email:</span> 
                                    <span className="font-normal">{item.email} </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </main>
        </div>

        )}
    </>
  )
}

export default Page