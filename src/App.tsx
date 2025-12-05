import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import InstructorStudentsPage from './pages/instructor/InstructorStudentsPage';
import InstructorReviewsPage from './pages/instructor/InstructorReviewsPage';
import InstructorAnalyticsPage from './pages/instructor/InstructorAnalyticsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import './App.css';
import LearningPage from './pages/LearningSection';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetailPage />} />
          <Route path="my-courses" element={<MyCoursesPage />} />
          <Route path="account/orders" element={<MyOrdersPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="learn/course/:courseId" element={<LearningPage />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="google/callback" element={<GoogleCallbackPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="enrollments" element={<AdminEnrollmentsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="permissions" element={<AdminPermissionsPage />} />
        </Route>
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCoursesPage />} />
          <Route path="students" element={<InstructorStudentsPage />} />
          <Route path="reviews" element={<InstructorReviewsPage />} />
          <Route path="analytics" element={<InstructorAnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
