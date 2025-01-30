import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ELessonType, EVideoType } from "@/types/enums";
import { TEditLesson } from "@/types";
import { updateLesson } from "@/lib/actions/lesson.action";

interface EditLessonDialogProps {
  editLesson: boolean;
  lesson: TEditLesson | null;
  onClose: () => void;
  
}

const EditLessonDialog: React.FC<EditLessonDialogProps> = ({ editLesson, lesson, onClose }) => {
    const initialData = lesson || {
        title: "",
        slug: "",
        order: 1,
        videoType: EVideoType.DRIVE,
        videoURL: "",
        content: "",
        type: ELessonType.TEXT,
        deleted: false
    };
    

  const [lessonType, setLessonType] = useState<ELessonType>(initialData.type);
  

  const { control, handleSubmit, register, formState: { errors }, reset } = useForm<TEditLesson>({
    defaultValues: initialData,
  });

  useEffect(() => {
    reset(initialData);
  }, [lesson, reset]);

  const onSubmit = async (data: TEditLesson) => {
    
    await updateLesson(data._id, data);
    
    onClose();
  };

  return (
    <Dialog open={editLesson} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Lesson Title"
              {...register("title", { required: "Lesson title is required" })}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <Input
              placeholder="Lesson Slug"
              {...register("slug", { required: "Slug is required" })}
            />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
          </div>

          <div>
            <Input
              type="number"
              placeholder="Order"
              {...register("order", {
                required: "Order is required",
                min: { value: 1, message: "Order must be at least 1" },
              })}
            />
            {errors.order && <p className="text-red-500 text-sm">{errors.order.message}</p>}
          </div>

          <div>
            <label>Lesson Type:</label>
            <select
              {...register("type", { required: "Please select a lesson type" })}
              className="w-full p-2 border rounded"
              onChange={(e) => setLessonType(e.target.value as ELessonType)}
            >
              <option value={ELessonType.TEXT}>Text</option>
              <option value={ELessonType.VIDEO}>Video</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          {lessonType === ELessonType.VIDEO && (
            <>
              <div>
                <label>Video Type:</label>
                <select
                  className="w-full p-2 border rounded"
                  {...register("videoType", { required: "Please select a video type" })}
                  
                >
                  <option value={EVideoType.DRIVE}>Google Drive</option>
                  <option value={EVideoType.YOUTUBE}>Youtube Video</option>
                </select>
                {errors.videoType && (
                  <p className="text-red-500 text-sm">{errors.videoType.message}</p>
                )}
              </div>

              
              <div>
                <Input
                  placeholder="Google Drive Video URL"
                  {...register("videoURL", { required: "Video URL is required" })}
                />
                {errors.videoURL && (
                  <p className="text-red-500 text-sm">{errors.videoURL.message}</p>
                )}
              </div>
            

             
            
            </>
          )}

          {lessonType === ELessonType.TEXT && (
            <div>
              <textarea
                placeholder="Content"
                {...register("content", { required: "Content is required" })}
                className="w-full p-2 border rounded"
              ></textarea>
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <label>Mark as Deleted:</label>
            <Controller
              name="deleted"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  className="form-checkbox"
                  {...field}
                  value={initialData.deleted.toString()}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save Changes</Button>
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLessonDialog;