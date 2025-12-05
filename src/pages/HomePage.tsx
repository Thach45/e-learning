import { Code, Briefcase, PenTool, Megaphone, Cpu, Smile } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import HeroSection from '../components/home/HeroSection';
import PurchaseFlowSection from '../components/home/PurchaseFlowSection';
import TrustedCompaniesSection from '../components/home/TrustedCompaniesSection';
import CategoriesSection, { type Category } from '../components/home/CategoriesSection';
import FeaturedCoursesSection, { type Course } from '../components/home/FeaturedCoursesSection';

import NewsletterSection from '../components/home/NewsletterSection';

// --- DỮ LIỆU ---
const DANH_MUC: Category[] = [
  { id: '1', name: 'Lập trình', count: 120, icon: <Code size={24} />, color: 'bg-blue-50 text-blue-600' },
  { id: '2', name: 'Kinh doanh', count: 85, icon: <Briefcase size={24} />, color: 'bg-emerald-50 text-emerald-600' },
  { id: '3', name: 'Thiết kế', count: 64, icon: <PenTool size={24} />, color: 'bg-purple-50 text-purple-600' },
  { id: '4', name: 'Marketing', count: 42, icon: <Megaphone size={24} />, color: 'bg-orange-50 text-orange-600' },
  { id: '5', name: 'Công nghệ', count: 98, icon: <Cpu size={24} />, color: 'bg-indigo-50 text-indigo-600' },
  { id: '6', name: 'Kỹ năng mềm', count: 55, icon: <Smile size={24} />, color: 'bg-pink-50 text-pink-600' },
];

const KHOA_HOC: Course[] = [
  {
    id: 'c1',
    title: 'Full Stack Web Development 2025',
    instructor: 'Nguyễn Văn A',
    rating: 4.9,
    reviews: 1200,
    price: 299000,
    oldPrice: 2500000,
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Bán chạy nhất',
    lessons: 45,
    duration: '12h 30m'
  },
  {
    id: 'c2',
    title: 'UI/UX Design Masterclass',
    instructor: 'Trần Thị B',
    rating: 4.8,
    reviews: 850,
    price: 350000,
    oldPrice: 2200000,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Mới ra mắt',
    lessons: 32,
    duration: '8h 15m'
  },
  {
    id: 'c3',
    title: 'Digital Marketing Thực Chiến',
    instructor: 'Lê Hoàng C',
    rating: 4.7,
    reviews: 2100,
    price: 0,
    oldPrice: 1800000,
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Miễn phí',
    lessons: 24,
    duration: '6h 45m'
  },
    {
    id: 'c4',
    title: 'Python & AI cho người mới bắt đầu',
    instructor: 'Phạm Minh D',
    rating: 4.9,
    reviews: 3200,
    price: 499000,
    oldPrice: 2800000,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Thịnh hành',
    lessons: 50,
    duration: '15h 20m'
  }
];

const formatVND = (amount: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const HomePage = () => {
  

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
         
          <HeroSection />
          <PurchaseFlowSection />
          <TrustedCompaniesSection />
          <CategoriesSection categories={DANH_MUC} />
          <FeaturedCoursesSection courses={KHOA_HOC} formatPrice={formatVND} />
    
          <NewsletterSection />
        
      </main>
    </div>
  );
};

export default HomePage;