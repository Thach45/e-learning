import { Zap } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <section className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Tham gia cộng đồng học tập</h2>
          <p className="text-slate-400 mb-8 text-lg leading-relaxed">
            Đăng ký nhận bản tin để không bỏ lỡ các khóa học miễn phí và ưu đãi đặc biệt hàng tuần. Hơn 50,000 học viên đã tham gia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            />
            <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50">
              Đăng ký
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="w-80 h-80 bg-indigo-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <p className="font-bold text-lg">Học tập hiệu quả</p>
                <p className="text-sm text-slate-400">Cập nhật mỗi ngày</p>
              </div>
            </div>
            <p className="text-base text-slate-300 italic">"Nền tảng tuyệt vời nhất để bắt đầu sự nghiệp lập trình của tôi. Nội dung chất lượng và cộng đồng hỗ trợ rất nhiệt tình."</p>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700"></div>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-400">+2k review 5 sao</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

