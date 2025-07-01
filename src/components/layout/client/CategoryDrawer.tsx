"use client"
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TShowCategory } from '@/types';

interface CategoryDrawerProps {
  categories: TShowCategory[];
  idCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onClearCategory: () => void;
}

export default function CategoryDrawer({
  categories,
  idCategory,
  onCategorySelect,
  onClearCategory
}: CategoryDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="bg-blue-500 dark:bg-blue-800 text-white">
          Danh mục
        </Button>
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
                  <div
                    key={index}
                    className="cursor-pointer block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    onClick={() => onCategorySelect(category._id)}
                  >
                    <span className="text-sm font-medium">{category.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                onClick={onClearCategory}
                variant="outline"
                disabled={idCategory === ''}
              >
                Tất cả
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
} 