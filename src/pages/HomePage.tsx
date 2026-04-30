import { Code, Briefcase, PenTool, Megaphone, Cpu, Smile, BookOpen } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import PurchaseFlowSection from '../components/home/PurchaseFlowSection';
import TrustedCompaniesSection from '../components/home/TrustedCompaniesSection';
import CategoriesSection, { type Category } from '../components/home/CategoriesSection';
import FeaturedCoursesSection, { type Course } from '../components/home/FeaturedCoursesSection';
import NewsletterSection from '../components/home/NewsletterSection';
import { useCategories } from '../hooks/useCategories';
import { useCourses } from '../hooks/useCourses';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '../api/courses';

const formatVND = (amount: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// Map category icons and colors
const getCategoryIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('lập trình') || lowerName.includes('programming') || lowerName.includes('code')) {
    return <Code size={24} />;
  }
  if (lowerName.includes('kinh doanh') || lowerName.includes('business')) {
    return <Briefcase size={24} />;
  }
  if (lowerName.includes('thiết kế') || lowerName.includes('design')) {
    return <PenTool size={24} />;
  }
  if (lowerName.includes('marketing')) {
    return <Megaphone size={24} />;
  }
  if (lowerName.includes('công nghệ') || lowerName.includes('technology') || lowerName.includes('tech')) {
    return <Cpu size={24} />;
  }
  if (lowerName.includes('kỹ năng') || lowerName.includes('skill')) {
    return <Smile size={24} />;
  }
  return <BookOpen size={24} />;
};

const getCategoryColor = (index: number) => {
  const colors = [
    'bg-blue-50 text-blue-600',
    'bg-emerald-50 text-emerald-600',
    'bg-purple-50 text-purple-600',
    'bg-orange-50 text-orange-600',
    'bg-indigo-50 text-indigo-600',
    'bg-pink-50 text-pink-600',
    'bg-cyan-50 text-cyan-600',
    'bg-amber-50 text-amber-600',
  ];
  return colors[index % colors.length];
};

const HomePage = () => {
  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Fetch featured courses
  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useCourses({
    page: 1,
    limit: 8,
    isFeatured: true,
    status: 'PUBLISHED',
  });

  // Fetch course counts for each category
  const { data: allCoursesData } = useQuery({
    queryKey: ['courses', 'all-for-count'],
    queryFn: () => coursesApi.getCourses({ page: 1, limit: 1000, status: 'PUBLISHED' }),
    
    enabled: !!categoriesData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform categories data
  const categories: Category[] = useMemo(() => {
    if (!categoriesData) return [];
    
    // Count courses per category
    const courseCountMap = new Map<string, number>();
   
    if (allCoursesData?.data) {
      allCoursesData.data.forEach(course => {
        if (course.categoryId) {
          courseCountMap.set(course.categoryId, (courseCountMap.get(course.categoryId) || 0) + 1);
        }
      });
    }
    
    return categoriesData
      .filter(cat => cat.isActive && !cat.parentId) // Only show top-level active categories
      .slice(0, 6) // Limit to 6 categories
      .map((cat, index) => ({
        id: cat.id,
        name: cat.name,
        count: courseCountMap.get(cat.id) || 0,
        icon: getCategoryIcon(cat.name),
        color: getCategoryColor(index),
      }));
  }, [categoriesData, allCoursesData]);

  // Transform courses data
  const courses: Course[] = useMemo(() => {
    if (!coursesData?.data) return [];
    
    return coursesData.data.map((course) => {
      // Calculate rating from totalStars and reviewsCount
      const reviewsCount = course.reviewsCount || 0;
      const rating = reviewsCount > 0 && course.totalStars 
        ? Math.round((course.totalStars / reviewsCount) * 10) / 10 
        : 0;

      // Determine tag based on course properties
      let tag = 'Mới';
      if (course.isFeatured) tag = 'Nổi bật';
      if (course.totalLearners && course.totalLearners > 100) tag = 'Bán chạy';
      if (course.price === 0) tag = 'Miễn phí';

      // Format duration from seconds to "Xh Ym" format
      const formatDuration = (seconds: number): string => {
        if (!seconds || seconds === 0) return '0h 0m';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      };

      return {
        id: course.id,
        title: course.title,
        instructor: course.instructor?.name || 'Unknown',
        rating: rating || 0,
        reviews: course.reviewsCount || 0,
        price: course.salePrice || course.price,
        oldPrice: course.salePrice ? course.price : 0,
        thumbnail: course.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image',
        tag,
        lessons: course.totalLessons || 0,
        duration: formatDuration(course.totalDuration || 0),
      };
    });
  }, [coursesData]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        <HeroSection />
        {/* <PurchaseFlowSection /> */}
        {/* <TrustedCompaniesSection /> */}
        
        {/* Categories Section */}
        {categoriesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-500">Đang tải danh mục...</p>
          </div>
        ) : categoriesError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Không thể tải danh mục. Vui lòng thử lại sau.</p>
          </div>
        ) : categories.length > 0 ? (
          <CategoriesSection categories={categories} />
        ) : null}

        {/* Featured Courses Section */}
        {coursesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-500">Đang tải khóa học...</p>
          </div>
        ) : coursesError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Không thể tải khóa học. Vui lòng thử lại sau.</p>
          </div>
        ) : courses.length > 0 ? (
          <FeaturedCoursesSection courses={courses} formatPrice={formatVND} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Chưa có khóa học nổi bật nào.</p>
          </div>
        )}

        <NewsletterSection />
      </main>
    </div>
  );
};

export default HomePage;