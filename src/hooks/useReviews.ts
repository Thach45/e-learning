import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  reviewsApi, 
  type GetReviewsParams, 
  type CreateReviewBody, 
  type UpdateReviewBody 
} from '../api/reviews';

// Get reviews by course
export const useReviewsByCourse = (courseId: string, params?: Omit<GetReviewsParams, 'courseId'>) => {
  return useQuery({
    queryKey: ['reviews', 'course', courseId, params],
    queryFn: () => reviewsApi.getReviewsByCourse(courseId, params),
    enabled: !!courseId,
  });
};

// Get my review for a course
export const useMyReview = (courseId: string) => {
  return useQuery({
    queryKey: ['my-review', courseId],
    queryFn: () => reviewsApi.getMyReview(courseId),
    enabled: !!courseId,
    retry: false, // Don't retry on 404 (user hasn't reviewed yet)
  });
};

// Create review mutation
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, body }: { courseId: string; body: CreateReviewBody }) => 
      reviewsApi.createReview(courseId, body),
    onSuccess: (_, variables) => {
      // Invalidate reviews for this course
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', variables.courseId] });
      // Invalidate my review
      queryClient.invalidateQueries({ queryKey: ['my-review', variables.courseId] });
      // Invalidate course detail (to update rating)
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      // Invalidate course list (if rating affects listing)
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Instructor: Get reviews for their course
export const useInstructorCourseReviews = (courseId: string, params?: Omit<GetReviewsParams, 'courseId'>) => {
  return useQuery({
    queryKey: ['instructor', 'reviews', 'course', courseId, params],
    queryFn: () => reviewsApi.getInstructorCourseReviews(courseId, params),
    enabled: !!courseId,
  });
};

// Instructor: Update review mutation
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId, body }: { courseId: string; reviewId: string; body: UpdateReviewBody }) => 
      reviewsApi.updateReview(courseId, reviewId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

// Instructor: Delete review mutation
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId }: { courseId: string; reviewId: string }) => 
      reviewsApi.deleteReview(courseId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

// Admin: Get all reviews
export const useAdminReviews = (params?: GetReviewsParams) => {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => reviewsApi.getReviews(params),
  });
};

// Admin: Get reviews by course
export const useAdminCourseReviews = (courseId: string, params?: Omit<GetReviewsParams, 'courseId'>) => {
  return useQuery({
    queryKey: ['admin', 'reviews', 'course', courseId, params],
    queryFn: () => reviewsApi.getAdminCourseReviews(courseId, params),
    enabled: !!courseId,
  });
};

// Admin: Update review mutation
export const useUpdateReviewAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId, body }: { courseId: string; reviewId: string; body: UpdateReviewBody }) => 
      reviewsApi.updateReviewAdmin(courseId, reviewId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

// Admin: Delete review mutation
export const useDeleteReviewAdmin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, reviewId }: { courseId: string; reviewId: string }) => 
      reviewsApi.deleteReviewAdmin(courseId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'course', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

