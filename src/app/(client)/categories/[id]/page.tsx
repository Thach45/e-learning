"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PacmanLoader } from 'react-spinners';
import { getCourses } from '@/lib/actions/course.action';
import { getCategories } from '@/lib/actions/categogy.action';
import { TCourseInfo, TShowCategory } from '@/types';
import CourseCard from '@/components/layout/client/CourseCard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<TShowCategory | null>(null);
  const [courses, setCourses] = useState<TCourseInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, coursesData] = await Promise.all([
          getCategories(),
          getCourses()
        ]);

        const currentCategory = categoriesData?.find(cat => cat._id === categoryId) || null;
        setCategory(currentCategory);

        const categoryCourses = coursesData?.filter(course => course.category === categoryId) || [];
        setCourses(categoryCourses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Không tìm thấy danh mục
          </h1>
          <Link href="/categories">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách danh mục
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <Link href="/categories">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách danh mục
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {category.title}
        </h1>
        {category.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {category.description}
          </p>
        )}
        <p className="text-gray-500 dark:text-gray-400">
          {courses.length} khóa học trong danh mục này
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Chưa có khóa học nào trong danh mục này
          </p>
        </div>
      )}
    </div>
  );
} 