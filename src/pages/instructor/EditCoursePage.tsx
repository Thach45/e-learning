import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Save } from 'lucide-react';
import { useInstructorCourse, useUpdateInstructorCourse } from '../../hooks/useInstructorCourses';
import { useCategories } from '../../hooks/useCategories';
import type { CourseLevel } from '../../api/instructor';

const EditCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading: courseLoading, error: courseError } = useInstructorCourse(id || '');
  const updateMutation = useUpdateInstructorCourse();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    salePrice: '',
    thumbnail: '',
    introVideo: '',
    isFeatured: false,
    level: 'BEGINNER' as CourseLevel,
    categoryId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load course data when available
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        price: course.price || 0,
        salePrice: course.salePrice?.toString() || '',
        thumbnail: course.thumbnail || '',
        introVideo: course.introVideo || '',
        isFeatured: course.isFeatured || false,
        level: course.level || 'BEGINNER',
        categoryId: course.categoryId || '',
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.title.trim()) {
      setErrors({ title: 'Vui lòng nhập tiêu đề khóa học' });
      return;
    }

    if (formData.price < 0) {
      setErrors({ price: 'Giá không được âm' });
      return;
    }

    const salePrice = formData.salePrice ? parseFloat(formData.salePrice) : null;
    if (salePrice !== null && salePrice < 0) {
      setErrors({ salePrice: 'Giá khuyến mãi không được âm' });
      return;
    }

    if (salePrice !== null && salePrice >= formData.price) {
      setErrors({ salePrice: 'Giá khuyến mãi phải nhỏ hơn giá gốc' });
      return;
    }

    if (!id) return;

    updateMutation.mutate(
      {
        id,
        body: {
          title: formData.title.trim(),
          price: formData.price,
          salePrice: salePrice,
          thumbnail: formData.thumbnail || null,
          introVideo: formData.introVideo || null,
          isFeatured: formData.isFeatured,
          level: formData.level,
          categoryId: formData.categoryId || null,
        },
      },
      {
        onSuccess: () => {
          navigate('/instructor/courses');
        },
        onError: (error: any) => {
          setErrors({ general: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật khóa học' });
        },
      }
    );
  };

  if (courseLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-center gap-3">
          <AlertCircle className="text-rose-600" size={24} />
          <div>
            <p className="font-semibold text-rose-800">Không tìm thấy khóa học</p>
            <p className="text-sm text-rose-600">Khóa học không tồn tại hoặc bạn không có quyền chỉnh sửa.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/instructor/courses')}
          className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/instructor/courses')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Chỉnh sửa khóa học</h1>
          <p className="text-slate-500 mt-1">Cập nhật thông tin khóa học</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        {errors.general && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-rose-600" size={20} />
            <p className="text-rose-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Tiêu đề khóa học <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all ${
              errors.title ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
            }`}
            placeholder="Ví dụ: Full Stack Web Development 2025"
            required
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
        </div>

        {/* Price & Sale Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Giá khóa học (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all ${
                errors.price ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
              }`}
              placeholder="299000"
              required
            />
            {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Giá khuyến mãi (VND) <span className="text-slate-400 text-xs">(tùy chọn)</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all ${
                errors.salePrice ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
              }`}
              placeholder="199000"
            />
            {errors.salePrice && <p className="mt-1 text-xs text-rose-600">{errors.salePrice}</p>}
          </div>
        </div>

        {/* Level & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cấp độ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
              className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
            >
              <option value="BEGINNER">Cơ bản</option>
              <option value="INTERMEDIATE">Trung bình</option>
              <option value="ADVANCED">Nâng cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Danh mục <span className="text-slate-400 text-xs">(tùy chọn)</span>
            </label>
            {categoriesLoading ? (
              <div className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-slate-400" />
                <span className="text-sm text-slate-500">Đang tải...</span>
              </div>
            ) : (
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Link hình ảnh thumbnail <span className="text-slate-400 text-xs">(tùy chọn)</span>
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
            placeholder="https://example.com/image.jpg"
          />
          {formData.thumbnail && (
            <img
              src={formData.thumbnail}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-slate-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>

        {/* Intro Video */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Link video giới thiệu <span className="text-slate-400 text-xs">(tùy chọn)</span>
          </label>
          <input
            type="url"
            value={formData.introVideo}
            onChange={(e) => setFormData({ ...formData, introVideo: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-5 h-5 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700">
            Đánh dấu là khóa học nổi bật
          </label>
        </div>

        {/* Status Info */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-1">Trạng thái hiện tại:</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            course.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' :
            course.status === 'DRAFT' ? 'bg-slate-50 text-slate-700' :
            course.status === 'PENDING_PUBLISHED' ? 'bg-amber-50 text-amber-700' :
            'bg-rose-50 text-rose-700'
          }`}>
            {course.status === 'PUBLISHED' ? 'Đã xuất bản' :
             course.status === 'DRAFT' ? 'Bản nháp' :
             course.status === 'PENDING_PUBLISHED' ? 'Chờ duyệt' :
             course.status === 'ARCHIVED' ? 'Đã lưu trữ' : course.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/instructor/courses')}
            className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateMutation.isPending && <Loader2 size={18} className="animate-spin" />}
            {updateMutation.isPending ? 'Đang lưu...' : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCoursePage;

