import { useState } from 'react';
import { Search, Filter, GraduationCap } from 'lucide-react';

const AdminEnrollmentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockEnrollments = [
    { 
      id: '1', 
      userName: 'Nguyễn Văn A', 
      userEmail: 'nguyenvana@example.com',
      courseTitle: 'Full Stack Web Development 2025', 
      enrolledAt: '2025-12-01 10:30',
      completedAt: null,
      progress: 45
    },
    { 
      id: '2', 
      userName: 'Trần Thị B', 
      userEmail: 'tranthib@example.com',
      courseTitle: 'UI/UX Design Masterclass', 
      enrolledAt: '2025-11-15 09:12',
      completedAt: '2025-12-05 14:30',
      progress: 100
    },
    { 
      id: '3', 
      userName: 'Lê Hoàng C', 
      userEmail: 'lehoangc@example.com',
      courseTitle: 'Python & AI cho người mới bắt đầu', 
      enrolledAt: '2025-11-01 14:55',
      completedAt: null,
      progress: 78
    },
  ];

  const filteredEnrollments = mockEnrollments.filter(enrollment => 
    enrollment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý ghi danh</h1>
          <p className="text-slate-500 mt-1">Theo dõi tất cả ghi danh và tiến độ học tập</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Học viên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày ghi danh</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tiến độ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{enrollment.userName}</p>
                      <p className="text-sm text-slate-500">{enrollment.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{enrollment.courseTitle}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{enrollment.enrolledAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 w-12 text-right">{enrollment.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {enrollment.completedAt ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        Đang học
                      </span>
                    )}
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

export default AdminEnrollmentsPage;

