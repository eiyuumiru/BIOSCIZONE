import { useState, useEffect, type FC } from 'react';
import {
    FileText,
    ArrowRight,
    Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../layout/LoadingSpinner';
import { styles } from '../../data';
import { getArticles, type ArticleAPI } from '../../services/api';

const BioMagazineView: FC = () => {
    const [articles, setArticles] = useState<ArticleAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getArticles('magazine')
            .then(data => setArticles(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Filter articles by search query
    const filteredArticles = articles.filter(item => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            item.title?.toLowerCase().includes(query) ||
            item.author?.toLowerCase().includes(query) ||
            item.content?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-5xl">
                <div className="text-center mb-10">
                    <h2 className={`text-3xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>BIO-MAGAZINE</h2>
                    <p className="text-gray-600 mt-2">Tổng hợp bài báo, tạp chí Nghiên cứu khoa học của Giảng viên & Sinh viên.</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết, tác giả..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner fullScreen={false} message="Đang tải Bio-Magazine..." />
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>Đã xảy ra lỗi: {error}</p>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>{searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có bài báo nào trong Bio-Magazine.'}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredArticles.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/article/${item.id}`)}
                                className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-transparent hover:border-[#000033] group cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] text-center">
                                        <FileText size={32} className="text-gray-300 mb-1 group-hover:text-[#000033] transition" />
                                        <span className="text-xs font-bold text-gray-400">{item.publication_date?.slice(0, 4) || 'N/A'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-lg md:text-xl font-bold text-[#000033] mb-2 group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 italic mb-1">{item.author || 'Unknown Author'}</p>
                                        <p className="text-sm text-[#0066CC] font-medium line-clamp-2">{item.content ? item.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : 'No description'}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/article/${item.id}`); }}
                                        className="p-2 text-gray-400 hover:text-[#0066CC] transition"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BioMagazineView;

