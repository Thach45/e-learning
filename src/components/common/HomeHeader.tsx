import { useState } from 'react';
import { Search, Menu, X, Bell, ShoppingCart, ChevronDown, Receipt } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';

type HeaderProps = {
  cartCount?: number;
};

const HomeHeader = ({ cartCount = 0 }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
              E
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">EduMaster</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <a href="/courses" className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full transition-colors">Khám phá</a>
            <a href="/my-courses" className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors">Khóa học của tôi</a>
            <a href="#" className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors">Cộng đồng</a>
          </nav>

          <div className="hidden lg:flex flex-1 max-w-md relative group">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <a className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            href="/cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-5 px-1 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </a>

            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" />
              <ChevronDown size={16} className="text-slate-400 hidden xl:block" />
            </div>
          </div>

          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom info strip */}
      <div className="hidden mb-2 mt-2 md:block border-t border-slate-100 bg-slate-50/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            
            <span className="hidden lg:inline text-slate-500">Hỗ trợ 24/7</span>
            <span className="hidden lg:inline text-slate-500">Hoàn tiền trong 7 ngày</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/account/orders" className="hover:text-indigo-600 flex items-center gap-1">
              <Receipt size={14} className="text-indigo-600" />
              <span>Đơn hàng đã mua</span>
            </a>
            <a href="#" className="hover:text-indigo-600">Trợ giúp</a>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute w-full left-0 shadow-xl z-50">
          <div className="p-4 space-y-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 bg-slate-100 rounded-lg text-sm outline-none"
            />
            <div className="flex flex-col gap-2">
              <a href="#" className="p-2 font-semibold text-indigo-600 bg-indigo-50 rounded-lg">Khám phá</a>
              <a href="#" className="p-2 font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Khóa học của tôi</a>
              <a href="#" className="p-2 font-semibold text-slate-600 hover:bg-slate-50 rounded-lg">Cộng đồng</a>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-bold text-sm">Học viên Mới</p>
                <button className="text-xs text-red-500 font-semibold">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeHeader;

