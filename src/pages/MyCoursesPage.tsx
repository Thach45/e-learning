import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  Bell, 
  ChevronDown, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  MoreHorizontal,
  ArrowRight,
  Heart,
  TrendingUp,
  Layout,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA (Dựa trên Schema Enrollment & LearningProgress) ---

const USER_STATS = {
  totalCourses: 12,
  completedCourses: 4,
  certificates: 4,
  learningHours: 128
};

const MY_COURSES = [
  {
    id: 'c1',
    title: 'Full Stack Web Development 2025: Từ Zero đến Hero',
    instructor: 'Nguyễn Văn A',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    progress: 75, // LearningProgress %
    totalLessons: 45,
    completedLessons: 34,
    lastAccessed: '2 giờ trước',
    status: 'IN_PROGRESS', // Derived from Enrollment
    nextLesson: 'Bài 35: Triển khai ứng dụng lên Vercel'
  },
  {
    id: 'c2',
    title: 'UI/UX Design Masterclass',
    instructor: 'Trần Thị B',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    progress: 30,
    totalLessons: 32,
    completedLessons: 10,
    lastAccessed: '1 ngày trước',
    status: 'IN_PROGRESS',
    nextLesson: 'Bài 11: Nguyên lý thị giác trong thiết kế'
  },
  {
    id: 'c3',
    title: 'Python & AI cho người mới bắt đầu',
    instructor: 'Phạm Minh D',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    progress: 100,
    totalLessons: 50,
    completedLessons: 50,
    lastAccessed: '1 tuần trước',
    status: 'COMPLETED',
    completedAt: '20/05/2025'
  },
  {
    id: 'c4',
    title: 'Digital Marketing Thực Chiến',
    instructor: 'Lê Hoàng C',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    progress: 0,
    totalLessons: 24,
    completedLessons: 0,
    lastAccessed: 'Chưa bắt đầu',
    status: 'IN_PROGRESS',
    nextLesson: 'Bài 1: Tổng quan về Digital Marketing'
  }
];

const WISHLIST = [
  {
    id: 'w1',
    title: 'DevOps cơ bản cho Web Developer',
    instructor: 'Lê Hoàng C',
    price: 199000,
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-c81c0cda0563?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];


const ProgressBar = ({ percent }: { percent: number }) => (
  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
      style={{ width: `${percent}%` }}
    ></div>
  </div>
);

const LearningCard = ({ course }: { course: any }) => {
  const isCompleted = course.progress === 100;

  

  return (
   <a href={`/learn/course/${course.id}`}>  
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        
        {/* Overlay Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <PlayCircle size={28} className="text-indigo-600 fill-indigo-600 ml-1" />
           </button>
        </div>

        {isCompleted && (
           <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
              <CheckCircle2 size={12} /> Hoàn thành
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 mb-4">{course.instructor}</p>

        {!isCompleted && (
           <div className="mb-4 bg-indigo-50/50 p-3 rounded-xl border border-indigo-50">
              <p className="text-xs font-medium text-indigo-900 mb-1 line-clamp-1">
                 Tiếp theo: <span className="font-normal text-indigo-700">{course.nextLesson}</span>
              </p>
           </div>
        )}

        <div className="mt-auto">
           <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>{course.progress}% hoàn thành</span>
              <span className="text-slate-400 font-normal">{course.completedLessons}/{course.totalLessons} bài</span>
           </div>
           <ProgressBar percent={course.progress} />
           
           <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Truy cập {course.lastAccessed}</span>
              {isCompleted ? (
                 <button className="text-sm font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors">
                    <Award size={16} /> Xem chứng chỉ
                 </button>
              ) : (
                 <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors group/btn">
                    Học tiếp <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              )}
           </div>
        </div>
      </div>
    </div>
   </a>
  );
};

const WishlistCard = ({ item }: { item: any }) => (
   <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
      <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden relative">
         <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
         <div>
            <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.instructor}</p>
         </div>
         <div className="flex items-center justify-between mt-2">
            <span className="text-indigo-600 font-bold text-sm">{(item.price).toLocaleString()}đ</span>
            <div className="flex gap-2">
               <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Heart size={16} fill="currentColor" />
               </button>
               <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                  Mua ngay
               </button>
            </div>
         </div>
      </div>
   </div>
);

// --- MAIN PAGE ---

const MyCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'WISHLIST'>('ALL');

  // Filter logic
  const filteredCourses = MY_COURSES.filter(course => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'IN_PROGRESS') return course.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return course.status === 'COMPLETED';
    return false;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
     
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
         
         {/* 1. Stats Dashboard */}
         {/* 1. Stats Dashboard - Creative Bento Style */}
         <section className="flex flex-col lg:flex-row gap-6">
            {/* Hero Progress Card */}
            <div className="flex-1 bg-white rounded-[2rem] p-8  overflow-hidden shadow-xl  min-h-[280px]">
               <div className="relative z-10  flex flex-col justify-between h-full">
                  <div>
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-full border-2 border-white/20 p-1">
                           <img src="https://i.pravatar.cc/150?u=a" alt="User" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-black">Chào Nguyễn Văn A! 👋</h2>
                           <p className="text-slate-400 text-sm">Sẵn sàng chinh phục bài học hôm nay chưa?</p>
                        </div>
                     </div>
                     
                     <div className="flex gap-12">
                        <div>
                           <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                              <Clock size={14} /> Giờ học tích lũy
                           </div>
                           <p className="text-5xl font-bold text-black tracking-tight">{USER_STATS.learningHours}<span className="text-2xl text-slate-500 ml-1">h</span></p>
                        </div>
                        <div>
                           <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                              <CheckCircle2 size={14} /> Đã hoàn thành
                           </div>
                           <div className="flex items-baseline gap-2">
                              <p className="text-5xl font-bold text-emerald-400 tracking-tight">{USER_STATS.completedCourses}</p>
                              <span className="text-sm font-medium text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded-full">Xuất sắc</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-slate-300 font-medium">Tổng tiến trình học tập</span>
                        <span className="text-xs font-bold text-indigo-400">75%</span>
                     </div>
                     <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                     </div>
                  </div>
               </div>

               {/* Decorative Background */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full blur-[80px] opacity-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
            </div>

            {/* Side Stats Cards */}
            <div className="lg:w-[320px] flex flex-col gap-4">
               {/* Total Courses Card */}
               <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all duration-300">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen size={20} />
                     </div>
                     <p className="text-4xl font-bold text-slate-900 mb-1">{USER_STATS.totalCourses}</p>
                     <p className="text-sm text-slate-500 font-medium">Khóa học đã đăng ký</p>
                  </div>
                  <BookOpen size={100} className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-indigo-50/50 transition-colors duration-300 rotate-12" />
               </div>

               {/* Certificates Card */}
               <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-100 transition-all duration-300">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Award size={20} />
                     </div>
                     <p className="text-4xl font-bold text-slate-900 mb-1">{USER_STATS.certificates}</p>
                     <p className="text-sm text-slate-500 font-medium">Chứng chỉ đạt được</p>
                  </div>
                  <Award size={100} className="absolute -bottom-4 -right-4 text-slate-50 group-hover:text-amber-50/50 transition-colors duration-300 rotate-12" />
               </div>
            </div>
         </section>

         {/* 2. Main Content Area */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main Course List (Left) */}
            <div className="lg:col-span-8 space-y-6">
               {/* Tabs */}
               <div className="flex items-center justify-between">
                  <div className="flex gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                     {[
                        { id: 'ALL', label: 'Tất cả' },
                        { id: 'IN_PROGRESS', label: 'Đang học' },
                        { id: 'COMPLETED', label: 'Hoàn thành' },
                     ].map(tab => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id as any)}
                           className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                              activeTab === tab.id 
                              ? 'bg-slate-900 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                           }`}
                        >
                           {tab.label}
                        </button>
                     ))}
                  </div>
                  
                  {/* Filter Mobile/Desktop */}
                  <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                     <Filter size={16} /> <span className="hidden sm:inline">Sắp xếp</span>
                  </button>
               </div>

               {/* Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map(course => (
                     <LearningCard key={course.id} course={course} />
                  ))}
               </div>
               
               {filteredCourses.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <BookOpen size={32} />
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 mb-2">Chưa có khóa học nào</h3>
                     <p className="text-slate-500 text-sm mb-6">Bạn chưa đăng ký khóa học nào ở mục này.</p>
                     <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                        Khám phá khóa học ngay
                     </button>
                  </div>
               )}
            </div>

            {/* Sidebar (Right) */}
            <div className="lg:col-span-4 space-y-8">
               
            
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-slate-900">Danh sách yêu thích</h3>
                     <button className="text-xs font-bold text-indigo-600 hover:underline">Xem tất cả</button>
                  </div>
                  <div className="space-y-3">
                     {WISHLIST.map(item => (
                        <WishlistCard key={item.id} item={item} />
                     ))}
                  </div>
               </div>

               {/* Recommended Topic Tags */}
               <div className="bg-white p-5 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Chủ đề gợi ý cho bạn</h3>
                  <div className="flex flex-wrap gap-2">
                     {['ReactJS', 'System Design', 'English for IT', 'Leadership', 'Data Analysis'].map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 cursor-pointer transition-colors">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>

            </div>
         </div>

      </main>
    </div>
  );
};

export default MyCoursesPage;