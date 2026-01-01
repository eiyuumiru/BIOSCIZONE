import { useState, useEffect, type FC } from 'react';
import {
    FileText,
    ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { styles } from '../../data';
import { getArticles, type ArticleAPI } from '../../services/api';

const BioMagazineView: FC = () => {
    const [articles, setArticles] = useState<ArticleAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getArticles('magazine')
            .then(data => setArticles(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-5xl">
                <div className="mb-10 border-b border-gray-300 pb-4">
                    <h2 className={`text-3xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>BIO-MAGAZINE</h2>
                    <p className="text-gray-600 mt-2">Tổng hợp bài báo, tạp chí Nghiên cứu khoa học của Giảng viên & Sinh viên.</p>
                </div>

                {loading ? (
                    <LoadingSpinner fullScreen={false} message="Đang tải Bio-Magazine..." />
                ) : error ? (
                    <div className="text-center py-20 text-red-500">
                        <p>Đã xảy ra lỗi: {error}</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <p>Chưa có bài báo nào trong Bio-Magazine.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {articles.map((item) => (
                            <div key={item.id} className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-transparent hover:border-[#000033] group">
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
                                        <p className="text-sm text-[#0066CC] font-medium">{item.content || 'No description'}</p>
                                    </div>
                                    <a
                                        href={item.external_link || item.file_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-[#0066CC] transition"
                                    >
                                        <ArrowRight size={24} />
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

export default BioMagazineView;
