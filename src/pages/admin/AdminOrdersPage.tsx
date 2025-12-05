import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

const AdminOrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const mockOrders = [
    { id: 'ORD-001', user: 'Nguyễn Văn A', course: 'Full Stack Web Dev', amount: 299000, status: 'PAID', date: '2025-12-05' },
    { id: 'ORD-002', user: 'Trần Thị B', course: 'UI/UX Design', amount: 350000, status: 'PENDING', date: '2025-12-05' },
    { id: 'ORD-003', user: 'Lê Hoàng C', course: 'Python & AI', amount: 499000, status: 'PAID', date: '2025-12-04' },
    { id: 'ORD-004', user: 'Phạm Minh D', course: 'Digital Marketing', amount: 0, status: 'FAILED', date: '2025-12-03' },
  ];

  const filteredOrders = selectedStatus === 'ALL' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedStatus);

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      PAID: { label: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700' },
      PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700' },
      FAILED: { label: 'Thất bại', color: 'bg-rose-50 text-rose-700' },
    };
    return map[status] || { label: status, color: 'bg-slate-50 text-slate-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý đơn hàng</h1>
          <p className="text-slate-500 mt-1">Theo dõi và quản lý tất cả đơn hàng</p>
        </div>
        <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <Download size={16} />
          Xuất Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex gap-2">
          {['ALL', 'PAID', 'PENDING', 'FAILED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                selectedStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? 'Tất cả' : status === 'PAID' ? 'Đã thanh toán' : status === 'PENDING' ? 'Chờ xử lý' : 'Thất bại'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Khóa học</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Số tiền</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.user}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.course}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {order.amount > 0 ? formatVND(order.amount) : 'Miễn phí'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
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

export default AdminOrdersPage;

