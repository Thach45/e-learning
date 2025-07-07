"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById } from "@/lib/actions/course.action"
import { TEditCourse, TLesson } from "@/types"
import { useParams } from "next/navigation"
import { PacmanLoader } from "react-spinners"
import { Users, Clock, TrendingUp, Star, BookOpen, MessageSquare } from "lucide-react"
import { getLessons } from "@/lib/actions/lesson.action"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { calculateCourseCompletionRate } from "@/lib/actions/progress.action";

export default function CourseDashboard() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<TEditCourse | null>(null)
  const [lessons, setLessons] = useState<TLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    completionRate: 0,
    averageRating: 0,
    totalRevenue: 0,
    averageCompletionTime: 0,
    totalViews: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseById(courseId as string);
        setCourse(courseData);

        if (courseData) {
          // Tính toán các chỉ số
          const totalStudents = courseData.students?.length || 0;
          const totalRevenue = totalStudents * courseData.price;
          const totalRating = courseData.rating?.reduce((sum, r) => sum + r, 0) || 0;
          const totalRatings = courseData.rating?.length || 0;
          const averageRating = totalRatings > 0 ? totalRating / totalRatings : 0;

          // Tính tổng số bài học
          let totalLessons = 0;
          if (courseData.lectures) {
            for (const lectureId of courseData.lectures) {
              const lectureLessons = await getLessons(lectureId.toString(), courseId as string);
              if (lectureLessons) {
                totalLessons += lectureLessons.length;
              }
            }
          }

          // Lấy tỷ lệ hoàn thành thực tế
          const completionRate = await calculateCourseCompletionRate(courseId as string, totalLessons);

          // Giả lập một số chỉ số khác (có thể thêm vào database sau)
          const averageCompletionTime = Math.floor(Math.random() * 30);
          const totalViews = totalStudents * Math.floor(Math.random() * 10);

          setStats({
            totalStudents,
            completionRate,
            averageRating,
            totalRevenue,
            averageCompletionTime,
            totalViews
          });
        }

        // Lấy danh sách bài học
        if (courseData?.lectures) {
          const allLessons: TLesson[] = [];
          for (const lectureId of courseData.lectures) {
            const lectureLessons = await getLessons(lectureId.toString(), courseId as string);
            if (lectureLessons) {
              allLessons.push(...lectureLessons);
            }
          }
          setLessons(allLessons);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  // Format number with dots
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  if (loading || !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Dashboard khóa học</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Giá khóa học</p>
          <p className="text-2xl font-bold">{formatCurrency(course.price)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Số học viên */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Học viên đang học
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalStudents)}</div>
            <Progress value={stats.completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.completionRate}% đã hoàn thành khóa học
            </p>
          </CardContent>
        </Card>

        {/* Thời gian hoàn thành */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Thời gian hoàn thành trung bình
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCompletionTime} ngày</div>
            <p className="text-xs text-muted-foreground">
              Tính từ ngày bắt đầu học
            </p>
          </CardContent>
        </Card>

        {/* Doanh thu */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Từ {formatNumber(stats.totalStudents)} học viên
            </p>
          </CardContent>
        </Card>

        {/* Đánh giá */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Đánh giá trung bình
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</div>
            <p className="text-xs text-muted-foreground">
              Từ {formatNumber(course.rating?.length || 0)} lượt đánh giá
            </p>
          </CardContent>
        </Card>

        {/* Lượt xem */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng lượt xem
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
            <p className="text-xs text-muted-foreground">
              Trung bình {formatNumber(Math.floor(stats.totalViews / stats.totalStudents))} lượt/học viên
            </p>
          </CardContent>
        </Card>

        {/* Bình luận */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tương tác
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Tổng số bình luận và hỏi đáp
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê bài học */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Thống kê bài học</CardTitle>
          <CardDescription>
            Danh sách bài học và số lượt xem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson._id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.type === 'VIDEO' ? '🎥 Video' : '📝 Bài đọc'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {formatNumber(Math.floor(Math.random() * 1000))} lượt xem
                    </div>
                    <Progress value={Math.floor(Math.random() * 100)} className="w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 