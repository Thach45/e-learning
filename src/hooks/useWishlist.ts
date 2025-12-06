import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi, type GetWishlistParams } from '../api/wishlist';

// Get my wishlist
export const useMyWishlist = (params?: GetWishlistParams) => {
  return useQuery({
    queryKey: ['my-wishlist', params],
    queryFn: () => wishlistApi.getMyWishlist(params),
  });
};

// Check wishlist status
export const useCheckWishlist = (courseId: string) => {
  return useQuery({
    queryKey: ['wishlist-check', courseId],
    queryFn: () => wishlistApi.checkWishlist(courseId),
    enabled: !!courseId,
  });
};

// Add to wishlist mutation
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => wishlistApi.addToWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
    },
  });
};

// Remove from wishlist mutation
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => wishlistApi.removeFromWishlist(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-check'] });
    },
  });
};

