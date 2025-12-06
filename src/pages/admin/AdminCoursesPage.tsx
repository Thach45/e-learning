import { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const AdminCoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockCourses = [
    { 
      id: '1', 
      title: 'Full Stack Web Development 2025', 
      instructor: 'Nguyễn Văn A', 
      status: 'PUBLISHED', 
      price: 299000,
      students: 1200,
      createdAt: '2025-01-15'
    },
    { 
      id: '2', 
      title: 'UI/UX Design Masterclass', 
      instructor: 'Trần Thị B', 
      status: 'DRAFT', 
      price: 350000,
      students: 850,
      createdAt: '2025-02-20'
    },
    { 
      id: '3', 
      title: 'Python & AI cho người mới bắt đầu', 
      instructor: 'Lê Hoàng C', 
      status: 'PUBLISHED', 
      price: 499000,
      students: 3200,
      createdAt: '2025-03-10'
    },
    { 
      id: '4', 
      title: 'Digital Marketing Thực Chiến', 
      instructor: 'Phạm Minh D', 
      status: 'PENDING_PUBLISHED', 
      price: 0,
      students: 2100,
      createdAt: '2025-04-05'
    },
  ];

  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      PUBLISHED: { label: 'Đã xuất bản', color: 'bg-emerald-50 text-emerald-700' },
      DRAFT: { label: 'Bản nháp', color: 'bg-slate-50 text-slate-700' },
      PENDING_PUBLISHED: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700' },
      ARCHIVED: { label: 'Đã lưu trữ', color: 'bg-rose-50 text-rose-700' },
    };
    return map[status] || { label: status, color: 'bg-slate-50 text-slate-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý khóa học</h1>
          <p className="text-slate-500 mt-1">Quản lý tất cả khóa học trong hệ thống</p>
        </div>
       
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học hoặc giảng viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
          />
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <Filter size={16} />
          Lọc
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Giảng viên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Học viên</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((course) => {
                const statusBadge = getStatusBadge(course.status);
                return (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{course.title}</p>
                      <p className="text-sm text-slate-500 mt-1">ID: {course.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.instructor}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {course.price > 0 ? formatVND(course.price) : 'Miễn phí'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{course.students.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesPage;

