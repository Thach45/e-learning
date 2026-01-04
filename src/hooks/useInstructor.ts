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
export const useInstructorRevenueChart = (days = 30) => {
  return useQuery<RevenueChartData>({
    queryKey: [INSTRUCTOR_KEY, 'revenue-chart', days],
    queryFn: () => instructorApi.getRevenueChartData(days),
  });
};

// Hook to get enrolled students
export const useEnrolledStudents = (params?: GetEnrolledStudentsParams) => {
  return useQuery<GetEnrolledStudentsResponse>({
    queryKey: [INSTRUCTOR_KEY, 'students', params],
    queryFn: () => instructorApi.getEnrolledStudents(params),
  });
};

