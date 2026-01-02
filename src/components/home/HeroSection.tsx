import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 md:p-16 text-white shadow-xl shadow-indigo-200">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/20">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Khuyến mãi {new Date().getFullYear()}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Nâng tầm sự nghiệp với <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">Kỹ năng thực chiến</span>
          </h1>
          <p className="text-indigo-100 text-lg max-w-lg leading-relaxed">
            Truy cập hơn 10,000 khóa học chất lượng cao từ các chuyên gia hàng đầu. Học mọi lúc, mọi nơi.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button onClick={() => navigate('/courses')} className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-2">
              Bắt đầu ngay <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Students"
            className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 border-4 border-white/10 w-full object-cover h-[400px]"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow text-slate-800">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Được sự tin tưởng từ</p>
              <p className="font-bold text-sm">15.000+ Học viên</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

