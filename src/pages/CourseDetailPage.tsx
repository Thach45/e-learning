import React, { useState } from 'react';
import { 
  Star, 
  PlayCircle, 
  Check, 
  Users, 
  AlertCircle, 
  MonitorPlay, 
  FileText, 
  Code, 
  Clock, 
  Globe, 
  Award, 
  Share2, 
  ChevronDown, 
  ChevronRight,
  Heart,
  ThumbsUp, // Mới
  MoreHorizontal // Mới
} from 'lucide-react';

// --- HELPER FUNCTIONS ---
const formatVND = (amount: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// --- MOCK DATA (UPDATED) ---
const COURSE_DATA = {
  id: 'c1',
  title: 'Full Stack Web Development 2025: Từ Zero đến Hero',
  price: 299000,
  salePrice: 299000,
  originalPrice: 2500000,
  thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  introVideo: 'https://www.youtube.com/watch?v=placeholder',
  isFeatured: true,
  level: 'BEGINNER',
  status: 'PUBLISHED',
  updatedAt: '24/05/2025',
  
  instructor: {
    id: 'u1',
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?u=a',
    bio: 'Senior Software Engineer tại Google. Có hơn 10 năm kinh nghiệm giảng dạy lập trình web. Đã đào tạo hơn 5000 học viên thành công.',
    rating: 4.8,
    students: 15400,
    courses: 12
  },

  category: { name: 'Lập trình Web' },

  detail: {
    description: `Khóa học Full Stack Web Development toàn diện nhất, cập nhật mới nhất năm 2025. Bạn sẽ học được tất cả các kỹ năng cần thiết để trở thành một lập trình viên chuyên nghiệp, từ Frontend (HTML, CSS, JS, React) đến Backend (NodeJS, Express, MongoDB). Khóa học được thiết kế thực chiến, giúp bạn có sản phẩm ngay sau khi học.`,
    objectives: [
      'Xây dựng bất kỳ website nào bạn muốn từ con số 0',
      'Thành thạo HTML5, CSS3, JavaScript ES6+',
      'Làm việc chuyên nghiệp với ReactJS và Redux Toolkit',
      'Xây dựng Backend RESTful API mạnh mẽ với NodeJS',
      'Triển khai ứng dụng thực tế lên Cloud (AWS/Vercel)',
      'Tư duy giải quyết vấn đề của một kỹ sư phần mềm'
    ],
    requirements: [
      'Không cần kinh nghiệm lập trình trước đó, khóa học dạy từ đầu',
      'Máy tính kết nối internet (Windows, Mac hoặc Linux)',
      'Tinh thần ham học hỏi và kiên trì làm bài tập'
    ],
    targetAudience: 'Người mới bắt đầu, sinh viên CNTT muốn củng cố kiến thức, người trái ngành muốn chuyển việc.',
  },

  content: [
    {
      id: 'sec1',
      title: 'Giới thiệu & Cài đặt môi trường',
      lessons: [
        { id: 'l1', title: 'Giới thiệu lộ trình khóa học', type: 'VIDEO', duration: '5:00', isFree: true },
        { id: 'l2', title: 'Cài đặt VS Code & Extensions cần thiết', type: 'VIDEO', duration: '10:30', isFree: true },
        { id: 'l3', title: 'Tài liệu & Source code khóa học', type: 'DOC', duration: '1:00', isFree: false },
      ]
    },
    {
      id: 'sec2',
      title: 'HTML5: Cấu trúc trang web',
      lessons: [
        { id: 'l4', title: 'Cấu trúc DOM và các thẻ cơ bản', type: 'VIDEO', duration: '15:00', isFree: false },
        { id: 'l5', title: 'Làm việc với Forms và Validation', type: 'VIDEO', duration: '20:00', isFree: false },
        { id: 'l6', title: 'Semantic HTML & SEO Basics', type: 'VIDEO', duration: '12:45', isFree: false },
      ]
    },
    {
      id: 'sec3',
      title: 'CSS3: Trang trí trang web',
      lessons: [
        { id: 'l7', title: 'Box Model, Margin, Padding', type: 'VIDEO', duration: '25:00', isFree: false },
        { id: 'l8', title: 'Flexbox toàn tập', type: 'VIDEO', duration: '18:00', isFree: false },
        { id: 'l9', title: 'CSS Grid & Responsive Design', type: 'VIDEO', duration: '22:00', isFree: false },
      ]
    }
  ],

  // --- REVIEW DATA ---
  reviews: [
    {
      id: 'r1',
      user: { name: 'Trần Minh Tuấn', avatar: 'https://i.pravatar.cc/150?u=10' },
      rating: 5,
      comment: 'Khóa học rất chi tiết, giảng viên dạy dễ hiểu. Phần ReactJS cập nhật kiến thức mới nhất rất hay. Đáng tiền!',
      createdAt: '2 ngày trước',
      helpful: 12
    },
    {
      id: 'r2',
      user: { name: 'Lê Thị Hoa', avatar: 'https://i.pravatar.cc/150?u=20' },
      rating: 4,
      comment: 'Nội dung tốt nhưng phần Backend hơi nhanh, mình phải xem lại 2 lần mới hiểu. Mong thầy bổ sung thêm bài tập phần này.',
      createdAt: '1 tuần trước',
      helpful: 5
    },
    {
      id: 'r3',
      user: { name: 'Phạm Văn Nam', avatar: 'https://i.pravatar.cc/150?u=30' },
      rating: 5,
      comment: 'Tuyệt vời! Mình từ dân kinh tế chuyển sang mà học xong đã tự làm được portfolio xin việc. Cảm ơn thầy rất nhiều.',
      createdAt: '2 tuần trước',
      helpful: 24
    }
  ],

  // --- RELATED COURSES DATA ---
  relatedCourses: [
    {
      id: 'rc1',
      title: 'ReactJS Advanced: Các kỹ thuật nâng cao',
      instructor: 'Nguyễn Văn A',
      rating: 4.9,
      reviews: 450,
      price: 399000,
      originalPrice: 1200000,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      tag: 'Nâng cao'
    },
    {
      id: 'rc2',
      title: 'NodeJS & MongoDB: Xây dựng API Scalable',
      instructor: 'Trần Văn B',
      rating: 4.7,
      reviews: 320,
      price: 250000,
      originalPrice: 800000,
      thumbnail: 'https://images.unsplash.com/photo-1618477247222-ac5912454582?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      tag: 'Backend'
    },
    {
      id: 'rc3',
      title: 'DevOps cơ bản cho Web Developer',
      instructor: 'Lê Hoàng C',
      rating: 4.8,
      reviews: 150,
      price: 199000,
      originalPrice: 500000,
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-c81c0cda0563?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      tag: 'Mới'
    }
  ],

  totalLessons: 45,
  totalDuration: '12h 30m',
  rating: 4.9,
  reviewsCount: 1200,
  studentsCount: 5400
};

// --- SUB-COMPONENTS ---

const AccordionItem = ({ section, defaultOpen = false }: { section: any, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left select-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-slate-400">{isOpen ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}</span>
          <h4 className="font-bold text-slate-800 text-sm md:text-base">{section.title}</h4>
        </div>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{section.lessons.length} bài học</span>
      </button>
      
      {isOpen && (
        <div className="bg-white divide-y divide-slate-100">
          {section.lessons.map((lesson: any) => (
            <div key={lesson.id} className="p-3 pl-4 md:pl-11 flex items-center justify-between group hover:bg-indigo-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                <PlayCircle size={16} className={`text-slate-400 flex-shrink-0 group-hover:text-indigo-600 ${lesson.isFree ? 'fill-indigo-100 text-indigo-600' : ''}`} />
                <span className={`text-sm truncate group-hover:text-indigo-700 ${lesson.isFree ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                    {lesson.title}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-2">
                {lesson.isFree && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full hidden sm:inline-block">Học thử</span>}
                <span className="text-xs text-slate-400">{lesson.duration}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RelatedCourseCard = ({ course }: { course: any }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer group">
    <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {course.tag && (
            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded text-slate-800 shadow-sm">{course.tag}</span>
        )}
    </div>
    <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.title}</h4>
        <p className="text-xs text-slate-500 mb-2">{course.instructor}</p>
        <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1">
                <span className="text-amber-500 font-bold text-xs">{course.rating}</span>
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-xs text-slate-400">({course.reviews})</span>
            </div>
            <span className="font-bold text-indigo-600 text-sm">{formatVND(course.price)}</span>
        </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

const CourseDetailPage = () => {
  const course = COURSE_DATA;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-30 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 text-indigo-300 text-xs md:text-sm font-medium mb-4">
                <span className="hover:text-white cursor-pointer">Khóa học</span>
                <ChevronRight size={14} />
                <span className="hover:text-white cursor-pointer">{course.category.name}</span>
                <ChevronRight size={14} />
                <span className="text-white truncate max-w-[150px] md:max-w-xs">{course.title}</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold leading-tight">{course.title}</h1>
              <p className="text-base md:text-lg text-slate-300 line-clamp-2">{course.detail.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                 <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded">
                    <span className="font-bold">{course.rating}</span>
                    <div className="flex"><Star size={14} fill="currentColor"/></div>
                 </div>
                 <span className="text-slate-300 underline decoration-slate-600 underline-offset-4 cursor-pointer hover:text-white hover:decoration-white">({course.reviewsCount} đánh giá)</span>
                 <span className="text-slate-400 hidden sm:inline">•</span>
                 <span className="text-slate-300">{course.studentsCount.toLocaleString()} học viên</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                 <div className="flex items-center gap-2">
                    <img src={course.instructor.avatar} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                    <span>Được dạy bởi <span className="font-bold text-white hover:underline cursor-pointer">{course.instructor.name}</span></span>
                 </div>
                 <div className="flex items-center gap-1 text-xs text-slate-400 lg:ml-4">
                    <AlertCircle size={14} /> Cập nhật lần cuối {course.updatedAt}
                 </div>
                 <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Globe size={14} /> Tiếng Việt
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-10 order-2 lg:order-1">
             
             {/* Objectives */}
             <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Bạn sẽ học được gì?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {course.detail.objectives.map((obj: string, i: number) => (
                      <div key={i} className="flex gap-3 items-start">
                         <Check size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                         <span className="text-sm text-slate-700 leading-snug">{obj}</span>
                      </div>
                   ))}
                </div>
             </section>

             {/* Content */}
             <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Nội dung khóa học</h2>
                  <div className="text-sm text-slate-500 font-medium hidden sm:block">
                     {course.content.length} phần • {course.totalLessons} bài học • {course.totalDuration}
                  </div>
                </div>
                <div>
                   {course.content.map((sec: any, i: number) => (
                      <AccordionItem key={sec.id} section={sec} defaultOpen={i === 0} />
                   ))}
                </div>
             </section>

             {/* Requirements & Description */}
             <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Yêu cầu & Mô tả</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-700 text-sm marker:text-indigo-600 mb-6">
                   {course.detail.requirements.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                   ))}
                </ul>
                <div className="text-slate-700 leading-relaxed text-sm space-y-4 text-justify">
                   <p>{course.detail.description}</p>
                   <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <p className="font-bold text-indigo-900 mb-1">Đối tượng:</p>
                        <p className="text-indigo-800">{course.detail.targetAudience}</p>
                   </div>
                </div>
             </section>

             {/* Instructor */}
             <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Giảng viên</h2>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                      <img src={course.instructor.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                         <h3 className="font-bold text-lg text-slate-900 hover:text-indigo-600 cursor-pointer">{course.instructor.name}</h3>
                         <p className="text-slate-500 text-sm font-medium">Software Engineer & Instructor</p>
                         <div className="flex gap-4 text-xs text-slate-600 mt-2">
                            <div className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> {course.instructor.rating} Đánh giá</div>
                            <div className="flex items-center gap-1"><Users size={14} /> {course.instructor.students.toLocaleString()} Học viên</div>
                            <div className="flex items-center gap-1"><PlayCircle size={14} /> {course.instructor.courses} Khóa học</div>
                         </div>
                      </div>
                   </div>
                   <p className="text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-4 mt-4">{course.instructor.bio}</p>
                </div>
             </section>

             {/* REVIEWS SECTION (NEW) */}
             <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    Đánh giá từ học viên <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{course.reviewsCount}</span>
                </h2>
                
                {/* Rating Summary */}
                <div className="flex items-center gap-8 mb-8 bg-white p-6 rounded-2xl border border-slate-200">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-slate-900 mb-1">{course.rating}</div>
                        <div className="flex justify-center text-amber-400 mb-1">
                            <Star size={16} fill="currentColor"/>
                            <Star size={16} fill="currentColor"/>
                            <Star size={16} fill="currentColor"/>
                            <Star size={16} fill="currentColor"/>
                            <Star size={16} fill="currentColor"/>
                        </div>
                        <p className="text-xs text-slate-500">Xếp hạng khóa học</p>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="w-2">{star}</span>
                                <Star size={10} className="text-slate-300" />
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-amber-400 rounded-full" 
                                        style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                                    ></div>
                                </div>
                                <span className="w-8 text-right">{star === 5 ? '70%' : star === 4 ? '20%' : '5%'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                    {course.reviews.map(review => (
                        <div key={review.id} className="border-b border-slate-100 pb-6 last:border-none">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <img src={review.user.avatar} alt={review.user.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900">{review.user.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-200" : ""} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-slate-400">• {review.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16}/></button>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1.5 text-xs text-slate-500 font-medium hover:text-indigo-600 transition-colors">
                                    <ThumbsUp size={14} /> Hữu ích ({review.helpful})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="w-full py-2.5 mt-4 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Xem thêm đánh giá
                </button>
             </section>
          </div>

          {/* RIGHT COLUMN: STICKY BUY CARD */}
          <div className="lg:col-span-1 relative order-1 lg:order-2">
             <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-indigo-900/10 overflow-hidden lg:-mt-48 relative z-20">
                   <div className="relative aspect-video group cursor-pointer bg-slate-900">
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <PlayCircle size={32} className="text-indigo-600 fill-indigo-600 ml-1" />
                         </div>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm font-medium">Xem giới thiệu</div>
                   </div>

                   <div className="p-6">
                      <div className="flex items-end gap-3 mb-6">
                         <span className="text-3xl font-bold text-slate-900">{formatVND(course.salePrice)}</span>
                         {course.originalPrice > course.salePrice && (
                            <span className="text-slate-400 line-through mb-1 text-sm font-medium">{formatVND(course.originalPrice)}</span>
                         )}
                         <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded ml-auto mb-1">
                            -{Math.round((1 - course.salePrice/course.originalPrice)*100)}%
                         </span>
                      </div>

                      <div className="space-y-3 mb-6">
                         <button className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-[0.98]">
                            Mua ngay
                         </button>
                         <div className="flex gap-3">
                            <button className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                Thêm vào giỏ
                            </button>
                            <button className="px-4 py-3.5 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-red-500 transition-colors">
                                <Heart size={20} />
                            </button>
                         </div>
                      </div>

                      <div className="text-center text-xs text-slate-500 mb-6">Hoàn tiền trong 30 ngày nếu không hài lòng</div>

                      <div className="space-y-4">
                         <h4 className="font-bold text-slate-900 text-sm">Khóa học này bao gồm:</h4>
                         <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-3"><MonitorPlay size={18} className="text-slate-400"/> {course.totalDuration} video bài giảng</li>
                            <li className="flex items-center gap-3"><FileText size={18} className="text-slate-400"/> 3 bài viết chuyên sâu</li>
                            <li className="flex items-center gap-3"><Code size={18} className="text-slate-400"/> 15 bài tập Coding</li>
                            <li className="flex items-center gap-3"><Clock size={18} className="text-slate-400"/> Truy cập trọn đời</li>
                            <li className="flex items-center gap-3"><Globe size={18} className="text-slate-400"/> Học trên Mobile và TV</li>
                            <li className="flex items-center gap-3"><Award size={18} className="text-slate-400"/> Cấp chứng chỉ hoàn thành</li>
                         </ul>
                      </div>
                   </div>
                   
                   <div className="border-t border-slate-100 p-4 flex justify-between items-center text-sm font-medium text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors bg-slate-50">
                      <span>Chia sẻ khóa học</span>
                      <Share2 size={18} />
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* 3. RELATED COURSES (FULL WIDTH BOTTOM) */}
        <div className="mt-20 border-t border-slate-200 pt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Khóa học liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {course.relatedCourses.map(rc => (
                    <RelatedCourseCard key={rc.id} course={rc} />
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetailPage;