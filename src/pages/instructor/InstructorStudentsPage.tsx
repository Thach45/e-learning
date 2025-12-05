import { useState } from 'react';
import { Search, Mail, Calendar, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useInstructorStudents, useRemoveStudent } from '../../hooks/useInstructorStudents';

const InstructorStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useInstructorStudents({
    search: searchTerm || undefined,
    limit: 50,
  });

  const removeStudentMutation = useRemoveStudent();

  const students = data?.data || [];

  const handleRemoveStudent = (enrollmentId: string, studentName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học viên "${studentName}" khỏi khóa học này?`)) {
      removeStudentMutation.mutate(enrollmentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Học viên của tôi</h1>
        <p className="text-slate-500 mt-1">Quản lý học viên đã ghi danh vào khóa học của bạn</p>
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
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-3">
          <AlertCircle className="text-rose-600" size={24} />
          <div>
            <p className="font-semibold text-rose-800">Có lỗi xảy ra</p>
            <p className="text-sm text-rose-600">Không thể tải danh sách học viên. Vui lòng thử lại.</p>
          </div>
        </div>
      )}

      {/* Students Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {students.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">Chưa có học viên nào đăng ký khóa học của bạn.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Học viên</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày ghi danh</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tiến độ</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Truy cập gần nhất</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {student.user?.avatar && (
                            <img 
                              src={student.user.avatar} 
                              alt={student.user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-slate-800">{student.user?.name || 'N/A'}</p>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                              <Mail size={14} />
                              {student.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 font-medium">{student.course?.title || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar size={14} />
                          {formatDate(student.enrolledAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 min-w-[100px]">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                (student.progress || 0) === 100 ? 'bg-emerald-600' : 'bg-purple-600'
                              }`}
                              style={{ width: `${student.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-800 w-12 text-right">
                            {student.progress || 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {student.lastAccessed ? formatDate(student.lastAccessed) : formatDate(student.enrolledAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemoveStudent(student.id, student.user?.name || '')}
                          disabled={removeStudentMutation.isPending}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Xóa học viên khỏi khóa học"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination Info */}
      {!isLoading && !error && data && data.totalPages > 1 && (
        <div className="text-center text-sm text-slate-500">
          Trang {data.page} / {data.totalPages} • Tổng {data.total} học viên
        </div>
      )}
    </div>
  );
};

export default InstructorStudentsPage;

