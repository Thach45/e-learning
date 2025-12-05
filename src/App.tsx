import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyCoursesPage from './pages/MyCoursesPage';
import InstructorPage from './pages/InstructorPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import './App.css';

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
          <Route path="instructor" element={<InstructorPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          {/* Add Auth routes later */}
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
