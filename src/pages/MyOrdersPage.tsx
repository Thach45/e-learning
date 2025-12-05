import { useMemo, useState } from 'react';
import { BadgeCheck, Clock, XCircle, Receipt, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';

type OrderStatus = 'PENDING' | 'PAID' | 'FAILED';

type OrderItem = {
  title: string;
  price: number;
  thumbnail: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
};

const mockOrders: Order[] = [
  {
    id: 'ORD-2025-001',
    createdAt: '2025-12-01 10:30',
    status: 'PAID',
    totalAmount: 499000,
    items: [
      { title: 'Python & AI cho người mới bắt đầu', price: 499000, thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'ORD-2025-002',
    createdAt: '2025-11-15 09:12',
    status: 'PENDING',
    totalAmount: 299000,
    items: [
      { title: 'Full Stack Web Development 2025', price: 299000, thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=400&q=80' },
    ],
  },
  {
    id: 'ORD-2025-003',
    createdAt: '2025-11-01 14:55',
    status: 'FAILED',
    totalAmount: 350000,
    items: [
      { title: 'UI/UX Design Masterclass', price: 350000, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80' },
    ],
  },
];

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const map = {
    PAID: { color: 'text-emerald-700 bg-emerald-50', label: 'Đã thanh toán', icon: <BadgeCheck size={14} /> },
    PENDING: { color: 'text-amber-700 bg-amber-50', label: 'Chờ xử lý', icon: <Clock size={14} /> },
    FAILED: { color: 'text-rose-700 bg-rose-50', label: 'Thất bại', icon: <XCircle size={14} /> },
  };
  const cfg = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const MyOrdersPage = () => {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = useMemo(() => {
    if (filter === 'ALL') return mockOrders;
    return mockOrders.filter((o) => o.status === filter);
  }, [filter]);

  const tabs: { key: OrderStatus | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PAID', label: 'Đã thanh toán' },
    { key: 'PENDING', label: 'Chờ xử lý' },
    { key: 'FAILED', label: 'Thất bại' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng của tôi' }]} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Đơn hàng</p>
          <h1 className="text-3xl font-bold text-slate-800">Theo dõi tình trạng thanh toán</h1>
          <p className="text-sm text-slate-500 mt-1">Cập nhật trạng thái PENDING / PAID / FAILED từ Order schema.</p>
        </div>
        <a href="/checkout" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          Thanh toán đơn mới <ArrowRight size={14} />
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-2 rounded-full text-sm font-semibold border transition-colors ${
              filter === tab.key
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:border-indigo-100 hover:bg-indigo-50/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Receipt size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{order.id}</p>
                  <p className="text-xs text-slate-500">{order.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <div className="text-right">
                  <p className="text-xs text-slate-500">Thành tiền</p>
                  <p className="text-lg font-bold text-slate-800">{formatVND(order.totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item.title}
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg border border-white shadow-sm object-cover"
                  />
                ))}
                {order.items.length === 0 && (
                  <div className="w-12 h-12 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                    <ImageIcon size={16} />
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-800">{order.items[0]?.title}</p>
                <p className="text-xs text-slate-500">
                  {order.items.length} khóa học • Tổng: {formatVND(order.totalAmount)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Xem chi tiết <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-sm text-slate-500">
            Chưa có đơn hàng ở trạng thái này.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;

