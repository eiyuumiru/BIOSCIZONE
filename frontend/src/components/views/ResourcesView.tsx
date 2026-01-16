import { useState, useEffect, type FC } from 'react';
import {
    ArrowRight,
    FileText,
    BookOpen,
    Search
} from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { styles } from '../../data';
import { getArticles, type ArticleAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ResourcesView: FC = () => {
    const [resources, setResources] = useState<ArticleAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

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

    // Filter resources by search query
    const filteredResources = resources.filter(item => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.title?.toLowerCase().includes(query) ||
            item.content?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-4xl">
                <div className="text-center mb-10">
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>Tài nguyên</h2>
                    <p className="text-gray-500 mt-4 max-w-lg mx-auto">Tổng hợp các kiến thức, kỹ năng và công cụ cần thiết cho hành trình nghiên cứu khoa học của bạn.</p>
                </div>

                {/* Search Bar */}
                <div className="mb-10 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài nguyên..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner fullScreen={false} message="Đang tải tài nguyên..." />
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>Đã xảy ra lỗi: {error}</p>
                    </div>
                ) : filteredResources.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>{searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có tài nguyên nào.'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredResources.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/article/${item.id}`)}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col sm:flex-row sm:items-center gap-6 border-l-4 border-transparent hover:border-[#0099FF] cursor-pointer"
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
                                        href={item.external_link || item.file_url || `/article/${item.id}`}
                                        target={(item.external_link || item.file_url) ? "_blank" : "_self"}
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
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

