import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
              L
            </div>
            <span className="text-2xl font-bold text-slate-800">LearnHub</span>
          </Link>
        </div>

        {/* Auth Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>&copy; 2025 LearnHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

