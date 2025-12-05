import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  Heart, 
  Star, 
  MonitorPlay, 
  TrendingUp, 
  Filter, 
  Grid, 
  List,
  Check,
  Zap,
  Code,
  Layout,
  Globe,
  Users
} from 'lucide-react';

// --- DỮ LIỆU GIẢ LẬP ---

const CATEGORIES = [
  'Lập trình', 'Thiết kế', 'Marketing', 'Kinh doanh', 'Ngoại ngữ', 'Phát triển bản thân', 'Công nghệ thông tin'
];

const LEVELS = ['Cơ bản', 'Trung cấp', 'Nâng cao', 'Mọi cấp độ'];

const COURSES = [
  {
    id: 'c1',
    title: 'Full Stack Web Development 2025: Từ Zero đến Hero',
    instructor: 'Nguyễn Văn A',
    rating: 4.9,
    reviews: 1200,
    price: 299000,
    oldPrice: 2500000,
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Bán chạy nhất',
    lessons: 45,
    duration: '12h 30m',
    level: 'Mọi cấp độ',
    category: 'Lập trình'
  },
  {
    id: 'c2',
    title: 'UI/UX Design Masterclass: Thiết kế giao diện hiện đại',
    instructor: 'Trần Thị B',
    rating: 4.8,
    reviews: 850,
    price: 350000,
    oldPrice: 2200000,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Mới ra mắt',
    lessons: 32,
    duration: '8h 15m',
    level: 'Trung cấp',
    category: 'Thiết kế'
  },
  {
    id: 'c3',
    title: 'Digital Marketing Thực Chiến trên đa nền tảng',
    instructor: 'Lê Hoàng C',
    rating: 4.7,
    reviews: 2100,
    price: 0,
    oldPrice: 1800000,
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Miễn phí',
    lessons: 24,
    duration: '6h 45m',
    level: 'Cơ bản',
    category: 'Marketing'
  },
  {
    id: 'c4',
    title: 'Python & AI: Trí tuệ nhân tạo cho người mới bắt đầu',
    instructor: 'Phạm Minh D',
    rating: 4.9,
    reviews: 3200,
    price: 499000,
    oldPrice: 2800000,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Thịnh hành',
    lessons: 50,
    duration: '15h 20m',
    level: 'Cơ bản',
    category: 'Công nghệ'
  },
  {
    id: 'c5',
    title: 'Quản trị kinh doanh 4.0: Tư duy lãnh đạo',
    instructor: 'Dr. John Doe',
    rating: 4.6,
    reviews: 500,
    price: 600000,
    oldPrice: 1500000,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Đề xuất',
    lessons: 40,
    duration: '10h 00m',
    level: 'Nâng cao',
    category: 'Kinh doanh'
  },
  {
    id: 'c6',
    title: 'Nhiếp ảnh cơ bản & Chỉnh sửa Lightroom',
    instructor: 'Sarah Lee',
    rating: 4.8,
    reviews: 900,
    price: 150000,
    oldPrice: 800000,
    thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tag: 'Sáng tạo',
    lessons: 20,
    duration: '5h 30m',
    level: 'Cơ bản',
    category: 'Thiết kế'
  }
];

const formatVND = (amount: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);


const CourseCard = ({ course }: { course: any }) => (
    <a href={`/courses/${course.id}`}>   
        <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded text-slate-800 shadow-sm uppercase tracking-wide border border-slate-100">
                {course.tag}
                </div>
                
                <button className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                <Heart size={16} fill="currentColor" className="text-current" />
                </button>
            </div>
            
            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md text-slate-600"><MonitorPlay size={12} className="text-indigo-500"/> {course.lessons} bài</span>
                <span className="flex items-center gap-1.5"><TrendingUp size={12}/> {course.duration}</span>
                </div>
                
                <h3 className="font-bold text-[17px] text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                {course.title}
                </h3>

                <div className="mb-4">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">{course.category}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4 mt-auto">
                <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt="" className="w-6 h-6 rounded-full border border-white shadow-sm" />
                <span className="text-xs font-semibold text-slate-600">{course.instructor}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{course.rating}</span>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-400 font-medium">({course.reviews})</span>
                </div>
                <div className="text-right">
                    {course.price > 0 ? (
                        <div className="flex flex-col items-end">
                            <div className="font-bold text-indigo-600 text-lg">{formatVND(course.price)}</div>
                            {course.oldPrice > course.price && <div className="text-xs text-slate-400 line-through">{formatVND(course.oldPrice)}</div>}
                        </div>
                    ) : (
                        <div className="font-bold text-emerald-600 uppercase text-sm bg-emerald-50 px-2 py-1 rounded">Miễn phí</div>
                    )}
                </div>
                </div>
            </div>
        </div>
    </a>
);


// --- MAIN PAGE: COURSE LISTING ---

const CourseListPage = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        
       

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Filters */}
            <aside className="lg:col-span-3 space-y-8 sticky top-24">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                        <Filter size={20} className="text-indigo-600"/> 
                        <span className="font-bold text-slate-900">Bộ Lọc Tìm Kiếm</span>
                    </div>
                    
                    <div className="space-y-8">
                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Danh mục</h3>
                            <div className="space-y-3">
                                {CATEGORIES.map((cat, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group select-none">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${selectedCategories.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white hover:border-indigo-400'}`}>
                                            {selectedCategories.includes(cat) && <Check size={14} className="text-white" />}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            onChange={() => toggleCategory(cat)}
                                            checked={selectedCategories.includes(cat)}
                                        />
                                        <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-indigo-600'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Levels */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Trình độ</h3>
                            <div className="space-y-3">
                                {LEVELS.map((level, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="level" className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer" />
                                        <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Đánh giá</h3>
                            <div className="space-y-3">
                                {[5, 4, 3].map((star, i) => (
                                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="rating" className="w-4 h-4 border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600 cursor-pointer" />
                                        <div className="flex items-center gap-1">
                                            <span className="flex text-amber-400">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} size={14} fill={idx < star ? "currentColor" : "none"} className={idx >= star ? "text-slate-200" : ""} />
                                            ))}
                                            </span>
                                            <span className="text-sm text-slate-600">& lên</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

               
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
                
                {/* Filters Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Tất cả khóa học</h2>
                        <p className="text-sm text-slate-500">Hiển thị <span className="font-bold text-slate-900">6</span> kết quả phù hợp</p>
                    </div>
                    
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="relative group">
                            <select className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium cursor-pointer hover:border-slate-300 transition-colors">
                                <option>Phổ biến nhất</option>
                                <option>Mới nhất</option>
                                <option>Giá: Thấp đến Cao</option>
                                <option>Giá: Cao đến Thấp</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        
                        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Course Listing */}
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                    {COURSES.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex justify-center">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <button className="w-10 h-10 rounded-xl border border-transparent flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50">←</button>
                        <button className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-indigo-200">1</button>
                        <button className="w-10 h-10 rounded-xl border border-transparent flex items-center justify-center text-slate-600 hover:bg-slate-50 font-medium transition-colors">2</button>
                        <button className="w-10 h-10 rounded-xl border border-transparent flex items-center justify-center text-slate-600 hover:bg-slate-50 font-medium transition-colors">3</button>
                        <span className="w-10 h-10 flex items-center justify-center text-slate-400 pb-2">...</span>
                        <button className="w-10 h-10 rounded-xl border border-transparent flex items-center justify-center text-slate-600 hover:bg-slate-50 font-medium transition-colors">8</button>
                        <button className="w-10 h-10 rounded-xl border border-transparent flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">→</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <CourseListPage />
      </main>
      
    </div>
  );
};

export default App;