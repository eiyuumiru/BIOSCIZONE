import { useState, useEffect, type FC } from 'react';
import { X, FileText, Send, Loader2, Link as LinkIcon, Save, Calendar } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { createArticle, updateArticle, type ArticleCreateData } from '../../services/adminApi';
import { type ArticleAPI } from '../../services/api';
import { styles } from '../../data';

interface ArticleModalProps {
    category: string;
    categoryLabel: string;
    article?: ArticleAPI;
    onClose: () => void;
    onSuccess: (article: ArticleAPI) => void;
}

const ArticleModal: FC<ArticleModalProps> = ({ category, categoryLabel, article, onClose, onSuccess }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<ArticleCreateData>({
        category: article?.category || category,
        title: article?.title || '',
        content: article?.content || '',
        author: article?.author || '',
        external_link: article?.external_link || '',
        publication_date: article?.publication_date ? article.publication_date.split('T')[0] : undefined,
    });

    const [startDate, setStartDate] = useState<Date | null>(
        article?.publication_date ? new Date(article.publication_date) : null
    );

    useEffect(() => {
        setIsVisible(true);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsAnimating(true);
            });
        });
    }, []);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            setError(null);
            onClose();
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Convert Date to yyyy-mm-dd for API
            const apiData = { ...formData };
            if (startDate) {
                const y = startDate.getFullYear();
                const m = String(startDate.getMonth() + 1).padStart(2, '0');
                const d = String(startDate.getDate()).padStart(2, '0');
                apiData.publication_date = `${y}-${m}-${d}`;
            } else {
                apiData.publication_date = undefined;
            }

            let result: ArticleAPI;
            if (article) {
                await updateArticle(article.id, apiData);
                result = {
                    ...article,
                    ...apiData,
                    publication_date: apiData.publication_date ? `${apiData.publication_date}T00:00:00Z` : undefined
                } as ArticleAPI;
            } else {
                result = await createArticle(apiData);
            }

            setIsAnimating(false);
            setTimeout(() => {
                setIsVisible(false);
                onSuccess(result);
            }, 300);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            <div className={`bg-white w-full max-w-6xl rounded-2xl shadow-2xl relative z-10 overflow-hidden transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Header - Similar to IdeaModal */}
                <div className="bg-[#000033] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0099FF] rounded-lg flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${styles.fonts.heading}`}>
                                {article ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
                            </h3>
                            <p className="text-xs text-[#0099FF] font-medium uppercase tracking-wider">{categoryLabel}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Info */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-[#000033] uppercase border-b border-gray-100 pb-2">Thông tin cơ bản</h4>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tiêu đề <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tác giả</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    placeholder="Tên tác giả hoặc nguồn"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ngày đăng</label>
                                <div className="date-picker-wrapper">
                                    <DatePicker
                                        onChange={(date) => setStartDate(date as Date | null)}
                                        value={startDate}
                                        format="dd/MM/yyyy"
                                        locale="vi-VN"
                                        calendarIcon={<Calendar size={18} />}
                                        clearIcon={null}
                                        className="premium-date-picker"
                                        calendarProps={{
                                            navigationLabel: ({ date }) => {
                                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                                const year = date.getFullYear();
                                                return `${month}/${year}`;
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                                    <LinkIcon size={12} /> Xem chi tiết
                                </label>
                                <input
                                    type="url"
                                    value={formData.external_link}
                                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        {/* Right Column - Content */}
                        <div className="space-y-4 flex flex-col">
                            <h4 className="text-sm font-bold text-[#000033] uppercase border-b border-gray-100 pb-2">Nội dung bài viết</h4>

                            <div className="space-y-2 flex-grow flex flex-col article-editor">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mô tả / Nội dung</label>
                                <div className="flex-grow min-h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        placeholder="Nhập nội dung hoặc mô tả ngắn gọn về bài viết..."
                                        className="h-[350px]"
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'script': 'sub' }, { 'script': 'super' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full md:flex-1 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition order-2 md:order-1 disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:flex-1 py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 order-1 md:order-2 disabled:opacity-50 disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> {article ? 'Đang lưu...' : 'Đang tạo...'}
                                </>
                            ) : (
                                <>
                                    {article ? (
                                        <>
                                            <Save size={16} /> Lưu thay đổi
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} className="transform -rotate-45 mt-1.5" /> Tạo bài viết
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleModal;
