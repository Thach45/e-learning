import { useState } from 'react';
import { Shield, Plus, Edit, Trash2, Users, Lock } from 'lucide-react';

const AdminPermissionsPage = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');

  const mockRoles = [
    { id: '1', name: 'ADMIN', description: 'Quyền quản trị viên', isActive: true, userCount: 5 },
    { id: '2', name: 'INSTRUCTOR', description: 'Quyền giảng viên', isActive: true, userCount: 45 },
    { id: '3', name: 'CLIENT', description: 'Quyền học viên', isActive: true, userCount: 12450 },
  ];

  const mockPermissions = [
    { id: '1', name: 'Quản lý người dùng', path: '/admin/users', method: 'GET', description: 'Xem danh sách người dùng' },
    { id: '2', name: 'Tạo khóa học', path: '/instructor/courses', method: 'POST', description: 'Tạo khóa học mới' },
    { id: '3', name: 'Xóa khóa học', path: '/admin/courses', method: 'DELETE', description: 'Xóa khóa học' },
    { id: '4', name: 'Quản lý đơn hàng', path: '/admin/orders', method: 'GET', description: 'Xem và quản lý đơn hàng' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý phân quyền</h1>
          <p className="text-slate-500 mt-1">Quản lý Role và Permission theo RBAC</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors flex items-center gap-2">
          <Plus size={18} />
          {activeTab === 'roles' ? 'Thêm Role' : 'Thêm Permission'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} />
            Roles ({mockRoles.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === 'permissions'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock size={18} />
            Permissions ({mockPermissions.length})
          </div>
        </button>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Mô tả</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Số người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-indigo-600" />
                        <span className="font-semibold text-slate-800">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{role.description}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{role.userCount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        role.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-50 text-slate-700'
                      }`}>
                        {role.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
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
      )}

      {/* Permissions Tab */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Permission</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Path</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Mô tả</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockPermissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{permission.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">{permission.path}</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        permission.method === 'GET' ? 'bg-blue-50 text-blue-700' :
                        permission.method === 'POST' ? 'bg-emerald-50 text-emerald-700' :
                        permission.method === 'PUT' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {permission.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{permission.description}</td>
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
      )}
    </div>
  );
};

export default AdminPermissionsPage;

