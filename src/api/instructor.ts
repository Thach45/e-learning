import apiClient from './axios';

// Types
export type InstructorStats = {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  totalStudents: number;
  totalReviews: number;
};

export type CourseAnalytics = {
  courseId: string;
  title: string;
  enrollments: number;
  revenue: number;
  views: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
};

export type RevenueChartDataPoint = {
  date: string;
  revenue: number;
  enrollments: number;
};

export type RevenueChartData = {
  data: RevenueChartDataPoint[];
};

export type EnrolledStudent = {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progress?: number;
  completedAt?: string;
};

export type GetEnrolledStudentsParams = {
  page?: number;
  limit?: number;
  courseId?: string;
  search?: string;
};

export type GetEnrolledStudentsResponse = {
  data: EnrolledStudent[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Instructor Courses Types
export type Course = {
  id: string;
  title: string;
  price: number;
  salePrice?: number | null;
  thumbnail?: string | null;
  introVideo?: string | null;
  isFeatured: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_PUBLISHED' | 'PENDING_DRAFT';
  instructorId: string;
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
  instructor?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  } | null;
  totalStars?: number;
  reviewsCount?: number;
  totalLearners?: number;
  totalLikes?: number;
  totalLessons?: number;
  totalDuration?: number; // in seconds
};

export type CourseWithDetail = Course & {
  courseDetail?: {
    id: string;
    courseId: string;
    description?: string | null;
    content?: string | null;
    objectives?: string | null;
    requirements?: string | null;
    targetAudience?: string | null;
    benefits?: string | null;
    relatedCourses: string[];
  };
};

export type GetInstructorCoursesParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_PUBLISHED' | 'PENDING_DRAFT';
  isFeatured?: boolean;
};

export type GetInstructorCoursesResponse = {
  data: CourseWithDetail[];
  total: number;
  page: number;
  limit: number;
};

export type CreateCourseBody = {
  title: string;
  price?: number;
  salePrice?: number;
  thumbnail?: string;
  introVideo?: string;
  isFeatured?: boolean;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_PUBLISHED' | 'PENDING_DRAFT';
  categoryId?: string;
};

export type UpdateCourseBody = {
  title?: string;
  price?: number;
  salePrice?: number | null;
  thumbnail?: string | null;
  introVideo?: string | null;
  isFeatured?: boolean;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  categoryId?: string | null;
};

// API functions
export const instructorApi = {
  getStats: async (): Promise<InstructorStats> => {
    const response = await apiClient.get('/instructor/dashboard/stats');
    return response.data.data || response.data;
  },

  getCourseAnalytics: async (): Promise<{ data: CourseAnalytics[] }> => {
    const response = await apiClient.get('/instructor/analytics/courses');
    return response.data.data || response.data;
  },

  getRevenueChartData: async (days = 30): Promise<RevenueChartData> => {
    const response = await apiClient.get('/instructor/revenue/chart', {
      params: { days },
    });
    return response.data.data || response.data;
  },

  getEnrolledStudents: async (params?: GetEnrolledStudentsParams): Promise<GetEnrolledStudentsResponse> => {
    const response = await apiClient.get('/instructor/students', { params });
    return response.data.data || response.data;
  },
};

// Instructor Courses API
export const instructorCoursesApi = {
  getCourses: async (params?: GetInstructorCoursesParams): Promise<GetInstructorCoursesResponse> => {
    const response = await apiClient.get('/instructor/courses', { params });
    return response.data.data || response.data;
  },

  getCourseById: async (id: string): Promise<CourseWithDetail> => {
    const response = await apiClient.get(`/instructor/courses/${id}`);
    return response.data.data || response.data;
  },

  createCourse: async (body: CreateCourseBody): Promise<CourseWithDetail> => {
    const response = await apiClient.post('/instructor/courses', body);
    return response.data.data || response.data;
  },

  updateCourse: async (id: string, body: UpdateCourseBody): Promise<CourseWithDetail> => {
    const response = await apiClient.put(`/instructor/courses/${id}`, body);
    return response.data.data || response.data;
  },

  deleteCourse: async (id: string): Promise<void> => {
    await apiClient.delete(`/instructor/courses/${id}`);
  },

  requestApproval: async (id: string): Promise<CourseWithDetail> => {
    const response = await apiClient.post(`/instructor/courses/${id}/request-approval`);
    return response.data.data || response.data;
  },

  requestDelete: async (id: string): Promise<CourseWithDetail> => {
    const response = await apiClient.post(`/instructor/courses/${id}/request-delete`);
    return response.data.data || response.data;
  },
};
