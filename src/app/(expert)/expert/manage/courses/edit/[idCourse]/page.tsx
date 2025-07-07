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
import { TEditCourse, TShowCategory, TUserInfo } from '@/types';
import { getCourseById, updateCourse } from '@/lib/actions/course.action';
import { getUserRole } from '@/lib/actions/user.actions';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';
import { getCategories } from '@/lib/actions/categogy.action';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  sale_price: z.number().min(0, 'Sale price must be non-negative'),
  slug: z.string().min(1, 'Slug is required'),
  status: z.nativeEnum(ECourseStatus),
  level: z.nativeEnum(ECourseLevel),
  category: z.string().optional(),
  technology: z.array(z.string()).optional(),
  info: z.object({
    requirements: z.array(z.string()).optional(),
    benefits: z.array(z.string()).optional()
  }).optional()
})

type CourseFormData = z.infer<typeof courseSchema>

export default function EditCourseForm() {
  const router = useRouter();
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema)
  });

  const slugCourse = useParams().idCourse;
  const [course, setCourse] = useState<TEditCourse | null>(null);
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
        const [categories, coursesData] = await Promise.all([
          getCategories(),
          getCourseById(slugCourse as string)
        ]);

        if (coursesData) {
          setCourse(coursesData);
          setImage(coursesData.thumbnail || null);
          setTechs(coursesData.technology || []);
          setRequirements(coursesData.info?.requirements || []);
          setBenefits(coursesData.info?.benefits || []);
          
          // Reset form với dữ liệu từ server
          reset({
            title: coursesData.title,
            description: coursesData.description,
            price: coursesData.price,
            sale_price: coursesData.sale_price,
            slug: coursesData.slug,
            status: coursesData.status as ECourseStatus,
            level: coursesData.level as ECourseLevel,
            category: coursesData.category,
            technology: coursesData.technology,
            info: {
              requirements: coursesData.info?.requirements || [],
              benefits: coursesData.info?.benefits || []
            }
          });
        } else {
          toast({
            title: "Error",
            description: "Không tìm thấy khóa học",
            variant: "destructive",
          });
          router.push('/expert/manage/courses');
        }

        setCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Có lỗi xảy ra khi tải dữ liệu",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [slugCourse, reset, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'tech' | 'requirement' | 'benefit') => {
    if (e.key === "Enter" && inputValues[type].trim()) {
      e.preventDefault(); 
      
      if (type === "tech") {
        const newTech = inputValues[type].trim();
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
    if (type === "requirement") setRequirements(requirements.filter((_, i) => i !== index));
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
      setIsSubmitting(true);
      
      if (!image) {
        toast({
          title: "Error",
          description: "Vui lòng chọn ảnh",
          variant: "destructive",
        });
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
          imageUrl = res.url;
        } else {
          console.error(`Lỗi: ${res.error}`);
          toast({
            title: "Error",
            description: "Lỗi khi tải ảnh lên",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare course data for update
      const courseData = {
        ...data,
        thumbnail: imageUrl,
        technology: techs,
        info: {
          requirements: requirements,
          benefits: benefits
        },
        author: course?.author // Keep the original author
      };

      console.log('Updating course with data:', courseData);

      // Call the update API
      const result = await updateCourse(slugCourse as string, courseData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Cập nhật khóa học thành công",
        });
        router.push('/expert/manage/courses');
      } else {
        toast({
          title: "Error",
          description: "Lỗi khi cập nhật khóa học",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Có lỗi xảy ra khi cập nhật khóa học",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <CardDescription>Edit your course details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <div className="space-y-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {(preview || image) && (
                  <div className="relative w-40 h-40">
                    <img 
                      src={preview || image || ''} 
                      alt="Preview" 
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                )}
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
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
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
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.level && <p className="text-red-500 text-sm">{errors.level.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div className="space-y-4">
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {techs.map((tech, index) => (
                  <TagItem key={index} text={tech} onRemove={() => removeItem('tech', index)} />
                ))}
              </div>
              <Input
                value={inputValues.tech}
                onChange={(e) => setInputValues({ ...inputValues, tech: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, 'tech')}
                placeholder="Press Enter to add technology"
              />
            </div>

            <div className="space-y-4">
              <Label>Requirements</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {requirements.map((req, index) => (
                  <TagItem key={index} text={req} onRemove={() => removeItem('requirement', index)} />
                ))}
              </div>
              <Input
                value={inputValues.requirement}
                onChange={(e) => setInputValues({ ...inputValues, requirement: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, 'requirement')}
                placeholder="Press Enter to add requirement"
              />
            </div>

            <div className="space-y-4">
              <Label>Benefits</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {benefits.map((benefit, index) => (
                  <TagItem key={index} text={benefit} onRemove={() => removeItem('benefit', index)} />
                ))}
              </div>
              <Input
                value={inputValues.benefit}
                onChange={(e) => setInputValues({ ...inputValues, benefit: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, 'benefit')}
                placeholder="Press Enter to add benefit"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật khóa học"}
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
  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
    <span>{text}</span>
    <button type="button" onClick={onRemove} className="text-red-500 hover:text-red-700">
      <X size={14} />
    </button>
  </div>
);