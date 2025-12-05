import { useState } from 'react';
import { Search, Plus, Edit, Trash2, FolderTree } from 'lucide-react';

const AdminCategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockCategories = [
    { id: '1', name: 'Lập trình', parentId: null, courseCount: 120, isActive: true, createdAt: '2025-01-15' },
    { id: '2', name: 'Frontend Development', parentId: '1', courseCount: 45, isActive: true, createdAt: '2025-02-20' },
    { id: '3', name: 'Backend Development', parentId: '1', courseCount: 35, isActive: true, createdAt: '2025-02-20' },
    { id: '4', name: 'Thiết kế', parentId: null, courseCount: 64, isActive: true, createdAt: '2025-03-10' },
    { id: '5', name: 'UI/UX Design', parentId: '4', courseCount: 28, isActive: true, createdAt: '2025-03-15' },
  ];

  const filteredCategories = mockCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getParentName = (parentId: string | null) => {
    if (!parentId) return null;
    return mockCategories.find(c => c.id === parentId)?.name || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý danh mục</h1>
          <p className="text-slate-500 mt-1">Quản lý danh mục khóa học (hỗ trợ danh mục con)</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 transition-colors flex items-center gap-2">
          <Plus size={18} />
          Thêm danh mục
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Danh mục cha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Số khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày tạo</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((category) => {
                const parentName = getParentName(category.parentId);
                return (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FolderTree size={20} className="text-indigo-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{category.name}</p>
                          <p className="text-xs text-slate-500">ID: {category.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {parentName ? (
                        <span className="text-sm text-slate-600">{parentName}</span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Danh mục gốc</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{category.courseCount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        category.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-50 text-slate-700'
                      }`}>
                        {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{category.createdAt}</td>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

