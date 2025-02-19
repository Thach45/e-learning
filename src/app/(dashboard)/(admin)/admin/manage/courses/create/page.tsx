'use client';
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { ECourseLevel, ECourseStatus } from '@/types/enums';
import { TCreateCourse, TShowCategory, TUserInfo } from '@/types';
import { createCourse } from '@/lib/actions/course.action';
import mongoose from 'mongoose';
import { getUserRole } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCategories } from '@/lib/actions/categogy.action';


const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  thumbnail: z.string().url('Invalid URL').optional(),
  intro: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  sale_price: z.number().min(0, 'Sale price must be non-negative'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.nativeEnum(ECourseStatus),
  author: z.string().optional(),
  level: z.nativeEnum(ECourseLevel),
  category: z.string().optional(),
  technology: z.array(z.string()),
  info: z.object({
    requirements: z.array(z.string()),
    qa: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })),
    benefits: z.array(z.string())
  }),
  deleted: z.boolean()
})

type CourseFormData = z.infer<typeof courseSchema>

export default function CreateCourseForm() {
  const { register, control, handleSubmit,reset, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: ECourseStatus.PENDING,
      level: ECourseLevel.BEGINNER,
      technology: [''],
      info: {
        requirements: [''],
        qa: [{ question: '', answer: '' }],
        benefits: ['']
      },
      deleted: false
    }
  })

  const { fields: techFields, append: appendTech } = useFieldArray({
    control,
    name: "info.qa"
  })
  
  const { fields: reqFields, append: appendReq } = useFieldArray({
    control,
    name: "info.qa"
  })
  
  const { fields: benefitFields, append: appendBenefit } = useFieldArray({
    control,
    name: "info.qa"
  })
  const [authors, setAuthors] = useState<TUserInfo[] | undefined>([]);
  const [categories, setCategories] = useState<TShowCategory[] |null |undefined>([]);
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAuthors = async () => {
      const authors = await getAuthors();
      const categories = await getCategories();
      setCategories(categories);
      setAuthors(authors);
    };
  
    fetchAuthors();
  }, []);
  const getAuthors = async (): Promise<TUserInfo[] | undefined> => {
      const authors = await getUserRole('EXPERT');
      return authors;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
    }
  };
  const onSubmit = async (data: CourseFormData)  => {  
    setLoading(false);
    if (!image) return alert('Vui lòng chọn ảnh');

    const response = await fetch('/api/cloudinary/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: image }),
    });

    const res = await response.json();
    if (response.ok) {
      alert(`Upload thành công: ${res.url}`);
      console.log('Public url:', res.url)
    } else {
      console.log(`Lỗi: ${res.error}`);
    }
    const dataCreate: TCreateCourse = {
        title: data.title,
        thumbnail: res.url,
        intro: data.intro,
        description: data.description,
        price: data.price,
        sale_price: data.sale_price,
        slug: data.slug,
        status: data.status,
        author: data.author ? new mongoose.Types.ObjectId(data.author) : undefined,
         level: data.level,
        category: data.category,
        technology: data.technology,
        info: {
          requirements: data.info.requirements,
          benefits: data.info.benefits
        },
    }
    createCourse(dataCreate); // return await newCourse.save() nên không cần await ở đây;
    console.log("Đã tạo khóa học");
    reset();
    setLoading(true);
    
  }

  return (
    <>
      {loading ? (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="mx-16">
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Enter the details for your new course.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            
            <div className="space-y-2">
              <Label >Thumbnail</Label>
              <div >
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {preview && <img src={preview} alt="Preview" width={200} />}
              </div>
            </div>

          
            <div className="space-y-2">
              <Label htmlFor="intro">Introduction</Label>
              <Textarea id="intro" {...register('intro')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale_price">Sale Price</Label>
                <Input id="sale_price" type="number" {...register('sale_price', { valueAsNumber: true })} />
                {errors.sale_price && <p className="text-red-500 text-sm">{errors.sale_price.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => register('status').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ECourseStatus).map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Controller
                name="author"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors?.map((author) => (
                        <SelectItem key={author._id} value={author._id}>{author.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select onValueChange={(value) => register('level').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ECourseLevel).map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục khoá học</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>{category.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Technologies</Label>
              {techFields.map((field, index) => (
                <Input
                  key={field.id}
                  {...register(`technology.${index}`)}
                  className="mb-2"
                />
              ))}
              <Button type="button" variant="outline" onClick={() => appendTech({ question: '', answer: '' })}>
                Add Technology
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Requirements</Label>
              {reqFields.map((field, index) => (
                <Input
                  key={field.id}
                  {...register(`info.requirements.${index}`)}
                  className="mb-2"
                />
              ))}
              <Button type="button" variant="outline" onClick={() => appendReq({ question: '', answer: '' })}>
                Add Requirement
              </Button>
            </div>

            
            <div className="space-y-2">
              <Label>Benefits</Label>
              {benefitFields.map((field, index) => (
                <Input
                  key={field.id}
                  {...register(`info.benefits.${index}`)}
                  className="mb-2"
                />
              ))}
              <Button type="button" variant="outline" onClick={() => appendBenefit({ question: '', answer: '' })}>
                Add Benefit
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="deleted" {...register('deleted')} />
              <Label htmlFor="deleted">Deleted</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Create Course</Button>
          </CardFooter>
        </Card>
      </form>

      ): (
        <div className="flex justify-center items-center h-screen">
          <PacmanLoader />
        </div>
      )}
    </>
  )
}

