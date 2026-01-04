import { useQuery } from '@tanstack/react-query';
import {
  instructorApi,
  type InstructorStats,
  type CourseAnalytics,
  type RevenueChartData,
  type GetEnrolledStudentsParams,
  type GetEnrolledStudentsResponse,
} from '../api/instructor';

// Query keys
const INSTRUCTOR_KEY = 'instructor';

// Hook to get instructor stats
export const useInstructorStats = () => {
  return useQuery<InstructorStats>({
    queryKey: [INSTRUCTOR_KEY, 'stats'],
    queryFn: () => instructorApi.getStats(),
    refetchInterval: 60000, // Refetch every minute
  });
};

// Hook to get course analytics
export const useCourseAnalytics = () => {
  return useQuery<{ data: CourseAnalytics[] }>({
    queryKey: [INSTRUCTOR_KEY, 'analytics'],
    queryFn: () => instructorApi.getCourseAnalytics(),
    refetchInterval: 60000,
  });
};

// Hook to get revenue chart data
export const useInstructorRevenueChart = (params?: { days?: number; startDate?: string; endDate?: string }) => {
  return useQuery<RevenueChartData>({
    queryKey: [INSTRUCTOR_KEY, 'revenue-chart', params],
    queryFn: () => instructorApi.getRevenueChartData(params || { days: 30 }),
  });
};

// Hook to get enrolled students
export const useEnrolledStudents = (params?: GetEnrolledStudentsParams) => {
  return useQuery<GetEnrolledStudentsResponse>({
    queryKey: [INSTRUCTOR_KEY, 'students', params],
    queryFn: () => instructorApi.getEnrolledStudents(params),
  });
};

