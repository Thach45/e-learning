'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TShowCategory } from '@/types';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCategories } from '@/lib/actions/categogy.action';
import { useCourseForm } from '@/hooks/use-course-form';
import { CourseFormFields } from '@/components/feature/CourseFormFields';
import { toast } from '@/components/ui/use-toast';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';

export default function CreateCourseForm() {
  const { user } = useUser();
  const router = useRouter();
  const [categories, setCategories] = useState<TShowCategory[]>([]);
  const { form, preview, loading, handleFileChange, onSubmit } = useCourseForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      }
    };
  
    fetchData();
  }, []);
  
  const handleSubmit = async (data: any) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a course",
        variant: "destructive",
      });
      return;
    }

    const result = await onSubmit(data, user.id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      router.push('/expert/manage/courses');
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
      <Card className="mx-16">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>Enter the details for your new course.</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseFormFields
            form={form}
            categories={categories}
            preview={preview}
            onFileChange={handleFileChange}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Create Course</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

