import apiClient from './axios';

export type Category = {
  id: string;
  name: string;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export const categoriesApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data.data;
  },

  // Get category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data.data;
  },
};

