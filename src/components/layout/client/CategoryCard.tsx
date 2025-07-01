"use client"
import { Book } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { TShowCategory } from '@/types';

interface CategoryCardProps {
  category: TShowCategory;
  courseCount?: number;
}

export default function CategoryCard({ category, courseCount = 0 }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category._id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Book className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {courseCount} khóa học
                </p>
              </div>
            </div>
          </div>
          {category.description && (
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
} 