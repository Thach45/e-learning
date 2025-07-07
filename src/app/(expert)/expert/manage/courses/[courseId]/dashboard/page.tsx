"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById } from "@/lib/actions/course.action"
import { TEditCourse, TLesson } from "@/types"
import { useParams } from "next/navigation"
import { PacmanLoader } from "react-spinners"
import { Users, TrendingUp, Star, MessageSquare } from "lucide-react"
import { getLessons } from "@/lib/actions/lesson.action"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { calculateCourseCompletionRate, getLessonCompletionStats } from "@/lib/actions/progress.action";

interface LessonStats {
  lessonId: string;
  title: string;
  type: string;
  completionRate: number;
  completedCount: number;
  totalStudents: number;
  avgWatchTime: number;
}

export default function CourseDashboard() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<TEditCourse | null>(null)
  const [lessons, setLessons] = useState<LessonStats[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    completionRate: 0,
    averageRating: 0,
    totalRevenue: 0,
    averageStudyTime: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourseById(courseId as string);
        setCourse(courseData);

        if (courseData) {
          // Lấy danh sách bài học và thống kê
          const allLessons: TLesson[] = [];
          if (courseData.lectures) {
            for (const lectureId of courseData.lectures) {
              const lectureLessons = await getLessons(lectureId.toString(), courseId as string);
              if (lectureLessons) {
                allLessons.push(...lectureLessons);
              }
            }
          }

          // Lấy thống kê học tập cho từng bài học
          const lessonStats: LessonStats[] = await Promise.all(
            allLessons.map(async (lesson) => {
              const stats = await getLessonCompletionStats(courseId as string, lesson._id);
              const totalStudents = courseData.students?.length || 0;

              return {
                lessonId: lesson._id,
                title: lesson.title,
                type: lesson.type,
                completionRate: (stats.completedCount / totalStudents) * 100,
                completedCount: stats.completedCount,
                totalStudents,
                avgWatchTime: stats.avgWatchTime
              };
            })
          );

          setLessons(lessonStats);

          // Tính toán các chỉ số tổng quan
          const totalStudents = courseData.students?.length || 0;
          const totalRevenue = totalStudents * courseData.price;
          const totalRating = courseData.rating?.reduce((sum, r) => sum + r, 0) || 0;
          const totalRatings = courseData.rating?.length || 0;
          const averageRating = totalRatings > 0 ? totalRating / totalRatings : 0;
          const completionRate = await calculateCourseCompletionRate(courseId as string, allLessons.length);

          setStats({
            totalStudents,
            completionRate,
            averageRating,
            totalRevenue,
            averageStudyTime: 0
          });
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

  // Format time (seconds to hours and minutes)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
            Chi tiết về số học viên và thời gian học trung bình của từng bài
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.lessonId} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.type === 'VIDEO' ? '🎥 Video' : '📝 Bài đọc'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-sm text-muted-foreground">
                        {formatNumber(lesson.completedCount)}/{formatNumber(lesson.totalStudents)} học viên
                      </div>
                      {lesson.type === 'VIDEO' && (
                        <div className="text-xs text-muted-foreground">
                          Thời gian xem TB: {formatTime(lesson.avgWatchTime)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      <Progress 
                        value={lesson.completionRate} 
                        className="w-[100px]" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {lesson.completionRate.toFixed(1)}% hoàn thành
                      </p>
                    </div>
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