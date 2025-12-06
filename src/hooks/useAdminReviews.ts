import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminReviewsApi, type GetAdminReviewsParams, type UpdateReviewBody } from '../api/admin';

// Get admin reviews
export const useAdminReviews = (params?: GetAdminReviewsParams) => {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: async () => {
      const response = await adminReviewsApi.getReviews(params);
      return response;
    },
  });
};

// Get reviews by course
export const useAdminReviewsByCourse = (courseId: string, params?: GetAdminReviewsParams) => {
  return useQuery({
    queryKey: ['admin', 'reviews', 'course', courseId, params],
    queryFn: async () => {
      const response = await adminReviewsApi.getReviewsByCourse(courseId, params);
      return response;
    },
    enabled: !!courseId,
  });
};

// Update review mutation
export const useUpdateAdminReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId, body }: { courseId: string; reviewId: string; body: UpdateReviewBody }) => 
      adminReviewsApi.updateReview(courseId, reviewId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
};

// Delete review mutation
export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId }: { courseId: string; reviewId: string }) => 
      adminReviewsApi.deleteReview(courseId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
};

