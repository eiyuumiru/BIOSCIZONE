import { useState, useEffect, type FC } from 'react';
import {
    ArrowRight,
    FileText,
    BookOpen,
    Loader2
} from 'lucide-react';
import { styles } from '../../data';
import { getArticles, type ArticleAPI } from '../../services/api';

const ResourcesView: FC = () => {
    const [resources, setResources] = useState<ArticleAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getArticles('resource')
            .then(data => setResources(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Get icon based on content type
    const getIcon = (item: ArticleAPI) => {
        if (item.file_url?.includes('list') || item.content?.toLowerCase().includes('tổng hợp')) {
            return <BookOpen size={24} />;
        }
        return <FileText size={24} />;
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>Hướng dẫn & Tài nguyên</h2>
                    <p className="text-gray-500 mt-4 max-w-lg mx-auto">Tổng hợp các kiến thức, kỹ năng và công cụ cần thiết cho hành trình nghiên cứu khoa học của bạn.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#0066CC]" size={48} />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>Đã xảy ra lỗi: {error}</p>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Chưa có tài nguyên nào.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {resources.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row sm:items-center gap-6 border-l-4 border-transparent hover:border-[#0099FF]"
                            >
                                <div className="w-12 h-12 bg-[#EDEDED] rounded-lg flex items-center justify-center text-[#000033] group-hover:bg-[#0066CC] group-hover:text-white transition shrink-0">
                                    {getIcon(item)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-blue-50 text-[#0066CC]">
                                            Tài liệu
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">{item.publication_date || item.created_at.slice(0, 10)}</span>
                                    </div>
                                    <h3 className={`text-lg font-bold text-[#000033] group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                        {item.title}
                                    </h3>
                                </div>

                                <div className="shrink-0">
                                    <a
                                        href={item.external_link || item.file_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-bold text-gray-400 group-hover:text-[#0066CC] flex items-center gap-2 transition"
                                    >
                                        Đọc ngay <ArrowRight size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcesView;
