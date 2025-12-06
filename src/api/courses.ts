import apiClient from './axios';

// Types
export type Course = {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  thumbnail?: string;
  introVideo?: string;
  isFeatured: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_PUBLISHED' | 'PENDING_DRAFT';
  instructorId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  instructor?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  totalStars?: number;
  reviewsCount?: number;
  totalLearners?: number;
  totalLikes?: number;
  totalLessons?: number;
  totalDuration?: number; // in seconds
};

export type CourseDetail = {
  id: string;
  courseId: string;
  description?: string;
  content?: string;
  objectives?: string;
  requirements?: string;
  targetAudience?: string;
  benefits?: string;
  relatedCourses: string[];
};

export type CourseWithDetail = Course & {
  courseDetail?: CourseDetail;
};

export type CourseListParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status?: string;
  isFeatured?: boolean;
};

export type CourseListResponse = {
  data: CourseWithDetail[];
  total: number;
  page: number;
  limit: number;
};

// Courses API functions
export const coursesApi = {
  // Get all courses
  getCourses: async (params?: CourseListParams): Promise<CourseListResponse> => {
    const response = await apiClient.get('/courses', { params });
    return response.data.data;
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<CourseWithDetail> => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data.data;
  },

  // Create course (Instructor)
  createCourse: async (body: Partial<Course>): Promise<Course> => {
    const response = await apiClient.post('/courses', body);
    return response.data.data;
  },

  // Update course (Instructor)
  updateCourse: async (id: string, body: Partial<Course>): Promise<Course> => {
    const response = await apiClient.put(`/courses/${id}`, body);
    return response.data.data;
  },

  // Delete course (Instructor/Admin)
  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },
};

