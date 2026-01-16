import { useState, useEffect, type FC } from 'react';
import {
    Trophy,
    Search
} from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { styles } from '../../data';
import { getArticles, type ArticleAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AchievementsView: FC = () => {
    const [achievements, setAchievements] = useState<ArticleAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getArticles('achievement')
            .then(data => setAchievements([...data].sort((a, b) => b.id - a.id)))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Filter achievements by search query
    const filteredAchievements = achievements.filter(item => {
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
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>BẢNG VÀNG THÀNH TÍCH</h2>
                    <p className="text-gray-500 mt-4">Vinh danh những nỗ lực nghiên cứu không ngừng nghỉ.</p>
                </div>

                {/* Search Bar */}
                <div className="mb-10 flex justify-center">
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm thành tích, tác giả..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner fullScreen={false} message="Đang tải thành tích..." />
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>Đã xảy ra lỗi: {error}</p>
                    </div>
                ) : filteredAchievements.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>{searchQuery ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có thành tích nào được ghi nhận.'}</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-[#0099FF]/30 ml-4 md:ml-10 space-y-12">
                        {filteredAchievements.map((item) => (
                            <div key={item.id} className="relative pl-8 md:pl-12">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#0099FF] ring-4 ring-[#EDEDED]"></div>

                                <div
                                    onClick={() => navigate(`/article/${item.id}`)}
                                    className="bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 shrink-0 group-hover:scale-110 transition">
                                            <Trophy size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="inline-block px-3 py-1 bg-[#000033] text-white text-[10px] font-bold uppercase rounded mb-2">
                                                {item.category}
                                            </span>
                                            <h3 className={`text-xl font-bold text-[#000033] mb-2 group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-1 line-clamp-2"><span className="font-bold">Mô tả:</span> {item.content ? item.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : 'Không có mô tả'}</p>
                                            {item.author && <p className="text-[#0066CC] text-sm font-bold">{item.author}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsView;

