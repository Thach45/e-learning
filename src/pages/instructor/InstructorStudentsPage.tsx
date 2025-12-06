import { useState } from 'react';
import { Search, Mail, Calendar, Loader2, AlertCircle, Trash2, Plus, X } from 'lucide-react';
import { useInstructorStudents, useRemoveStudent, useAddStudentToCourse } from '../../hooks/useInstructorStudents';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { useInstructorCourses } from '../../hooks/useInstructorCourses';
import type { AdminUser } from '../../api/admin';

const InstructorStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const { data, isLoading, error } = useInstructorStudents({
    search: searchTerm || undefined,
    limit: 50,
  });

  const removeStudentMutation = useRemoveStudent();
  const addStudentMutation = useAddStudentToCourse();

  // Fetch users for search
  const { data: usersData } = useAdminUsers({
    search: userSearchTerm || undefined,
    limit: 10,
    role: 'CLIENT',
  });

  // Fetch instructor courses
  const { data: coursesData } = useInstructorCourses({
    limit: 100,
  });

  const students = data?.data || [];
  const users = usersData?.data || [];
  const courses = coursesData?.data || [];

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

  const handleAddStudent = () => {
    if (!selectedUserId || !selectedCourseId) {
      alert('Vui lòng chọn học viên và khóa học');
      return;
    }

    addStudentMutation.mutate(
      { courseId: selectedCourseId, userId: selectedUserId },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setSelectedUserId('');
          setSelectedCourseId('');
          setUserSearchTerm('');
        },
        onError: (error: any) => {
          alert(error?.response?.data?.message || 'Có lỗi xảy ra khi thêm học viên');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Học viên của tôi</h1>
          <p className="text-slate-500 mt-1">Quản lý học viên đã ghi danh vào khóa học của bạn</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus size={18} />
          Thêm học viên
        </button>
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

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Thêm học viên vào khóa học</h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setSelectedUserId('');
                  setSelectedCourseId('');
                  setUserSearchTerm('');
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Chọn khóa học <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none"
                >
                  <option value="">-- Chọn khóa học --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Search */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tìm kiếm học viên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:bg-white outline-none"
                  />
                </div>

                {/* User List */}
                {userSearchTerm && (
                  <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                    {users.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">
                        Không tìm thấy học viên
                      </div>
                    ) : (
                      users.map((user: AdminUser) => (
                        <button
                          key={user.id}
                          onClick={() => setSelectedUserId(user.id)}
                          className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${
                            selectedUserId === user.id ? 'bg-purple-50 border-purple-200' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {user.avatar && (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-semibold text-slate-800">{user.name}</p>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Selected User Display */}
                {selectedUserId && (
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-sm font-medium text-purple-800">
                      Đã chọn: {users.find((u: AdminUser) => u.id === selectedUserId)?.name || 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setSelectedUserId('');
                    setSelectedCourseId('');
                    setUserSearchTerm('');
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddStudent}
                  disabled={!selectedUserId || !selectedCourseId || addStudentMutation.isPending}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {addStudentMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                  Thêm học viên
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudentsPage;

