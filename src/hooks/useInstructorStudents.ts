import { useQuery } from '@tanstack/react-query';
import { instructorStudentsApi, type GetInstructorStudentsParams } from '../api/instructorStudents';

// Get instructor students
export const useInstructorStudents = (params?: GetInstructorStudentsParams) => {
  return useQuery({
    queryKey: ['instructor', 'students', params],
    queryFn: () => instructorStudentsApi.getStudents(params),
  });
};

