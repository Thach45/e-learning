import apiClient from './axios';

// Types
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'CLIENT';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  avatar?: string | null;
  status: UserStatus;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
};

export type GetAdminUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  role?: UserRole;
};

export type GetAdminUsersResponse = {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateUserBody = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
};

export type UpdateUserBody = {
  email?: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
  avatar?: string;
  status?: UserStatus;
  roles?: UserRole[];
};

export type UpdateUserStatusBody = {
  status: UserStatus;
};

// Admin Users API functions
export const adminUsersApi = {
  // Get users list
  getUsers: async (params?: GetAdminUsersParams): Promise<GetAdminUsersResponse> => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data.data;
  },

  // Create user
  createUser: async (body: CreateUserBody): Promise<AdminUser> => {
    const response = await apiClient.post('/admin/users', body);
    return response.data.data;
  },

  // Update user
  updateUser: async (id: string, body: UpdateUserBody): Promise<AdminUser> => {
    const response = await apiClient.put(`/admin/users/${id}`, body);
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Update user status
  updateUserStatus: async (id: string, body: UpdateUserStatusBody): Promise<AdminUser> => {
    const response = await apiClient.put(`/admin/users/${id}/status`, body);
    return response.data.data;
  },
};

