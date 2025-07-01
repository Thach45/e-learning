"use client"
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCategories } from '@/lib/actions/categogy.action';
import { getCourses } from '@/lib/actions/course.action';
import { TShowCategory, TCourseInfo } from '@/types';
import CategoryCard from '@/components/layout/client/CategoryCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Slogan from '@/components/layout/client/Slogan';


export default function CategoriesPage() {
  const [categories, setCategories] = useState<TShowCategory[]>([]);
  const [courses, setCourses] = useState<TCourseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, coursesData] = await Promise.all([
          getCategories(),
          getCourses()
        ]);

        setCategories(categoriesData || []);
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count courses for each category
  const getCourseCount = (categoryId: string) => {
    return courses.filter(course => course.category === categoryId).length;
  };
  const slogan = "Khám phá các danh mục khóa học đa dạng của chúng tôi. Để tìm kiếm khóa học phù hợp với bạn"
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <Slogan text={slogan}/>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <PacmanLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              courseCount={getCourseCount(category._id)}
            />
          ))}
        </div>
      )}

      {!loading && filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Không tìm thấy danh mục nào phù hợp
          </p>
        </div>
      )}
    </div>
  );
} 