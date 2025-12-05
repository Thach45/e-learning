import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type CreateOrderBody } from '../api/orders';

// Get my orders
export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => ordersApi.getMyOrders(),
  });
};

// Get order by ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
  });
};

// Create order mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body: CreateOrderBody) => ordersApi.createOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

