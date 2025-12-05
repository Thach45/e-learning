import { BookOpen, Users, DollarSign, TrendingUp, Star, Clock } from 'lucide-react';

const InstructorDashboard = () => {
  const stats = [
    { 
      label: 'Tổng khóa học', 
      value: '12', 
      change: '+2 mới', 
      icon: BookOpen, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Tổng học viên', 
      value: '1,234', 
      change: '+156 mới', 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Doanh thu', 
      value: '245 triệu', 
      change: '+18.5%', 
      icon: DollarSign, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Đánh giá trung bình', 
      value: '4.8', 
      change: '+0.2', 
      icon: Star, 
      color: 'bg-amber-500' 
    },
  ];

  const recentCourses = [
    { 
      id: '1', 
      title: 'Full Stack Web Development 2025', 
      students: 1200, 
      revenue: 359000000, 
      rating: 4.9,
      status: 'PUBLISHED'
    },
    { 
      id: '2', 
      title: 'UI/UX Design Masterclass', 
      students: 850, 
      revenue: 297500000, 
      rating: 4.8,
      status: 'PUBLISHED'
    },
    { 
      id: '3', 
      title: 'Advanced React Patterns', 
      students: 0, 
      revenue: 0, 
      rating: 0,
      status: 'DRAFT'
    },
  ];

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard Giảng viên</h1>
        <p className="text-slate-500 mt-1">Tổng quan khóa học và học viên của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Khóa học của tôi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Học viên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Đánh giá</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{course.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{course.students.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">
                      {course.revenue > 0 ? formatVND(course.revenue) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {course.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-800">{course.rating}</span>
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                      </div>
                    ) : (
                      <span className="text-slate-400">Chưa có</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      course.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-50 text-slate-700'
                    }`}>
                      {course.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

