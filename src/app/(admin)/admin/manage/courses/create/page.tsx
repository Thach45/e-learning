'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TShowCategory, TUserInfo } from '@/types';
import { getUserRole } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCategories } from '@/lib/actions/categogy.action';
import { useCourseForm } from '@/hooks/use-course-form';
import { CourseFormFields } from '@/components/feature/CourseFormFields';
import { toast } from '@/components/ui/use-toast';

export default function CreateCourseForm() {
  const [authors, setAuthors] = useState<TUserInfo[] | undefined>([]);
  const [categories, setCategories] = useState<TShowCategory[]>([]);
  const { form, preview, loading, handleFileChange, onSubmit } = useCourseForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsData, categoriesData] = await Promise.all([
          getUserRole('EXPERT'),
          getCategories()
        ]);
        setAuthors(authorsData);
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
    const result = await onSubmit(data);
    if (result.success) {
      toast({
        title: "Success",
        description: "Course created successfully",
      });
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
            authors={authors}
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

