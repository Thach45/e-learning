import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorReviewsApi, type GetInstructorReviewsParams, type UpdateReviewBody } from '../api/instructorReviews';

// Get reviews by course
export const useInstructorReviewsByCourse = (courseId: string, params?: GetInstructorReviewsParams) => {
  return useQuery({
    queryKey: ['instructor', 'reviews', 'course', courseId, params],
    queryFn: async () => {
      const response = await instructorReviewsApi.getReviewsByCourse(courseId, params);
      return response;
    },
    enabled: !!courseId,
  });
};

// Update review mutation
export const useUpdateInstructorReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId, body }: { courseId: string; reviewId: string; body: UpdateReviewBody }) => 
      instructorReviewsApi.updateReview(courseId, reviewId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'reviews', 'course', variables.courseId] });
    },
  });
};

// Delete review mutation
export const useDeleteInstructorReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId }: { courseId: string; reviewId: string }) => 
      instructorReviewsApi.deleteReview(courseId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'reviews', 'course', variables.courseId] });
    },
  });
};

