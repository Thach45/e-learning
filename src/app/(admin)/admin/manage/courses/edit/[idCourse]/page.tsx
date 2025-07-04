'use client';
import { useForm, Controller } from 'react-hook-form'
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
import {  TEditCourse, TShowCategory, TUserInfo } from '@/types';
import { getCourseById, updateCourse } from '@/lib/actions/course.action';

import {  getUserRole } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCategories } from '@/lib/actions/categogy.action';
import { useParams } from 'next/navigation';
import { X } from 'lucide-react';




const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  thumbnail: z.string().url('Invalid URL').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  sale_price: z.number().min(0, 'Sale price must be non-negative'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.nativeEnum(ECourseStatus),
  author: z.string().optional(),
  level: z.nativeEnum(ECourseLevel),
  category: z.string().optional(),
  
  deleted: z.boolean()
})

type CourseFormData = z.infer<typeof courseSchema>

export default function CreateCourseForm() {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      status: ECourseStatus.PENDING,
      level: ECourseLevel.BEGINNER,
      deleted: false
    }
  })

  const slugCourse = useParams().idCourse;
  const [course, setCourse] = useState<TEditCourse | null>(null);
  const [authors, setAuthors] = useState<TUserInfo[] | undefined>([]);
  const [categories, setCategories] = useState<TShowCategory[] | null | undefined>([]);
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [techs, setTechs] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  const [inputValues, setInputValues] = useState({
    tech: "",
    requirement: "",
    benefit: "",
  });
  
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authors = await getAuthors();
        const categories = await getCategories();
        const coursesData = await getCourseById(slugCourse as string);
        setCourse(coursesData);
        setImage(coursesData?.thumbnail || null);
        setTechs(coursesData?.technology || []);
        setRequirements(coursesData?.info?.requirements || []);
        setBenefits(coursesData?.info?.benefits || []);
        setCategories(categories);
        setAuthors(authors);
        
        if (coursesData) {
          reset(course!);
        }
        
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Make sure to set loading to false even if there's an error
      }
    };

    fetchData();
  }, [ slugCourse, reset,isSubmitting]);

  const getAuthors = async (): Promise<TUserInfo[] | undefined> => {
    const authors = await getUserRole('EXPERT');
    return authors;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'tech' | 'requirement' | 'benefit') => {
    if (e.key === "Enter" && inputValues[type].trim()) {
      e.preventDefault(); 
      
      if (type === "tech") {
        const newTech = inputValues[type].trim();
      // Kiểm tra xem giá trị đã tồn tại trong mảng chưa
      if (!techs.includes(newTech)) {
        setTechs([...techs, newTech]);
      }
      setInputValues({ ...inputValues, tech: "" });
        return;
      }
            
      if (type === "requirement") {
       const newRequirement = inputValues[type].trim();
      if (!requirements.includes(newRequirement)) {
        setRequirements([...requirements, newRequirement]);
      }
      setInputValues({ ...inputValues, requirement: "" });
        return;
      }
      
      if (type === "benefit") {
        const newBenefit = inputValues[type].trim();
      if (!benefits.includes(newBenefit)) {
        setBenefits([...benefits, newBenefit]);
      }
      setInputValues({ ...inputValues, benefit: "" });
        return;
      }
    }
  };

  const removeItem = (type: string, index: number) => {
    
    if (type === "tech") setTechs(techs.filter((_, i) => i !== index));
    if (type === "requirement")
      setRequirements(requirements.filter((_, i) => i !== index));
    if (type === "benefit") setBenefits(benefits.filter((_, i) => i !== index));
  };

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

  const onSubmit = async (data: CourseFormData) => {
    try {
      setIsSubmitting(true); // Set submitting state to true
      
      if (!image) {
        alert('Vui lòng chọn ảnh');
        setIsSubmitting(false);
        return;
      }
      
      let imageUrl = image;
      
      // Only upload image if it's a base64 string (new upload)
      if (image.startsWith('data:')) {
        const response = await fetch('/api/cloudinary/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: image }),
        });

        const res = await response.json();
        if (response.ok) {
          alert(`Upload thành công: ${res.url}`);
          imageUrl = res.url;
        } else {
          console.error(`Lỗi: ${res.error}`);
          setIsSubmitting(false);
          return;
        }
      }
   

      const dataCreate: TEditCourse = {
        title: data.title,
       
        thumbnail: imageUrl,
        description: data.description,
        price: data.price,
        sale_price: data.sale_price,
        slug: data.slug,
        status: data.status,
        author: data.author,
        level: data.level,
        category: data.category,
        technology: techs,
        info: {
          requirements: requirements,
          benefits: benefits,
         
        },
      };
      
      updateCourse(slugCourse as string, dataCreate);
      alert("Cập nhật khóa học thành công!");
      // Optionally reset form or redirect
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi cập nhật khóa học!");
    } finally {
      setIsSubmitting(false);
      window.location.reload(); 
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="mx-16">
        <CardHeader>
          <CardTitle>Edit Course</CardTitle>
          <CardDescription>Enter the details for your course.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {preview ? (
                <img src={preview} alt="Preview" width={200} className="mt-2" />
              ) : image ? (
                <img src={image} alt="Current Thumbnail" width={200} className="mt-2" />
              ) : null}
            </div>
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
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ECourseStatus).map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors ? authors.map((author) => (
                      <SelectItem key={author._id} value={author._id}>{author.name}</SelectItem>
                    )) : []}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
         

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ECourseLevel).map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh mục khoá học</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
            <Label>Công nghệ</Label>
            <Input
              type="text"
              placeholder="Nhập công nghệ và nhấn Enter"
              value={inputValues.tech}
              onChange={(e) =>
                setInputValues({ ...inputValues, tech: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "tech")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {techs.map((tech, index) => (
                <TagItem key={index} text={tech} onRemove={() => removeItem("tech", index)} />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Yêu cầu</Label>
            <Input
              type="text"
              placeholder="Nhập yêu cầu và nhấn Enter"
              value={inputValues.requirement}
              onChange={(e) =>
                setInputValues({ ...inputValues, requirement: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "requirement")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.map((req, index) => (
                <TagItem key={index} text={req} onRemove={() => removeItem("requirement", index)} />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Lợi ích</Label>
            <Input
              type="text"
              placeholder="Nhập lợi ích và nhấn Enter"
              value={inputValues.benefit}
              onChange={(e) =>
                setInputValues({ ...inputValues, benefit: e.target.value })
              }
              onKeyDown={(e) => handleKeyDown(e, "benefit")}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {benefits.map((ben, index) => (
                <TagItem key={index} text={ben} onRemove={() => removeItem("benefit", index)} />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="deleted" {...register('deleted')} />
            <Label htmlFor="deleted">Deleted</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
           
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Edit Course'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

interface TagItemProps {
  text: string;
  onRemove: () => void;
}

const TagItem: React.FC<TagItemProps> = ({ text, onRemove }) => (
    <div className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-lg">
      <span>{text}</span>
      <Button size="icon" variant="ghost" type="button" onClick={onRemove}>
        <X size={16} />
      </Button>
    </div>
  );