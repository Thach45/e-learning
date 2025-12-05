import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  MoreVertical,
  Download,
  ThumbsUp,
  Share2,
  Flag,
  Settings,
  Maximize,
  Volume2,
  Play,
  Pause,
  ChevronDown,
  Lock
} from 'lucide-react';

// --- MOCK DATA ---

const COURSE_CONTENT = [
  {
    id: 'sec1',
    title: 'Chương 1: Giới thiệu & Cài đặt',
    duration: '30p',
    lessons: [
      { id: 'l1', title: '1. Giới thiệu lộ trình khóa học', type: 'VIDEO', duration: '05:00', isCompleted: true, isCurrent: false },
      { id: 'l2', title: '2. Cài đặt VS Code & Extensions', type: 'VIDEO', duration: '15:00', isCompleted: true, isCurrent: false },
      { id: 'l3', title: '3. Tài liệu khóa học', type: 'DOC', duration: '10:00', isCompleted: true, isCurrent: false },
    ]
  },
  {
    id: 'sec2',
    title: 'Chương 2: Kiến thức nền tảng HTML5',
    duration: '1h 20p',
    lessons: [
      { id: 'l4', title: '4. Cấu trúc DOM và các thẻ cơ bản', type: 'VIDEO', duration: '15:00', isCompleted: true, isCurrent: false },
      { id: 'l5', title: '5. Làm việc với Forms và Validation', type: 'VIDEO', duration: '20:00', isCompleted: false, isCurrent: true }, // Current Lesson
      { id: 'l6', title: '6. Semantic HTML & SEO Basics', type: 'VIDEO', duration: '12:00', isCompleted: false, isCurrent: false },
      { id: 'l7', title: '7. Bài tập thực hành số 1', type: 'QUIZ', duration: '30:00', isCompleted: false, isCurrent: false },
    ]
  },
  {
    id: 'sec3',
    title: 'Chương 3: CSS3 Cơ bản đến Nâng cao',
    duration: '2h 15p',
    lessons: [
      { id: 'l8', title: '8. Box Model & Layout', type: 'VIDEO', duration: '25:00', isCompleted: false, isCurrent: false, isLocked: true },
      { id: 'l9', title: '9. Flexbox Froggy Game', type: 'GAME', duration: '30:00', isCompleted: false, isCurrent: false, isLocked: true },
      { id: 'l10', title: '10. Grid Garden', type: 'VIDEO', duration: '40:00', isCompleted: false, isCurrent: false, isLocked: true },
    ]
  }
];

const CURRENT_LESSON_DATA = {
  id: 'l5',
  title: '5. Làm việc với Forms và Validation',
  videoUrl: 'https://www.youtube.com/watch?v=placeholder', // Mock
  description: `Trong bài học này, chúng ta sẽ tìm hiểu sâu về thẻ <form>, các loại <input> mới trong HTML5 và cách thực hiện validation (kiểm tra dữ liệu) ngay trên trình duyệt mà không cần Javascript.`,
  resources: [
    { name: 'Source Code bài 5', size: '2.5 MB', type: 'ZIP' },
    { name: 'Slide bài giảng', size: '1.2 MB', type: 'PDF' }
  ],
  comments: [
    { id: 1, user: 'Minh Tuấn', avatar: 'https://i.pravatar.cc/150?u=10', content: 'Phần regex cho email validation thầy giải thích rất dễ hiểu ạ.', time: '2 giờ trước', likes: 5 },
    { id: 2, user: 'Lan Anh', avatar: 'https://i.pravatar.cc/150?u=20', content: 'Thầy ơi cho em hỏi thẻ <datalist> dùng khi nào thì hợp lý?', time: '1 ngày trước', likes: 2 }
  ]
};

// --- COMPONENTS ---

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video bg-black group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
      {/* Mock Video Placeholder */}
      <img 
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
        alt="Video Thumbnail" 
        className="w-full h-full object-cover opacity-60"
      />
      
      {/* Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform hover:scale-110">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Play size={32} className="text-indigo-600 fill-indigo-600 ml-1" />
             </div>
          </div>
        </div>
      )}

      {/* Controls Bar (Mock) */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/80 to-transparent px-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="text-white hover:text-indigo-400">
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
         </button>
         
         <div className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer group/timeline relative">
            <div className="absolute h-full bg-indigo-500 w-1/3 rounded-full"></div>
            <div className="absolute h-3 w-3 bg-white rounded-full top-1/2 -translate-y-1/2 left-1/3 shadow-sm scale-0 group-hover/timeline:scale-100 transition-transform"></div>
         </div>
         
         <span className="text-xs text-white font-medium">05:23 / 20:00</span>
         
         <div className="flex items-center gap-3 text-white">
            <Volume2 size={20} />
            <Settings size={20} />
            <Maximize size={20} />
         </div>
      </div>
    </div>
  );
};

const LessonItem = ({ lesson }: { lesson: any }) => {
  return (
    <div className={`flex items-center gap-3 p-3 text-sm cursor-pointer transition-colors ${
      lesson.isCurrent ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'
    } ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
      
      <div className="flex-shrink-0">
         {lesson.isCompleted ? (
            <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
         ) : lesson.isLocked ? (
            <Lock size={18} className="text-slate-400" />
         ) : (
            <PlayCircle size={18} className={`text-slate-400 ${lesson.isCurrent ? 'text-indigo-600' : ''}`} />
         )}
      </div>
      
      <div className="flex-1">
         <p className={`font-medium ${lesson.isCurrent ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</p>
         <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            {lesson.type === 'VIDEO' && <span className="flex items-center gap-1"><PlayCircle size={10} /> Video</span>}
            {lesson.type === 'DOC' && <span className="flex items-center gap-1"><FileText size={10} /> Bài đọc</span>}
            <span>• {lesson.duration}</span>
         </div>
      </div>
    </div>
  );
};

const CourseSidebar = ({ content, isOpen, onClose }: { content: any[], isOpen: boolean, onClose: () => void }) => {
  const [openSections, setOpenSections] = useState<string[]>(['sec1', 'sec2']);

  const toggleSection = (id: string) => {
    setOpenSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <aside className={`fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-200 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:translate-x-0 lg:w-96`}>
       <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <h3 className="font-bold text-slate-800">Nội dung khóa học</h3>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar">
          {content.map((section) => (
             <div key={section.id} className="border-b border-slate-100 last:border-none">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                   <div className="text-left">
                      <h4 className="font-bold text-sm text-slate-800 mb-0.5">{section.title}</h4>
                      <p className="text-xs text-slate-500">{section.lessons.length} bài học • {section.duration}</p>
                   </div>
                   <ChevronDown size={16} className={`text-slate-400 transition-transform ${openSections.includes(section.id) ? 'rotate-180' : ''}`} />
                </button>
                
                {openSections.includes(section.id) && (
                   <div className="bg-white">
                      {section.lessons.map((lesson: any) => (
                         <LessonItem key={lesson.id} lesson={lesson} />
                      ))}
                   </div>
                )}
             </div>
          ))}
       </div>
    </aside>
  );
};

// --- MAIN PAGE ---

const LearningPage = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'QNA' | 'NOTES'>('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-600 overflow-hidden">
      
      {/* 1. HEADER (Compact) */}
      {/* <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50 flex-shrink-0">
         <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
               <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">E</div>
               <div className="hidden md:block">
                  <h1 className="text-sm font-bold leading-tight">Full Stack Web Development 2025</h1>
                  <p className="text-xs text-slate-400">Đã hoàn thành 4/45 bài học</p>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <div className="flex items-center mr-4 bg-white/10 rounded-full px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
               <CheckCircle2 size={14} className="mr-1.5" /> 8% Hoàn thành
            </div>
            <button 
               className="p-2 hover:bg-white/10 rounded-lg lg:hidden"
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
               <Menu size={20} />
            </button>
         </div>
      </header> */}

      {/* 2. BODY */}
      <div className="flex flex-1 overflow-hidden">
         
         {/* LEFT: MAIN CONTENT */}
         <div className="flex-1 flex flex-col overflow-y-auto">
            
            {/* VIDEO AREA */}
            <div className="bg-black w-full">
               <div className="max-w-5xl mx-auto">
                  <VideoPlayer />
               </div>
            </div>

            {/* CONTENT TABS */}
            <div className="flex-1 bg-white max-w-5xl mx-auto w-full border-x border-slate-200 shadow-sm min-h-[500px]">
               {/* Nav Tabs */}
               <div className="flex items-center border-b border-slate-200 px-6 sticky top-0 bg-white z-10">
                  {[
                     { id: 'OVERVIEW', label: 'Tổng quan', icon: FileText },
                     { id: 'QNA', label: 'Hỏi đáp (12)', icon: MessageSquare },
                     { id: 'NOTES', label: 'Ghi chú', icon: FileText },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-colors ${
                           activeTab === tab.id 
                           ? 'border-indigo-600 text-indigo-600' 
                           : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                     >
                        <tab.icon size={16} /> {tab.label}
                     </button>
                  ))}
               </div>

               <div className="p-6">
                  {activeTab === 'OVERVIEW' && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                        <div>
                           <h2 className="text-2xl font-bold text-slate-900 mb-2">{CURRENT_LESSON_DATA.title}</h2>
                           <p className="text-sm text-slate-500">Cập nhật lần cuối: 20/05/2025</p>
                        </div>

                        <div className="prose prose-sm prose-slate max-w-none text-slate-700">
                           <p>{CURRENT_LESSON_DATA.description}</p>
                        </div>

                        {/* Resources */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                           <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Tài liệu đính kèm</h3>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {CURRENT_LESSON_DATA.resources.map((res, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
                                          <Download size={16} />
                                       </div>
                                       <div>
                                          <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700">{res.name}</p>
                                          <p className="text-xs text-slate-400">{res.type} • {res.size}</p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                           <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium">
                              <ThumbsUp size={18} /> Thích
                           </button>
                           <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium">
                              <Share2 size={18} /> Chia sẻ
                           </button>
                           <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium ml-auto">
                              <Flag size={18} /> Báo cáo
                           </button>
                        </div>
                     </div>
                  )}

                  {activeTab === 'QNA' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex gap-4 mb-6">
                           <img src="https://i.pravatar.cc/150?u=user" alt="User" className="w-10 h-10 rounded-full" />
                           <div className="flex-1">
                              <textarea 
                                 placeholder="Bạn có thắc mắc gì về bài học này?" 
                                 className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm"
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                 <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">Gửi câu hỏi</button>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           {CURRENT_LESSON_DATA.comments.map(comment => (
                              <div key={comment.id} className="flex gap-4">
                                 <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full" />
                                 <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                       <span className="font-bold text-sm text-slate-900">{comment.user}</span>
                                       <span className="text-xs text-slate-400">• {comment.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed mb-2">{comment.content}</p>
                                    <div className="flex items-center gap-4">
                                       <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 font-medium"><ThumbsUp size={12} /> {comment.likes} Thích</button>
                                       <button className="text-xs text-slate-500 hover:text-indigo-600 font-medium">Trả lời</button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* NAV FOOTER (Mobile/Tablet) */}
            <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center lg:hidden sticky bottom-0 z-20">
               <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50">
                  <ChevronLeft size={16} /> Bài trước
               </button>
               <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white flex items-center gap-2 hover:bg-indigo-700 shadow-sm">
                  Bài tiếp theo <ChevronRight size={16} />
               </button>
            </div>
         </div>

         {/* RIGHT: CURRICULUM SIDEBAR */}
         <CourseSidebar content={COURSE_CONTENT} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      </div>
    </div>
  );
};

export default LearningPage;