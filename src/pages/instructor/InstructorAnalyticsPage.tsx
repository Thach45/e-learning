import { TrendingUp, DollarSign, Users, BookOpen, BarChart3, Star } from 'lucide-react';

const InstructorAnalyticsPage = () => {
  const revenueData = [
    { month: 'Tháng 1', revenue: 45000000 },
    { month: 'Tháng 2', revenue: 52000000 },
    { month: 'Tháng 3', revenue: 48000000 },
    { month: 'Tháng 4', revenue: 61000000 },
    { month: 'Tháng 5', revenue: 55000000 },
    { month: 'Tháng 6', revenue: 68000000 },
  ];

  const topCourses = [
    { title: 'Full Stack Web Development 2025', students: 1200, revenue: 359000000, rating: 4.9 },
    { title: 'UI/UX Design Masterclass', students: 850, revenue: 297500000, rating: 4.8 },
    { title: 'Advanced React Patterns', students: 320, revenue: 159680000, rating: 4.7 },
  ];

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Thống kê & Phân tích</h1>
        <p className="text-slate-500 mt-1">Theo dõi doanh thu và hiệu suất khóa học</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
              <DollarSign size={24} />
            </div>
            <span className="text-sm font-semibold text-emerald-600">+18.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">329 triệu</h3>
          <p className="text-sm text-slate-500">Tổng doanh thu</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <span className="text-sm font-semibold text-emerald-600">+156</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">2,370</h3>
          <p className="text-sm text-slate-500">Tổng học viên</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <BookOpen size={24} />
            </div>
            <span className="text-sm font-semibold text-emerald-600">+2</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">12</h3>
          <p className="text-sm text-slate-500">Khóa học</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white">
              <TrendingUp size={24} />
            </div>
            <span className="text-sm font-semibold text-emerald-600">+0.2</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-1">4.8</h3>
          <p className="text-sm text-slate-500">Đánh giá TB</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Doanh thu theo tháng</h2>
          <BarChart3 size={20} className="text-slate-400" />
        </div>
        <div className="space-y-4">
          {revenueData.map((data) => (
            <div key={data.month} className="flex items-center gap-4">
              <div className="w-24 text-sm font-semibold text-slate-600">{data.month}</div>
              <div className="flex-1 bg-slate-100 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full flex items-center justify-end pr-3 transition-all"
                  style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                >
                  <span className="text-xs font-bold text-white">{formatVND(data.revenue)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Khóa học bán chạy nhất</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Học viên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCourses.map((course, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{course.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{course.students.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">{formatVND(course.revenue)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-800">{course.rating}</span>
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                    </div>
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

export default InstructorAnalyticsPage;

