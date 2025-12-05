import apiClient from './axios';

// Types
export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_PUBLISHED' | 'PENDING_DRAFT';

export type InstructorCourse = {
  id: string;
  title: string;
  price: number;
  salePrice?: number | null;
  thumbnail?: string | null;
  introVideo?: string | null;
  isFeatured: boolean;
  level: CourseLevel;
  status: CourseStatus;
  instructorId: string;
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
  instructor?: { id: string; name: string };
  category?: { id: string; name: string } | null;
  totalStars?: number;
  totalLearners?: number;
  totalLikes?: number;
};

export type GetInstructorCoursesParams = {
  page?: number;
  limit?: number;
  search?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  categoryId?: string;
};

export type GetInstructorCoursesResponse = {
  data: InstructorCourse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CreateCourseBody = {
  title: string;
  price: number;
  salePrice?: number;
  thumbnail?: string;
  introVideo?: string;
  isFeatured?: boolean;
  level: CourseLevel;
  status?: CourseStatus;
  categoryId?: string;
};

export type UpdateCourseBody = {
  title?: string;
  price?: number;
  salePrice?: number | null;
  thumbnail?: string | null;
  introVideo?: string | null;
  isFeatured?: boolean;
  level?: CourseLevel;
  categoryId?: string | null;
};

// Instructor Courses API functions
export const instructorCoursesApi = {
  // Get instructor's courses
  getCourses: async (params?: GetInstructorCoursesParams): Promise<GetInstructorCoursesResponse> => {
    const response = await apiClient.get('/instructor/courses', { params });
    return response.data.data;
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<InstructorCourse> => {
    const response = await apiClient.get(`/instructor/courses/${id}`);
    return response.data.data;
  },

  // Create course
  createCourse: async (body: CreateCourseBody): Promise<InstructorCourse> => {
    const response = await apiClient.post('/instructor/courses', body);
    return response.data.data;
  },

  // Update course
  updateCourse: async (id: string, body: UpdateCourseBody): Promise<InstructorCourse> => {
    const response = await apiClient.put(`/instructor/courses/${id}`, body);
    return response.data.data;
  },

  // Delete course
  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/instructor/courses/${id}`);
  },

  // Request approval (change status to PENDING_PUBLISHED)
  requestApproval: async (id: string): Promise<InstructorCourse> => {
    const response = await apiClient.post(`/instructor/courses/${id}/request-approval`);
    return response.data.data;
  },

  // Request delete
  requestDelete: async (id: string): Promise<InstructorCourse> => {
    const response = await apiClient.post(`/instructor/courses/${id}/request-delete`);
    return response.data.data;
  },
};

