import React from 'react'

const  HeroSectionCourse = () => {
  return (
    <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-white/10 px-4 py-2 rounded-full">🔥 Khóa học hot nhất 2024</div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{courseInfo?.title}</h1>
              <p className="text-lg opacity-90">
                {courseInfo?.description}
              </p>
              <div className="flex flex-wrap gap-6">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100" 
                onClick={()=>{window.location.href=`/courses/${slugCourse.slugcourse}/lesson/${courseInfo?.lectures[0].lesson[0].slug}`}}>
                  Học ngay
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white  text-black"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Xem giới thiệu
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{courseInfo?.students.length}</div>
                  <div className="text-sm opacity-80">Học viên</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">
                        {courseInfo?.rating && courseInfo.rating.length > 0
                        ? (courseInfo.rating.reduce((total, value) => total + value, 0) / courseInfo.rating.length).toFixed(1)
                        : "Chưa có đánh giá"}
                    </div>
            
                  <div className="text-sm opacity-80">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{
                        (courseInfo?.lectures?.length ?? 0) > 0
                        ? courseInfo?.lectures.reduce((total, value) => total + value.lesson.length, 0)
                        : "Chưa có bài học"
                    }</div>
                  <div className="text-sm opacity-80">Bài học</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image 
                src={courseInfo?.thumbnail ?? ""}
                alt="Course Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100">
                    <PlayCircle className="w-12 h-12 text-black" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
  )
}

export default  HeroSectionCourse