import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi, type GetAdminUsersParams, type CreateUserBody, type UpdateUserBody, type UpdateUserStatusBody } from '../api/admin';

// Get admin users
export const useAdminUsers = (params?: GetAdminUsersParams) => {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await adminUsersApi.getUsers(params);
      return response;
    },
  });
};

// Get user by ID
export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: () => adminUsersApi.getUserById(id),
    enabled: !!id,
  });
};

// Create user mutation
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (body: CreateUserBody) => adminUsersApi.createUser(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Update user mutation
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserBody }) => 
      adminUsersApi.updateUser(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', variables.id] });
    },
  });
};

// Delete user mutation
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminUsersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

// Update user status mutation
export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserStatusBody }) => 
      adminUsersApi.updateUserStatus(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', variables.id] });
    },
  });
};

