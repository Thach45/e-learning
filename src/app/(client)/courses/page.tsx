"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PacmanLoader } from 'react-spinners';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import {  FileSearch, Star, Users2, ChevronDown } from 'lucide-react';
import { getCourseCondition } from '@/lib/actions/course.action';
import { TCourseInfo, TShowCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Slogan from '@/components/layout/client/Slogan';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCategories } from '@/lib/actions/categogy.action';

export default function CoursesPage() {
  const slogan = "Hãy cùng chúng tôi khám phá tri thức và nâng cao kỹ năng qua những buổi học online linh hoạt, đầy cảm hứng. Chọn chúng tôi, bạn chọn một tương lai tươi sáng và thành công.";
  const [courses, setCourses] = useState<TCourseInfo[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<TShowCategory[]>([]);
  const [idCategory, setIdCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
  };
  

  const handleSortOrderChange = () => {
    setLoading(true);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  useEffect(() => {
    const fetchCourses = async () => {
      
      const coursesData = await getCourseCondition(searchTerm, sortOrder);
      
      if (idCategory) {
       
        const filteredCourses = coursesData!.filter((course) => course.category === idCategory);
        setCourses(filteredCourses);
      }
      else {

        setCourses(coursesData || null);
      }

      
        
      const categoriesData = await getCategories();
      setCategories(categoriesData || []);
      setLoading(false);
    };
    fetchCourses();
  }, [idCategory,searchTerm,sortOrder]);

  return (
    <>
     
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader />
        </div>
      ) : (
        <div className="container mx-auto p-8">
          {/* {Slogan} */}
          <Slogan text={slogan}/>
          {/* {Tìm kiếm khoá học} */}
          <div className="bg-white shadow-md dark:bg-blue-500 rounded-lg p-6 my-8 flex items-center justify-between">
             {/* Search */}
            <div className="flex items-center space-x-2 flex-1">
              <FileSearch className="text-gray-400 dark:text-white" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                className="flex-1 outline-none text-gray-600 dark:bg-blue-500 dark:text-white dark:placeholder-white"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={handleSortOrderChange}>
                <span className="text-gray-600 dark:text-white">{sortOrder === 'asc' ? 'Giá tăng dần' : 'Giá giảm dần'}</span>
                <ChevronDown
                  className={`text-gray-400 dark:text-white transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Category */}
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="bg-blue-500  dark:bg-blue-800 text-white">Danh mục</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full">
                    <DrawerHeader>
                      <DrawerTitle>Danh mục khoá học</DrawerTitle>
                      
                    </DrawerHeader>
                    <section className="py-12 bg-white">
                      <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {categories.map((category, index) => (
                            <div key={index}   className="cursor-pointer block p-4 border rounded-lg hover:shadow-md transition-shadow"
                              onClick={() => {
                              setLoading(true)
                              setIdCategory(category._id)
                              }}>
                            
                              <span className="text-sm font-medium">{category.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                    
                     
                    <DrawerFooter>
                     
                      <DrawerClose asChild>
                        <Button onClick ={() => {
                          setLoading(true)
                          setIdCategory("")
                        }} variant="outline"
                        disabled={idCategory === '' ? true: false}
                       
                        >Tất cả</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
              
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses && courses.map((course) => (
              <Card key={course._id} className="flex flex-col "
              style={{ boxShadow: '0 4px 8px rgba(255, 255, 255, 0.5)' }}
              >
              <Link href={`/courses/${course.slug}`}>
                <CardHeader className="p-1">
                  <Image 
                    src={course.thumbnail} 
                    alt={course.title} 
                    width={400} 
                    height={200} 
                    // layout="responsive"
                    className="w-full h-48 object-contain rounded-t-lg"
                  />
                </CardHeader>
              </Link > 
                <CardContent className="flex-grow p-4">
                  <Link href={`/courses/${course.slug}`}>
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">{course.title}</h2>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2  dark:text-white">Người dạy: {course.author}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <Users2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600  dark:text-white">{course.students.length} học viên</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1  dark:text-white">{course.rating && course.rating.length > 0
                          ? (course.rating.reduce((total, value) => total + value, 0) / course.rating.length).toFixed(1)
                          : "Chưa có đánh giá"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {course.technology.map((tag) => (
                      <Badge key={tag} className=" bg-blue-500 dark:bg-blue-800 text-white" variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              
              <CardFooter className="p-4 bg-gray-50 rounded-b-lg  dark:bg-black">
                <div className="flex items-center justify-between w-full">
                  <span className="text-lg font-bold">${course.sale_price}</span>
                  <Button className="bg-blue-500  dark:bg-blue-800 text-white" onClick={() =>  window.location.href = `/courses/${course.slug}/pay`}>Đăng kí</Button>
                </div>
              </CardFooter >
            </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}