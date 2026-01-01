import { useParams, useNavigate } from 'react-router-dom';
import { Copy, CheckCircle, Loader2, AlertCircle, QrCode, Building2, ShieldCheck, Clock } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { useQrCode } from '../hooks/useOrders';
import { ordersApi } from '../api/orders';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';

const formatVND = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const PaymentPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 phút = 300 giây

  const { data: qrCodeData, isLoading: qrLoading } = useQrCode(orderId || '');
  const pollingIntervalRef = useRef<number | null>(null);
  const hasNavigatedRef = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Polling payment status every 3 seconds
  useEffect(() => {
    if (!orderId || !qrCodeData || hasNavigatedRef.current) return;

    const checkPayment = async () => {
      try {
        const order = await ordersApi.checkPayment(orderId);
        
        // Check if order is paid
        if (order && order.status === 'PAID') {
          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          
          // Prevent multiple navigations
          if (!hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            toast.success('Thanh toán thành công! Khóa học đã được kích hoạt.');
            setTimeout(() => {
              navigate('/my-courses');
            }, 1500);
          }
        }
      } catch (error: any) {
        // Ignore errors - payment might not be found yet
        // Only log if it's not a "payment not found" error
        if (error?.response?.status !== 400) {
          console.error('Error checking payment:', error);
        }
      }
    };

    // Check immediately on mount
    checkPayment();

    // Then check every 3 seconds
    pollingIntervalRef.current = setInterval(() => {
      checkPayment();
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [orderId, qrCodeData, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Đã sao chép!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Quay lại thanh toán
          </button>
        </div>
      </div>
    );
  }

  if (qrLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="inline-block animate-spin h-12 w-12 text-indigo-600" />
          <p className="mt-4 text-slate-500">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!qrCodeData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="inline-block h-12 w-12 text-rose-500 mb-4" />
          <p className="text-slate-500 mb-4">Không thể tải thông tin thanh toán</p>
          <button
            onClick={() => navigate('/checkout')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Quay lại thanh toán
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-3">
          <Breadcrumbs items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Giỏ hàng', href: '/cart' },
            { label: 'Thanh toán', href: '/checkout' },
            { label: 'Thanh toán đơn hàng' }
          ]} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 lg:p-6">
          {/* Header with Countdown - Compact */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Thanh toán đơn hàng</h1>
              <p className="text-sm text-slate-500 mt-1">Quét QR code hoặc chuyển khoản theo thông tin bên dưới</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <Clock size={20} className={`${timeLeft <= 60 ? 'text-rose-500' : 'text-indigo-600'}`} />
              <div>
                <p className="text-xs text-slate-500">Thời gian còn lại</p>
                <p className={`text-xl font-bold ${timeLeft <= 60 ? 'text-rose-500' : 'text-indigo-600'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Left: QR Code */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <QrCode size={18} className="text-indigo-600" />
                <h2 className="text-base font-bold text-slate-800">Quét mã QR để thanh toán</h2>
              </div>
              <div className="bg-white rounded-lg p-4 flex items-center justify-center border-2 border-dashed border-slate-200">
                <img
                  src={qrCodeData.qrCodeUrl}
                  alt="QR Code"
                  className="w-full max-w-[280px] h-auto object-contain"
                />
              </div>
            </div>

            {/* Right: Bank Info */}
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={18} className="text-indigo-600" />
                <h2 className="text-base font-bold text-slate-800">Thông tin chuyển khoản</h2>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Số tài khoản</p>
                    <p className="font-bold text-slate-800 text-sm break-all">{qrCodeData.accountNumber}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(qrCodeData.accountNumber, 'account')}
                    className="ml-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copiedField === 'account' ? (
                      <CheckCircle size={18} className="text-emerald-600" />
                    ) : (
                      <Copy size={18} className="text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Ngân hàng</p>
                    <p className="font-bold text-slate-800 text-sm">{qrCodeData.bankName}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(qrCodeData.bankName, 'bank')}
                    className="ml-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copiedField === 'bank' ? (
                      <CheckCircle size={18} className="text-emerald-600" />
                    ) : (
                      <Copy size={18} className="text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Số tiền</p>
                    <p className="font-bold text-indigo-600 text-sm">{formatVND(qrCodeData.amount)}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(qrCodeData.amount.toString(), 'amount')}
                    className="ml-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copiedField === 'amount' ? (
                      <CheckCircle size={18} className="text-emerald-600" />
                    ) : (
                      <Copy size={18} className="text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 mb-1">Nội dung chuyển khoản</p>
                    <p className="font-bold text-slate-800 text-sm font-mono break-all">{qrCodeData.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(qrCodeData.description, 'description')}
                    className="ml-2 p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    {copiedField === 'description' ? (
                      <CheckCircle size={18} className="text-emerald-600" />
                    ) : (
                      <Copy size={18} className="text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notice - Compact at bottom */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="space-y-0.5 list-disc list-inside">
                  <li>Chuyển đúng số tiền: <strong>{formatVND(qrCodeData.amount)}</strong></li>
                  <li>Nội dung: <strong className="font-mono">{qrCodeData.description}</strong></li>
                  <li>Khóa học sẽ được kích hoạt tự động sau khi chuyển khoản</li>
                  {timeLeft <= 60 && (
                    <li className="text-rose-600 font-bold">Thời gian sắp hết hạn!</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-3">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Bảo mật thanh toán • Hoàn tiền trong 7 ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

