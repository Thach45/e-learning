import { Users, BookOpen, ShoppingCart, GraduationCap, TrendingUp, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { 
      label: 'Tổng người dùng', 
      value: '12,450', 
      change: '+12.5%', 
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      label: 'Khóa học', 
      value: '1,234', 
      change: '+8.2%', 
      icon: BookOpen, 
      color: 'bg-purple-500' 
    },
    { 
      label: 'Đơn hàng', 
      value: '3,456', 
      change: '+15.3%', 
      icon: ShoppingCart, 
      color: 'bg-emerald-500' 
    },
    { 
      label: 'Ghi danh', 
      value: '8,901', 
      change: '+22.1%', 
      icon: GraduationCap, 
      color: 'bg-amber-500' 
    },
    { 
      label: 'Doanh thu', 
      value: '2.5 tỷ VNĐ', 
      change: '+18.7%', 
      icon: DollarSign, 
      color: 'bg-indigo-500' 
    },
    { 
      label: 'Tăng trưởng', 
      value: '24.3%', 
      change: '+5.2%', 
      icon: TrendingUp, 
      color: 'bg-rose-500' 
    },
  ];

  const recentOrders = [
    { id: 'ORD-001', user: 'Nguyễn Văn A', course: 'Full Stack Web Dev', amount: 299000, status: 'PAID', date: '2025-12-05' },
    { id: 'ORD-002', user: 'Trần Thị B', course: 'UI/UX Design', amount: 350000, status: 'PENDING', date: '2025-12-05' },
    { id: 'ORD-003', user: 'Lê Hoàng C', course: 'Python & AI', amount: 499000, status: 'PAID', date: '2025-12-04' },
  ];

  const formatVND = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Tổng quan hệ thống E-Learning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Đơn hàng gần đây</h2>
        </div>
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.user}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.course}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{formatVND(order.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'PAID' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status === 'PAID' ? 'Đã thanh toán' : 'Chờ xử lý'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

