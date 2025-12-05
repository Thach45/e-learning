import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseDetailApi, type CreateCourseDetailBody, type UpdateCourseDetailBody } from '../api/courseDetail';

// Get course detail
export const useCourseDetail = (courseId: string) => {
  return useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => courseDetailApi.getCourseDetail(courseId),
    enabled: !!courseId,
  });
};

// Create course detail mutation
export const useCreateCourseDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, body }: { courseId: string; body: CreateCourseDetailBody }) => 
      courseDetailApi.createCourseDetail(courseId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', variables.courseId] });
    },
  });
};

// Update course detail mutation
export const useUpdateCourseDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, body }: { courseId: string; body: UpdateCourseDetailBody }) => 
      courseDetailApi.updateCourseDetail(courseId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', variables.courseId] });
    },
  });
};

// Delete course detail mutation
export const useDeleteCourseDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => courseDetailApi.deleteCourseDetail(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ['course-detail', courseId] });
    },
  });
};

