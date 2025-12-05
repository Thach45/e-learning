import { useState } from 'react';
import { Search, Mail, Calendar } from 'lucide-react';

const InstructorStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockStudents = [
    { 
      id: '1', 
      name: 'Nguyễn Văn A', 
      email: 'nguyenvana@example.com',
      courseTitle: 'Full Stack Web Development 2025', 
      enrolledAt: '2025-12-01',
      progress: 45,
      lastAccessed: '2025-12-05'
    },
    { 
      id: '2', 
      name: 'Trần Thị B', 
      email: 'tranthib@example.com',
      courseTitle: 'UI/UX Design Masterclass', 
      enrolledAt: '2025-11-15',
      progress: 100,
      lastAccessed: '2025-12-05'
    },
    { 
      id: '3', 
      name: 'Lê Hoàng C', 
      email: 'lehoangc@example.com',
      courseTitle: 'Full Stack Web Development 2025', 
      enrolledAt: '2025-11-01',
      progress: 78,
      lastAccessed: '2025-12-04'
    },
  ];

  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Học viên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày ghi danh</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tiến độ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Truy cập gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                        <Mail size={14} />
                        {student.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{student.courseTitle}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Calendar size={14} />
                      {student.enrolledAt}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-800 w-12 text-right">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{student.lastAccessed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorStudentsPage;

