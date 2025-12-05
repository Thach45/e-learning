import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('accessToken');
  const refreshToken = searchParams.get('refreshToken');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // Show error for 3 seconds then redirect to login
      setTimeout(() => {
        navigate('/auth/login?error=' + encodeURIComponent(error));
      }, 3000);
      return;
    }

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Redirect to home
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [accessToken, refreshToken, error, navigate]);

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl inline-flex items-center gap-2 text-rose-700">
          <AlertCircle size={20} />
          <span>Đăng nhập thất bại: {error}</span>
        </div>
        <p className="text-sm text-slate-500">Đang chuyển hướng về trang đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl inline-flex items-center gap-2 text-emerald-700">
        <CheckCircle size={20} />
        <span>Đăng nhập thành công!</span>
      </div>
      <p className="text-sm text-slate-500">Đang chuyển hướng...</p>
    </div>
  );
};

export default GoogleCallbackPage;

