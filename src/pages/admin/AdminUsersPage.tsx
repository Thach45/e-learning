import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'CLIENT', status: 'ACTIVE', createdAt: '2025-01-15' },
    { id: '2', name: 'Trần Thị B', email: 'tranthib@example.com', role: 'INSTRUCTOR', status: 'ACTIVE', createdAt: '2025-02-20' },
    { id: '3', name: 'Lê Hoàng C', email: 'lehoangc@example.com', role: 'CLIENT', status: 'BLOCKED', createdAt: '2025-03-10' },
    { id: '4', name: 'Phạm Minh D', email: 'phamminhd@example.com', role: 'CLIENT', status: 'ACTIVE', createdAt: '2025-04-05' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý người dùng</h1>
          <p className="text-slate-500 mt-1">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors">
          Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
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

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-50 text-purple-700'
                        : user.role === 'INSTRUCTOR'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-50 text-slate-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : user.status === 'BLOCKED'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'BLOCKED' ? 'Bị khóa' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
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

export default AdminUsersPage;

