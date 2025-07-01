"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TCourseInfo } from '@/types';

interface CourseCardProps {
  course: TCourseInfo;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card 
      className="flex flex-col"
      style={{ boxShadow: '0 4px 8px rgba(255, 255, 255, 0.5)' }}
    >
      <Link href={`/courses/${course.slug}`}>
        <CardHeader className="p-1">
          <Image 
            src={course.thumbnail} 
            alt={course.title} 
            width={400} 
            height={200} 
            className="w-full h-48 object-contain rounded-t-lg"
          />
        </CardHeader>
      </Link>
      <CardContent className="flex-grow p-4">
        <Link href={`/courses/${course.slug}`}>
          <h2 className="text-xl font-semibold mb-2 dark:text-white">{course.title}</h2>
        </Link>
        <p className="text-sm text-gray-600 mb-2 dark:text-white">Người dạy: {course.author}</p>
        <div className="flex items-center space-x-2 mb-2">
          <Users2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-white">
            {course.students.length} học viên
          </span>
        </div>
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-600 ml-1 dark:text-white">
            {course.rating && course.rating.length > 0
              ? (course.rating.reduce((total, value) => total + value, 0) / course.rating.length).toFixed(1)
              : "Chưa có đánh giá"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {course.technology.map((tag) => (
            <Badge 
              key={tag} 
              className="bg-blue-500 dark:bg-blue-800 text-white" 
              variant="secondary"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 rounded-b-lg dark:bg-black">
        <div className="flex items-center justify-between w-full">
          <span className="text-lg font-bold">${course.sale_price}</span>
          <Button 
            className="bg-blue-500 dark:bg-blue-800 text-white" 
            onClick={() => window.location.href = `/courses/${course.slug}/pay`}
          >
            Đăng kí
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 