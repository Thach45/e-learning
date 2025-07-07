import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ECourseLevel, ECourseStatus } from '@/types/enums';
import { TCreateCourse } from '@/types';
import { createCourse } from '@/lib/actions/course.action';
import React from 'react';
import { getUser } from '@/lib/actions/user.actions';

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
};

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  thumbnail: z.string().url('Invalid URL').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  sale_price: z.number().min(0, 'Sale price must be non-negative'),
  slug: z.string().optional(),
  level: z.nativeEnum(ECourseLevel),
  category: z.string().min(1, 'Category is required'),
  technology: z.array(z.string()),
  info: z.object({
    requirements: z.array(z.string()),
    benefits: z.array(z.string())
  }).optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export const useCourseForm = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: ECourseLevel.BEGINNER,
      technology: [''],
      info: {
        requirements: [''],
        benefits: ['']
      }
    }
  });

  const title = form.watch('title');
  
  React.useEffect(() => {
    if (title) {
      const generatedSlug = slugify(title);
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const onSubmit = async (data: CourseFormData, userId: string) => {
    try {
      setLoading(true);
      if (!imageFile) {
        throw new Error('Please select an image');
      }

      // Lấy thông tin user từ database
      const user = await getUser(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const imageUrl = await uploadImage(imageFile);

      const courseData: TCreateCourse = {
        title: data.title,
        thumbnail: imageUrl,
        description: data.description,
        price: data.price,
        sale_price: data.sale_price,
        slug: slugify(data.title),
        status: ECourseStatus.PENDING, // Luôn set status là PENDING khi tạo mới
        author: user._id,
        level: data.level,
        category: data.category,
        technology: data.technology.filter(Boolean),
        info: {
          requirements: data.info?.requirements.filter(Boolean) || [],
          benefits: data.info?.benefits.filter(Boolean) || []
        },
      };

      const result = await createCourse(courseData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create course');
      }

      form.reset();
      setImageFile(null);
      setPreview(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Something went wrong' 
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    imageFile,
    preview,
    loading,
    handleFileChange,
    onSubmit
  };
}; 