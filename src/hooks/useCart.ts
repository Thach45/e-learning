import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cart";

export const useGetCart = () => {
    return useQuery({
      queryKey: ['cart'],
      queryFn: () => cartApi.getCart(),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

export const useAddToCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (courseId: string) => cartApi.addToCart(courseId),
      onSuccess: () => {
       
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    });
  };

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (courseId: string) => cartApi.removeFromCart(courseId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    });
  };

export const useClearCart = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: () => cartApi.clearCart(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      },
    });
  };