import { useState, useEffect, type FC } from 'react';
import {
    PlayCircle,
    Share2,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { styles } from '../../data';
import { getArticles, type ArticleAPI } from '../../services/api';

const ScienceCornerView: FC = () => {
    const [articles, setArticles] = useState<ArticleAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getArticles('science_corner')
            .then(data => setArticles(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    // Determine article type based on content/file_url
    const getItemType = (item: ArticleAPI): 'video' | 'share' => {
        if (item.file_url?.includes('video') || item.external_link?.includes('youtube') || item.external_link?.includes('youtu.be')) {
            return 'video';
        }
        return 'share';
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-6xl">
                <div className="text-center mb-12">
                    <h2 className={`text-3xl font-extrabold text-[#000033] mb-4 ${styles.fonts.heading}`}>SCIENCE CORNER</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Nơi chia sẻ kinh nghiệm Nghiên cứu khoa học từ sinh viên và các video khoa học thú vị.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-[#0066CC]" size={48} />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>Đã xảy ra lỗi: {error}</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Chưa có bài viết nào trong Science Corner.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((item) => {
                            const itemType = getItemType(item);
                            return (
                                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                                    <div className={`h-48 relative flex items-center justify-center ${itemType === 'video' ? 'bg-gray-900' : 'bg-[#E6F4FF]'}`}>
                                        {itemType === 'video' ? (
                                            <PlayCircle size={64} className="text-white opacity-80 group-hover:scale-110 transition" />
                                        ) : (
                                            <Share2 size={64} className="text-[#0066CC] opacity-50 group-hover:scale-110 transition" />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${itemType === 'video' ? 'bg-red-500 text-white' : 'bg-[#0066CC] text-white'
                                                }`}>
                                                {itemType === 'video' ? 'Video' : 'Chia sẻ'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className={`text-xl font-bold text-[#000033] mb-2 group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-bold mb-3">Tác giả: {item.author || 'Ẩn danh'}</p>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{item.content || 'Không có mô tả'}</p>

                                        <a
                                            href={item.external_link || item.file_url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#0099FF] font-bold text-sm flex items-center gap-2 mt-auto hover:underline"
                                        >
                                            {itemType === 'video' ? 'Xem video' : 'Đọc bài viết'} <ArrowRight size={16} />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScienceCornerView;
