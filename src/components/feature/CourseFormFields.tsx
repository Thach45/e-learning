import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ECourseLevel, ECourseStatus } from '@/types/enums'
import { TShowCategory, TUserInfo } from '@/types'
import { UseFormReturn } from 'react-hook-form'
import { CourseFormData } from '@/hooks/use-course-form'
import { Controller } from 'react-hook-form'

interface CourseFormFieldsProps {
  form: UseFormReturn<CourseFormData>;
  authors?: TUserInfo[];
  categories?: TShowCategory[];
  preview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CourseFormFields({ 
  form, 
  authors, 
  categories,
  preview,
  onFileChange
}: CourseFormFieldsProps) {
  const { register, control, formState: { errors } } = form;

  const addField = (field: string) => {
    const currentValue = form.getValues(field as any);
    form.setValue(field as any, [...currentValue, '']);
  };

  return (
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
            onChange={onFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {preview && (
            <div className="relative w-40 h-40">
              <img 
                src={preview} 
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
        <Label htmlFor="author">Author</Label>
        <Controller
          name="author"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                {authors?.map((author) => (
                  <SelectItem key={author._id} value={author._id}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.author && <p className="text-red-500 text-sm">{errors.author.message}</p>}
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
        {form.watch('technology').map((_, index) => (
          <div key={index} className="flex gap-2">
            <Input {...register(`technology.${index}`)} placeholder="Enter technology" />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => addField('technology')}>
          Add Technology
        </Button>
      </div>

      <div className="space-y-4">
        <Label>Requirements</Label>
        {form.watch('info.requirements')?.map((_, index) => (
          <div key={index} className="flex gap-2">
            <Input {...register(`info.requirements.${index}`)} placeholder="Enter requirement" />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => addField('info.requirements')}>
          Add Requirement
        </Button>
      </div>

      <div className="space-y-4">
        <Label>Benefits</Label>
        {form.watch('info.benefits')?.map((_, index) => (
          <div key={index} className="flex gap-2">
            <Input {...register(`info.benefits.${index}`)} placeholder="Enter benefit" />
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => addField('info.benefits')}>
          Add Benefit
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="deleted" {...register('deleted')} />
        <Label htmlFor="deleted">Deleted</Label>
      </div>
    </div>
  );
} 