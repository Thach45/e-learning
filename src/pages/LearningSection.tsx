import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  FileText, 
  MessageSquare, 
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
  Lock,
  Edit3,
  Trash2,
  Send,
  Loader2
} from 'lucide-react';
import { useEnrolledCourseContents, useLessonDetail } from '../hooks/useEnrollments';
import type { CourseContentSection, LessonItem } from '../api/enrollments';
import { useCommentsByLesson, useCreateComment, useUpdateComment, useDeleteComment } from '../hooks/useComments';
import type { Comment, CreateCommentBody } from '../api/comments';
import { useAuthStatus } from '../hooks/useAuthStatus';

// --- COMPONENTS ---

const VideoPlayer = ({ videoUrl, storageType, thumbnailUrl }: { videoUrl?: string | null; storageType?: string; thumbnailUrl?: string | null }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  
  const getYouTubeEmbedUrl = (url: string) => {
   
    return url ? `https://www.youtube.com/embed/${url}` : null;
  };

  const getGoogleDriveEmbedUrl = (url: string) => {
    if (!url) return null;

    const trimmedUrl = url.trim();
    const idOnlyPattern = /^[a-zA-Z0-9_-]{20,}$/;
    if (idOnlyPattern.test(trimmedUrl)) {
      return `https://drive.google.com/file/d/${trimmedUrl}/preview`;
    }

    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = trimmedUrl.match(pattern);
      if (match?.[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    return trimmedUrl;
  };

  const getVideoUrl = () => {
    if (!videoUrl) return null;
    if (storageType === 'YOUTUBE') {
      return getYouTubeEmbedUrl(videoUrl);
    }
    if (storageType === 'GOOGLE_DRIVE') {
      return getGoogleDriveEmbedUrl(videoUrl);
    }
    return videoUrl;
  };

  const embedUrl = getVideoUrl();

  return (
    <div className="relative aspect-video bg-black group">
      {embedUrl && isPlaying ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img 
            src={thumbnailUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
            alt="Video Thumbnail" 
            className="w-full h-full object-cover opacity-60"
          />
          
          {/* Play Button Overlay */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
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

          {storageType === 'GOOGLE_DRIVE' && videoUrl && (
            <div className="absolute top-3 right-3">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-md bg-white/90 text-slate-700 hover:bg-white"
              >
                Mo truc tiep tren Drive
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Comment Item Component
const CommentItem = ({
  comment,
  lessonId,
  onReply,
  onEdit,
  onDelete,
  editingComment,
  editContent,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  formatDate,
  currentUserId,
}: {
  comment: Comment;
  lessonId: string;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  editingComment: string | null;
  editContent: string;
  onEditChange: (content: string) => void;
  onSaveEdit: (commentId: string) => void;
  onCancelEdit: () => void;
  formatDate: (date: string) => string;
  currentUserId?: string;
}) => {
  const isEditing = editingComment === comment.id;
  const replies = comment.replies || [];
  const isMyComment = currentUserId === comment.userId;

  return (
    <div className="border-b border-slate-100 pb-4 last:border-none bg-white">
      <div className="flex gap-3">
        <img
          src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'User')}&background=random`}
          alt={comment.user?.name || 'User'}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h4 className="font-semibold text-sm text-slate-900">{comment.user?.name || 'Người dùng'}</h4>
              <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onReply(comment.id)}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
              >
                Trả lời
              </button>
              {isMyComment && (
                <>
                  <button
                    onClick={() => onEdit(comment.id, comment.content)}
                    className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-xs text-slate-500 hover:text-rose-600 font-medium transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => onEditChange(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onSaveEdit(comment.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Lưu
                </button>
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1.5 border border-slate-300 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed mb-2">{comment.content}</p>
          )}

          {/* Replies */}
          {replies.length > 0 && (
            <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-200 space-y-4">
              {replies.map((reply) => (
                <div key={reply.id} className="flex gap-3">
                  <img
                    src={reply.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user?.name || 'User')}&background=random`}
                    alt={reply.user?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h5 className="font-semibold text-xs text-slate-900">{reply.user?.name || 'Người dùng'}</h5>
                        <span className="text-xs text-slate-400">{formatDate(reply.createdAt)}</span>
                      </div>
                      {currentUserId === reply.userId && (
                        <div className="flex items-center gap-2">
                          {editingComment === reply.id ? (
                            <>
                              <button
                                onClick={() => onSaveEdit(reply.id)}
                                className="text-xs text-indigo-600 font-medium"
                              >
                                Lưu
                              </button>
                              <button
                                onClick={onCancelEdit}
                                className="text-xs text-slate-500 font-medium"
                              >
                                Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => onEdit(reply.id, reply.content)}
                                className="text-xs text-slate-500 hover:text-indigo-600"
                              >
                                <Edit3 size={12} />
                              </button>
                              <button
                                onClick={() => onDelete(reply.id)}
                                className="text-xs text-slate-500 hover:text-rose-600"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {editingComment === reply.id ? (
                      <textarea
                        value={editContent}
                        onChange={(e) => onEditChange(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                        rows={2}
                      />
                    ) : (
                      <p className="text-xs text-slate-700 leading-relaxed">{reply.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LessonItemComponent = ({ 
  lesson, 
  isCurrent, 
  onClick 
}: { 
  lesson: LessonItem; 
  isCurrent: boolean;
  onClick: () => void;
}) => {
  return (
    <div 
      className={`flex items-center gap-3 p-3 text-sm cursor-pointer transition-colors ${
        isCurrent ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'
      } ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={lesson.isLocked ? undefined : onClick}
    >
      
      <div className="flex-shrink-0">
         {lesson.isLocked ? (
            <Lock size={18} className="text-slate-400" />
         ) : (
            <PlayCircle size={18} className={`text-slate-400 ${isCurrent ? 'text-indigo-600' : ''}`} />
         )}
      </div>
      
      <div className="flex-1">
         <p className={`font-medium ${isCurrent ? 'text-indigo-700' : 'text-slate-700'}`}>{lesson.title}</p>
         <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            {lesson.type === 'VIDEO' && <span className="flex items-center gap-1"><PlayCircle size={10} /> Video</span>}
            {lesson.type === 'TEXT' && <span className="flex items-center gap-1"><FileText size={10} /> Bài đọc</span>}
            {lesson.type === 'QUIZ' && <span className="flex items-center gap-1"><FileText size={10} /> Quiz</span>}
            {lesson.type === 'GAME' && <span className="flex items-center gap-1"><PlayCircle size={10} /> Game</span>}
            {lesson.duration && <span>• {lesson.duration}</span>}
         </div>
      </div>
    </div>
  );
};

const CourseSidebar = ({ 
  content, 
  isOpen, 
  onClose, 
  currentLessonId,
  onLessonClick 
}: { 
  content: CourseContentSection[]; 
  isOpen: boolean; 
  onClose: () => void;
  currentLessonId?: string;
  onLessonClick: (lessonId: string) => void;
}) => {
  const [openSections, setOpenSections] = useState<string[]>(content.map(s => s.id));

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
                      <p className="text-xs text-slate-500">{section.lessons.length} bài học {section.duration && `• ${section.duration}`}</p>
                   </div>
                   <ChevronDown size={16} className={`text-slate-400 transition-transform ${openSections.includes(section.id) ? 'rotate-180' : ''}`} />
                </button>
                
                {openSections.includes(section.id) && (
                   <div className="bg-white">
                      {section.lessons.map((lesson) => (
                         <LessonItemComponent 
                           key={lesson.id} 
                           lesson={lesson}
                           isCurrent={lesson.id === currentLessonId}
                           onClick={() => onLessonClick(lesson.id)}
                         />
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
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStatus();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'QNA' | 'NOTES'>('OVERVIEW');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch course contents
  const { data: contentsData, isLoading: contentsLoading } = useEnrolledCourseContents(courseId || '');
  
  // Get first lesson if no lessonId provided
  const firstLessonId = contentsData?.contents[0]?.lessons[0]?.id;
  const currentLessonId = lessonId || firstLessonId;

  // Fetch lesson detail
  const { data: lessonData, isLoading: lessonLoading } = useLessonDetail(
    courseId || '',
    currentLessonId || ''
  );

  // Comments
  const [commentsPage, setCommentsPage] = useState(1);
  const [allComments, setAllComments] = useState<any[]>([]);
  const { data: commentsData, isLoading: isLoadingComments } = useCommentsByLesson(
    currentLessonId || '', 
    { page: commentsPage, limit: 10, parentId: null } // Only top-level comments
  );

  // Accumulate comments when page changes
  useEffect(() => {
    if (commentsData?.data) {
      if (commentsPage === 1) {
        // Reset on first page
        setAllComments(commentsData.data.filter((c: any) => !c.parentId));
      } else {
        // Append new comments
        setAllComments(prev => {
          const newComments = commentsData.data.filter((c: any) => !c.parentId);
          const existingIds = new Set(prev.map(c => c.id));
          return [...prev, ...newComments.filter(c => !existingIds.has(c.id))];
        });
      }
    }
  }, [commentsData, commentsPage]);

  // Reset comments when lesson changes
  useEffect(() => {
    setCommentsPage(1);
    setAllComments([]);
  }, [currentLessonId]);
  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  // Comment form state
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleLessonClick = (lessonId: string) => {
    navigate(`/learn/course/${courseId}/lesson/${lessonId}`);
    setCommentsPage(1); // Reset comments page when switching lessons
    setAllComments([]); // Reset accumulated comments
    setReplyingTo(null);
    setEditingComment(null);
  };

  const handleSubmitComment = () => {
    if (!commentContent.trim()) {
      toast.error('Vui lòng nhập nội dung comment');
      return;
    }

    if (!currentLessonId) return;

    const body: CreateCommentBody = {
      content: commentContent.trim(),
      parentId: replyingTo || null,
    };

    createCommentMutation.mutate(
      { lessonId: currentLessonId, body },
      {
        onSuccess: () => {
          setCommentContent('');
          setReplyingTo(null);
          // Reset to page 1 to show new comment
          setCommentsPage(1);
          setAllComments([]);
        },
      }
    );
  };

  const handleUpdateComment = (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Vui lòng nhập nội dung comment');
      return;
    }

    if (!currentLessonId) return;

    updateCommentMutation.mutate(
      { lessonId: currentLessonId, commentId, body: { content: editContent.trim() } },
      {
        onSuccess: () => {
          setEditingComment(null);
          setEditContent('');
        },
      }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentLessonId) return;
    if (!confirm('Bạn có chắc muốn xóa comment này?')) return;

    deleteCommentMutation.mutate({ lessonId: currentLessonId, commentId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  if (!courseId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Course ID is required</p>
      </div>
    );
  }

  if (contentsLoading || lessonLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!contentsData || !lessonData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-slate-500">Không tìm thấy dữ liệu</p>
      </div>
    );
  }

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
                  <VideoPlayer 
                    videoUrl={lessonData.storageUrl} 
                    storageType={lessonData.storageType}
                    thumbnailUrl={contentsData.thumbnailUrl}
                  />
               </div>
            </div>

            {/* CONTENT TABS */}
            <div className="flex-1 bg-white max-w-5xl mx-auto w-full border-x border-slate-200 shadow-sm min-h-[500px]">
               {/* Nav Tabs */}
               <div className="flex items-center border-b border-slate-200 px-6 sticky top-0 bg-white z-10">
                  {[
                     { id: 'OVERVIEW', label: 'Tổng quan', icon: FileText },
                     { id: 'QNA', label: `Hỏi đáp (${commentsData?.total || 0})`, icon: MessageSquare },
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
                           <h2 className="text-2xl font-bold text-slate-900 mb-2">{lessonData.title}</h2>
                           {lessonData.description && (
                              <p className="text-sm text-slate-500">{lessonData.description}</p>
                           )}
                        </div>

                        {lessonData.contentText && (
                           <div className="prose prose-sm prose-slate max-w-none text-slate-700">
                              <p>{lessonData.contentText}</p>
                           </div>
                        )}

                        {/* Resources */}
                        {lessonData.resources && lessonData.resources.length > 0 && (
                           <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Tài liệu đính kèm</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {lessonData.resources.map((res, i) => (
                                    <a
                                       key={i}
                                       href={res.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer group"
                                    >
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
                                             <Download size={16} />
                                          </div>
                                          <div>
                                             <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700">{res.name}</p>
                                             <p className="text-xs text-slate-400">{res.type} {res.size && `• ${res.size}`}</p>
                                          </div>
                                       </div>
                                    </a>
                                 ))}
                              </div>
                           </div>
                        )}

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
                  {/* Comments Section */}
                  {activeTab === 'QNA' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        {/* Comment Form */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                           <div className="flex gap-3">
                              <div className="flex-1">
                                 {replyingTo && (
                                    <div className="mb-2 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                                       <span className="text-xs text-indigo-700 font-medium">
                                          Đang trả lời comment...
                                       </span>
                                       <button
                                          onClick={() => setReplyingTo(null)}
                                          className="text-indigo-600 hover:text-indigo-800"
                                       >
                                          <X size={14} />
                                       </button>
                                    </div>
                                 )}
                                 <textarea 
                                    placeholder={replyingTo ? "Viết phản hồi..." : "Bạn có thắc mắc gì về bài học này?"} 
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm resize-none"
                                 />
                                 <div className="flex justify-end mt-2 gap-2">
                                    {replyingTo && (
                                       <button
                                          onClick={() => setReplyingTo(null)}
                                          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                       >
                                          Hủy
                                       </button>
                                    )}
                                    <button
                                       onClick={handleSubmitComment}
                                       disabled={createCommentMutation.isPending || !commentContent.trim()}
                                       className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                       {createCommentMutation.isPending ? (
                                          <>
                                             <Loader2 size={14} className="animate-spin" />
                                             Đang gửi...
                                          </>
                                       ) : (
                                          <>
                                             <Send size={14} />
                                             {replyingTo ? 'Gửi phản hồi' : 'Gửi comment'}
                                          </>
                                       )}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Comments List */}
                        {isLoadingComments && commentsPage === 1 ? (
                           <div className="flex items-center justify-center py-12 bg-white rounded-xl">
                              <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
                           </div>
                        ) : allComments.length > 0 || (commentsData && commentsData.data.length > 0) ? (
                           <div className="bg-white rounded-xl border border-slate-200 p-6">
                              <div className="space-y-6">
                                 {allComments.length > 0 ? allComments.map((comment) => (
                                    <CommentItem
                                       key={comment.id}
                                       comment={comment}
                                       lessonId={currentLessonId || ''}
                                       onReply={(commentId) => {
                                          setReplyingTo(commentId);
                                          setEditingComment(null);
                                       }}
                                       onEdit={(commentId, content) => {
                                          setEditingComment(commentId);
                                          setEditContent(content);
                                          setReplyingTo(null);
                                       }}
                                       onDelete={handleDeleteComment}
                                       editingComment={editingComment}
                                       editContent={editContent}
                                       onEditChange={setEditContent}
                                       onSaveEdit={handleUpdateComment}
                                       onCancelEdit={() => {
                                          setEditingComment(null);
                                          setEditContent('');
                                       }}
                                       formatDate={formatDate}
                                       currentUserId={user?.id}
                                    />
                                 )) : commentsData?.data
                                    .filter((comment) => !comment.parentId)
                                    .map((comment) => (
                                       <CommentItem
                                          key={comment.id}
                                          comment={comment}
                                          lessonId={currentLessonId || ''}
                                          onReply={(commentId) => {
                                             setReplyingTo(commentId);
                                             setEditingComment(null);
                                          }}
                                          onEdit={(commentId, content) => {
                                             setEditingComment(commentId);
                                             setEditContent(content);
                                             setReplyingTo(null);
                                          }}
                                          onDelete={handleDeleteComment}
                                          editingComment={editingComment}
                                          editContent={editContent}
                                          onEditChange={setEditContent}
                                          onSaveEdit={handleUpdateComment}
                                          onCancelEdit={() => {
                                             setEditingComment(null);
                                             setEditContent('');
                                          }}
                                          formatDate={formatDate}
                                          currentUserId={user?.id}
                                       />
                                    ))}

                                 {/* Pagination */}
                                 {commentsData && commentsData.totalPages > commentsPage && (
                                    <div className="pt-4 border-t border-slate-100">
                                       {isLoadingComments ? (
                                          <div className="flex items-center justify-center py-4">
                                             <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />
                                          </div>
                                       ) : (
                                          <button
                                             onClick={() => setCommentsPage(prev => prev + 1)}
                                             className="w-full py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                          >
                                             Xem thêm comment ({commentsData.total - allComments.length} còn lại)
                                          </button>
                                       )}
                                    </div>
                                 )}
                              </div>
                           </div>
                        ) : (
                           <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                              <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
                              <p>Chưa có comment nào. Hãy là người đầu tiên đặt câu hỏi!</p>
                           </div>
                        )}
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
         <CourseSidebar 
            content={contentsData.contents} 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)}
            currentLessonId={currentLessonId}
            onLessonClick={handleLessonClick}
         />

      </div>
    </div>
  );
};

export default LearningPage;