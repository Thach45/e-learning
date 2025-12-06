import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCoursesApi, type GetAdminCoursesParams } from '../api/admin';

// Get admin courses
export const useAdminCourses = (params?: GetAdminCoursesParams) => {
  return useQuery({
    queryKey: ['admin', 'courses', params],
    queryFn: async () => {
      const response = await adminCoursesApi.getCourses(params);
      return response;
    },
  });
};

// Get course by ID (full detail)
export const useAdminCourse = (id: string) => {
  return useQuery({
    queryKey: ['admin', 'course', id],
    queryFn: () => adminCoursesApi.getCourseById(id),
    enabled: !!id,
  });
};

// Approve publish mutation
export const useApprovePublish = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminCoursesApi.approvePublish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course', id] });
    },
  });
};

// Reject publish mutation
export const useRejectPublish = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminCoursesApi.rejectPublish(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course', id] });
    },
  });
};

// Approve delete mutation
export const useApproveDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminCoursesApi.approveDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
    },
  });
};

// Reject delete mutation
export const useRejectDelete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminCoursesApi.rejectDelete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'course', id] });
    },
  });
};

