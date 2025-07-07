'use client';

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Trophy, Calendar, AlertCircle } from "lucide-react";
import { getUserCourseStatistics, getUserOverallStatistics } from "@/lib/actions/progress.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

const StatCard = ({ icon: Icon, label, value, bgColor, textColor }: {
  icon: any;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}) => (
  <Card className="p-4">
    <div className="flex items-center gap-4">
      <div className={`p-3 ${bgColor} rounded-lg`}>
        <Icon className={`w-6 h-6 ${textColor}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseProgresses, setCourseProgresses] = useState<CourseProgress[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "time">("progress");

  const formatStudyTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, []);

  const formatDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;
      
      try {
        setError(null);
        const [courses, stats] = await Promise.all([
          getUserCourseStatistics(user.id),
          getUserOverallStatistics(user.id)
        ]);
        
        setCourseProgresses(courses);
        setOverallStats(stats);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courseProgresses];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort courses
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.courseName.localeCompare(b.courseName);
        case "progress":
          return (b.completedLessons / b.totalLessons) - (a.completedLessons / a.totalLessons);
        case "time":
          return b.totalStudyTime - a.totalStudyTime;
        default:
          return 0;
      }
    });

    return result;
  }, [courseProgresses, searchTerm, sortBy]);

  if (loading || !overallStats) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Thống kê học tập</h1>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Clock}
          label="Tổng thời gian học"
          value={formatStudyTime(overallStats.totalTime)}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          icon={BookOpen}
          label="Khóa học đang học"
          value={overallStats.totalCourses}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          icon={Trophy}
          label="Bài học đã hoàn thành"
          value={`${overallStats.completedLessons}/${overallStats.totalLessons}`}
          bgColor="bg-yellow-100"
          textColor="text-yellow-600"
        />
        <StatCard
          icon={Calendar}
          label="Ngày học gần nhất"
          value={formatDate(overallStats.lastStudyDate)}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
      </div>

      {/* Chi tiết từng khóa học */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tiến độ khóa học</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Tìm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={sortBy} onValueChange={(value: "name" | "progress" | "time") => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên khóa học</SelectItem>
                <SelectItem value="progress">Tiến độ</SelectItem>
                <SelectItem value="time">Thời gian học</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredAndSortedCourses.length === 0 ? (
          <Card className="p-4">
            <p className="text-center text-muted-foreground">
              {searchTerm ? "Không tìm thấy khóa học phù hợp." : "Bạn chưa bắt đầu học khóa học nào."}
            </p>
          </Card>
        ) : (
          filteredAndSortedCourses.map((course) => (
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