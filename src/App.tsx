import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import InstructorLayout from './layouts/InstructorLayout';
import AuthLayout from './layouts/AuthLayout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminEnrollmentsPage from './pages/admin/AdminEnrollmentsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPermissionsPage from './pages/admin/AdminPermissionsPage';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCoursesPage from './pages/instructor/InstructorCoursesPage';
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import EditCoursePage from './pages/instructor/EditCoursePage';
import CourseContentPage from './pages/instructor/CourseContentPage';
import InstructorStudentsPage from './pages/instructor/InstructorStudentsPage';
import InstructorReviewsPage from './pages/instructor/InstructorReviewsPage';
import InstructorAnalyticsPage from './pages/instructor/InstructorAnalyticsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { navigationUtils } from './utils/navigation';
import './App.css';
import LearningPage from './pages/LearningSection';

// Component để setup navigation
const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigationUtils.setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          
          {/* Protected routes - require authentication */}
          <Route
            path="my-courses"
            element={
              <ProtectedRoute>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="account/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="learn/course/:courseId"
            element={
              <ProtectedRoute>
                <LearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="learn/course/:courseId/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LearningPage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Google OAuth callback - route ở root level để match với backend redirect */}
        <Route path="/google/callback" element={<GoogleCallbackPage />} />
        
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        {/* Admin routes - require ADMIN role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="enrollments" element={<AdminEnrollmentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="permissions" element={<AdminPermissionsPage />} />
        </Route>
        {/* Instructor routes - require INSTRUCTOR role */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCoursesPage />} />
          <Route path="courses/new" element={<CreateCoursePage />} />
          <Route path="courses/:id/edit" element={<EditCoursePage />} />
          <Route path="courses/:id/content" element={<CourseContentPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="students" element={<InstructorStudentsPage />} />
          <Route path="reviews" element={<InstructorReviewsPage />} />
          <Route path="analytics" element={<InstructorAnalyticsPage />} />
        </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
