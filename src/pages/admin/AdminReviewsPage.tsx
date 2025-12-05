import { useState } from 'react';
import { Search, Star, Filter } from 'lucide-react';

const AdminReviewsPage = () => {
  const [selectedRating, setSelectedRating] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const mockReviews = [
    { 
      id: '1', 
      userName: 'Nguyễn Văn A', 
      courseTitle: 'Full Stack Web Development 2025', 
      rating: 5,
      comment: 'Khóa học rất hay, giảng viên nhiệt tình và nội dung chất lượng.',
      createdAt: '2025-12-01'
    },
    { 
      id: '2', 
      userName: 'Trần Thị B', 
      courseTitle: 'UI/UX Design Masterclass', 
      rating: 4,
      comment: 'Nội dung tốt nhưng có thể cải thiện phần thực hành.',
      createdAt: '2025-11-28'
    },
    { 
      id: '3', 
      userName: 'Lê Hoàng C', 
      courseTitle: 'Python & AI cho người mới bắt đầu', 
      rating: 5,
      comment: 'Tuyệt vời! Rất phù hợp cho người mới bắt đầu.',
      createdAt: '2025-11-25'
    },
    { 
      id: '4', 
      userName: 'Phạm Minh D', 
      courseTitle: 'Digital Marketing Thực Chiến', 
      rating: 3,
      comment: 'Khóa học ổn nhưng cần cập nhật thêm case study mới.',
      createdAt: '2025-11-20'
    },
  ];

  const filteredReviews = mockReviews.filter(review => {
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'ALL' || review.rating.toString() === selectedRating;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quản lý đánh giá</h1>
          <p className="text-slate-500 mt-1">Xem và quản lý tất cả đánh giá từ học viên</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', '5', '4', '3', '2', '1'].map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 ${
                selectedRating === rating
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {rating !== 'ALL' && <Star size={14} className={selectedRating === rating ? 'fill-white' : 'fill-amber-400'} />}
              {rating === 'ALL' ? 'Tất cả' : rating}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-slate-800">{review.userName}</p>
                <p className="text-sm text-slate-500 mt-1">{review.courseTitle}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-slate-600 mb-3">{review.comment}</p>
            )}
            <p className="text-xs text-slate-400">{review.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviewsPage;

