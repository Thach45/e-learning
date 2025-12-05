import { useState } from 'react';
import { Search, Plus, Edit, Trash2, FileText, Users, DollarSign, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorCoursesPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const mockCourses = [
    { 
      id: '1', 
      title: 'Full Stack Web Development 2025', 
      status: 'PUBLISHED', 
      price: 299000,
      students: 1200,
      lessons: 45,
      createdAt: '2025-01-15'
    },
    { 
      id: '2', 
      title: 'UI/UX Design Masterclass', 
      status: 'DRAFT', 
      price: 350000,
      students: 0,
      lessons: 32,
      createdAt: '2025-02-20'
    },
    { 
      id: '3', 
      title: 'Advanced React Patterns', 
      status: 'PENDING_PUBLISHED', 
      price: 499000,
      students: 0,
      lessons: 28,
      createdAt: '2025-03-10'
    },
  ];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || course.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-3xl font-bold text-slate-800">Khóa học của tôi</h1>
          <p className="text-slate-500 mt-1">Quản lý tất cả khóa học bạn đã tạo</p>
        </div>
        <Link 
          to="/instructor/courses/new"
          className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Tạo khóa học mới
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'PUBLISHED', 'DRAFT', 'PENDING_PUBLISHED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                selectedStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? 'Tất cả' : 
               status === 'PUBLISHED' ? 'Đã xuất bản' : 
               status === 'DRAFT' ? 'Bản nháp' : 'Chờ duyệt'}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const statusBadge = getStatusBadge(course.status);
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-2 flex-1">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color} ml-2`}>
                  {statusBadge.label}
                </span>
              </div>
              
              <div className="space-y-2 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{course.students.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play size={16} />
                  <span>{course.lessons} bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span className="font-semibold text-slate-800">{formatVND(course.price)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <Link
                  to={`/instructor/courses/${course.id}/content`}
                  className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 font-semibold rounded-lg hover:bg-purple-100 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  Nội dung
                </Link>
                <button className="px-3 py-2 bg-slate-50 text-slate-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
                  <Edit size={16} />
                </button>
                <button className="px-3 py-2 bg-slate-50 text-slate-600 font-semibold rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstructorCoursesPage;

