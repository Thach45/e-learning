"use client"
import React, { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCourseCondition } from '@/lib/actions/course.action';
import { TCourseInfo, TShowCategory } from '@/types';
import { getCategories } from '@/lib/actions/categogy.action';
import Slogan from '@/components/layout/client/Slogan';
import SearchBar from '@/components/layout/client/SearchBar';
import CategoryDrawer from '@/components/layout/client/CategoryDrawer';
import CourseCard from '@/components/layout/client/CourseCard';
import Pagination from '@/components/layout/client/Pagination';

export default function CoursesPage() {
  const slogan = "Hãy cùng chúng tôi khám phá tri thức và nâng cao kỹ năng qua những buổi học online linh hoạt, đầy cảm hứng. Chọn chúng tôi, bạn chọn một tương lai tươi sáng và thành công.";
  const [courses, setCourses] = useState<TCourseInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<TShowCategory[]>([]);
  const [idCategory, setIdCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = () => {
    setLoading(true);
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleSortOrderChange = () => {
    setLoading(true);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId: string) => {
    setLoading(true);
    setIdCategory(categoryId);
    setCurrentPage(1);
  };

  const handleClearCategory = () => {
    setLoading(true);
    setIdCategory("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getCourseCondition(searchQuery, sortOrder, currentPage, itemsPerPage);
      
      if (result) {
        let filteredCourses = result.courses;
        
        if (idCategory) {
          filteredCourses = filteredCourses.filter((course) => course.category === idCategory);
        }

        setCourses(filteredCourses);
        setTotalPages(result.totalPages);
      }
      
      const categoriesData = await getCategories();
      setCategories(categoriesData || []);
      setLoading(false);
    };
    fetchCourses();
  }, [idCategory, searchQuery, sortOrder, currentPage, itemsPerPage]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader />
        </div>
      ) : (
        <div className="container mx-auto p-8">
          <Slogan text={slogan}/>
          
          <div className="bg-white shadow-md dark:bg-blue-500 rounded-lg p-6 my-8 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <SearchBar
                searchTerm={searchTerm}
                sortOrder={sortOrder}
                onSearch={handleSearch}
                onSearchSubmit={handleSearchSubmit}
                onSortChange={handleSortOrderChange}
              />
            </div>
            
            <CategoryDrawer
              categories={categories}
              idCategory={idCategory}
              onCategorySelect={handleCategorySelect}
              onClearCategory={handleClearCategory}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses && courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}