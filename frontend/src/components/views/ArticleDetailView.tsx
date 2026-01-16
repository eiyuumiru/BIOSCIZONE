import { useState, useEffect, type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, FileText, ArrowLeft, Globe } from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { getArticle, type ArticleAPI } from '../../services/api';
import { styles } from '../../data';

const ArticleDetailView: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<ArticleAPI | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getArticle(parseInt(id))
            .then(data => setArticle(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <LoadingSpinner message="Đang tải nội dung..." />;
    }

    if (error || !article) {
        return (
            <div className="min-h-screen pt-40 pb-20 bg-[#EDEDED]">
                <div className="container mx-auto px-8 max-w-2xl text-center">
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText size={40} />
                        </div>
                        <h2 className={`text-2xl font-bold text-[#000033] mb-4 ${styles.fonts.heading}`}>
                            {error === 'Article not found' ? 'Không tìm thấy bài viết' : 'Đã xảy ra lỗi'}
                        </h2>
                        <p className="text-gray-500 mb-8">Rất tiếc, chúng tôi không thể tìm thấy nội dung bạn đang yêu cầu hoặc có lỗi xảy ra trong quá trình tải.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-[#000033] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#EDEDED] overflow-x-hidden">
            <div className="container mx-auto px-6 md:px-12 lg:px-20 max-w-5xl w-full">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#0066CC] mb-8 font-bold transition-all group"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                        <ArrowLeft size={20} />
                    </div>
                    Quay lại
                </button>

                <div className="overflow-hidden">
                    {/* Header/Title Area */}
                    <div className="pb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-2 py-0.5 bg-blue-50 text-[#0066CC] rounded text-[10px] font-bold uppercase tracking-widest">
                                {article.category === 'resource' ? 'Tài nguyên' :
                                    article.category === 'magazine' ? 'Bio-Magazine' :
                                        article.category === 'achievement' ? 'Thành tích' : 'Science Corner'}
                            </span>
                            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                            <span className="text-xs text-gray-400 font-medium">
                                {article.publication_date || article.created_at.slice(0, 10)}
                            </span>
                        </div>

                        <h1 className={`text-3xl md:text-4xl font-extrabold text-[#000033] leading-tight mb-6 ${styles.fonts.heading}`}>
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 items-center">
                            {article.author && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">
                                    <div className="w-6 h-6 bg-[#0066CC] rounded-full flex items-center justify-center text-white">
                                        <User size={12} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{article.author}</span>
                                </div>
                            )}

                            <div className="flex gap-4">
                                {article.external_link && (
                                    <a
                                        href={article.external_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0066CC] hover:text-blue-700 flex items-center gap-1 text-xs font-bold transition"
                                    >
                                        <Globe size={14} /> Liên kết ngoài
                                    </a>
                                )}
                                {article.file_url && (
                                    <a
                                        href={article.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0066CC] hover:text-blue-700 flex items-center gap-1 text-xs font-bold transition"
                                    >
                                        <FileText size={14} /> Xem tài liệu
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="py-8 overflow-hidden">
                        {article.content ? (
                            <div
                                className="prose prose-lg max-w-full text-gray-600 leading-relaxed ql-editor-display"
                                dangerouslySetInnerHTML={{
                                    __html: article.content
                                        .replace(/&nbsp;/g, ' ')
                                        .replace(/\u00A0/g, ' ')
                                }}
                            />
                        ) : (
                            <p className="text-gray-400 italic text-center py-10">Không có nội dung chi tiết cho bài viết này.</p>
                        )}

                        {/* Summary Footer Actions */}
                        {article.file_url && (
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <a
                                    href={article.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex px-8 py-3 bg-[#0066CC] text-white rounded-xl font-bold items-center gap-3 hover:bg-[#0055AA] transition shadow-lg shadow-blue-200 transform hover:-translate-y-0.5"
                                >
                                    Tải tài liệu đi kèm <FileText size={18} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetailView;
