const FooterSection = () => {
  return (
    <footer className="pt-8 pb-8 text-center md:text-left text-sm text-slate-500 border-t border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-xs">E</div>
          <p>&copy; 2025 EduMaster. All rights reserved.</p>
        </div>
        <div className="flex gap-8 font-medium">
          <a href="#" className="hover:text-indigo-600 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Trợ giúp</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

