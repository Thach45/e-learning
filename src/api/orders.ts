import apiClient from './axios';

// Types
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED';

export type OrderItem = {
  id: string;
  orderId: string;
  courseId: string;
  price: number;
};

export type Order = {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  orderItems: OrderItem[];
  createdAt: string;
};

export type CreateOrderBody = {
  courseIds: string[];
  voucherCode?: string;
};

export type OrderResponse = Order;

// Orders API functions
export const ordersApi = {
  // Get user orders
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get('/orders/my');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create order
  createOrder: async (body: CreateOrderBody): Promise<OrderResponse> => {
    const response = await apiClient.post('/orders', body);
    return response.data;
  },
};

