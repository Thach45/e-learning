'use client';

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Trophy, Calendar } from "lucide-react";
import { getUserCourseStatistics, getUserOverallStatistics } from "@/lib/actions/progress.action";

interface CourseProgress {
  courseId: string;
  courseName: string;
  totalLessons: number;
  completedLessons: number;
  totalStudyTime: number;
  lastStudyDate: Date;
}

interface OverallStats {
  totalTime: number;
  totalCourses: number;
  completedLessons: number;
  totalLessons: number;
  lastStudyDate: Date;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [courseProgresses, setCourseProgresses] = useState<CourseProgress[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;
      
      try {
        const [courses, stats] = await Promise.all([
          getUserCourseStatistics(user.id),
          getUserOverallStatistics(user.id)
        ]);
        
        setCourseProgresses(courses);
        setOverallStats(stats);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  const formatStudyTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (loading || !overallStats) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Thống kê học tập</h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng thời gian học</p>
              <p className="text-2xl font-bold">{formatStudyTime(overallStats.totalTime)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Khóa học đang học</p>
              <p className="text-2xl font-bold">{overallStats.totalCourses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bài học đã hoàn thành</p>
              <p className="text-2xl font-bold">
                {overallStats.completedLessons}/{overallStats.totalLessons}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ngày học gần nhất</p>
              <p className="text-2xl font-bold">{formatDate(overallStats.lastStudyDate)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chi tiết từng khóa học */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tiến độ khóa học</h2>
        
        {courseProgresses.length === 0 ? (
          <Card className="p-4">
            <p className="text-center text-muted-foreground">
              Bạn chưa bắt đầu học khóa học nào.
            </p>
          </Card>
        ) : (
          courseProgresses.map((course) => (
            <Card key={course.courseId} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{course.courseName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatStudyTime(course.totalStudyTime)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                    <span>{Math.round((course.completedLessons / course.totalLessons) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(course.completedLessons / course.totalLessons) * 100} 
                    className="h-2"
                  />
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Học gần nhất: {formatDate(course.lastStudyDate)}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 