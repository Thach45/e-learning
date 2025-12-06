import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorStudentsApi, type GetInstructorStudentsParams } from '../api/instructorStudents';

// Get instructor students
export const useInstructorStudents = (params?: GetInstructorStudentsParams) => {
  return useQuery({
    queryKey: ['instructor', 'students', params],
    queryFn: () => instructorStudentsApi.getStudents(params),
  });
};

// Remove student mutation
export const useRemoveStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (enrollmentId: string) => instructorStudentsApi.removeStudent(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'students'] });
    },
  });
};

// Add student to course mutation
export const useAddStudentToCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) => 
      instructorStudentsApi.addStudentToCourse(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'students'] });
    },
  });
};

