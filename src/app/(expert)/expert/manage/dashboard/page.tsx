"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getExpertCourses } from "@/lib/actions/course.action"
import { TCourseInfo } from "@/types"
import { useUser } from "@clerk/nextjs"
import { PacmanLoader } from "react-spinners"
import { Users, BookOpen, TrendingUp, Star } from "lucide-react"

export default function Dashboard() {
  const { user } = useUser();
  const [courses, setCourses] = useState<TCourseInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    averageRating: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        const coursesData = await getExpertCourses(user.id);
        setCourses(coursesData || []);

        // Calculate stats
        const totalStudents = coursesData?.reduce((acc, course) => acc + (course.students?.length || 0), 0) || 0;
        const totalCourses = coursesData?.length || 0;
        const totalRevenue = coursesData?.reduce((acc, course) => {
          const courseRevenue = (course.students?.length || 0) * course.price;
          return acc + courseRevenue;
        }, 0) || 0;
        const totalRating = coursesData?.reduce((acc, course) => {
          const courseRating = course.rating?.reduce((sum, r) => sum + r, 0) || 0;
          return acc + courseRating;
        }, 0) || 0;
        const totalRatings = coursesData?.reduce((acc, course) => acc + (course.rating?.length || 0), 0) || 0;
        const averageRating = totalRatings > 0 ? totalRating / totalRatings : 0;

        setStats({
          totalStudents,
          totalCourses,
          totalRevenue,
          averageRating
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Tổng quan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng số học viên */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số học viên
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalStudents)}</div>
            <p className="text-xs text-muted-foreground">
              Trên tất cả các khóa học
            </p>
          </CardContent>
        </Card>

        {/* Tổng số khóa học */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số khóa học
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Đã tạo
            </p>
          </CardContent>
        </Card>

        {/* Tổng doanh thu */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Từ tất cả khóa học
            </p>
          </CardContent>
        </Card>

        {/* Đánh giá trung bình */}
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
              Dựa trên đánh giá của học viên
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top khóa học */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top khóa học theo số học viên</CardTitle>
            <CardDescription>Các khóa học có nhiều học viên nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses
                .sort((a, b) => (b.students?.length || 0) - (a.students?.length || 0))
                .slice(0, 5)
                .map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(course.students?.length || 0)} học viên
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">#{index + 1}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top khóa học theo doanh thu</CardTitle>
            <CardDescription>Các khóa học có doanh thu cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses
                .sort((a, b) => {
                  const revenueA = (a.students?.length || 0) * a.price;
                  const revenueB = (b.students?.length || 0) * b.price;
                  return revenueB - revenueA;
                })
                .slice(0, 5)
                .map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency((course.students?.length || 0) * course.price)}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">#{index + 1}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 