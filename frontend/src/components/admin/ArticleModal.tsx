import { useState, type FC } from 'react';
import { X } from 'lucide-react';
import { createArticle, type ArticleCreateData } from '../../services/adminApi';
import { type ArticleAPI } from '../../services/api';
import { styles } from '../../data';

interface ArticleModalProps {
    onClose: () => void;
    onSuccess: (article: ArticleAPI) => void;
}

const ArticleModal: FC<ArticleModalProps> = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState<ArticleCreateData>({
        category: 'news',
        title: '',
        content: '',
        author: '',
        external_link: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { value: 'news', label: 'Tin tức' },
        { value: 'achievement', label: 'Thành tích' },
        { value: 'magazine', label: 'Bio-Magazine' },
        { value: 'science_corner', label: 'Science Corner' },
        { value: 'resource', label: 'Tài nguyên' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const article = await createArticle(formData);
            onSuccess(article);
        } catch (error) {
            console.error('Failed to create article:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className={`text-xl font-bold text-[#000033] ${styles.fonts.heading}`}>Thêm bài viết mới</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-[#EDEDED] rounded-lg transition-all">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Danh mục</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Tiêu đề *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            required
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Tác giả</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Nội dung</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20 resize-none"
                        />
                    </div>

                    {/* External Link */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Link ngoài</label>
                        <input
                            type="url"
                            value={formData.external_link}
                            onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            placeholder="https://..."
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-[#EDEDED] text-[#000033] font-medium rounded-xl hover:bg-gray-200 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-[#0055AA] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Tạo bài viết'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleModal;
