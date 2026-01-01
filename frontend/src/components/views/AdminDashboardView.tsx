import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, FileText, MessageSquare, LogOut, Check, Trash2,
    Plus, X, Mail, Calendar, Eye, Dna
} from 'lucide-react';
import {
    isLoggedIn, logout, getPendingBuddies, approveBuddy, deleteBuddy,
    getAllArticles, createArticle, deleteArticle,
    getFeedbacks, markFeedbackRead,
    type FeedbackAPI, type ArticleCreateData
} from '../../services/adminApi';
import { type BioBuddyAPI, type ArticleAPI } from '../../services/api';
import { styles } from '../../data';

type TabType = 'buddies' | 'articles' | 'feedbacks';

const AdminDashboardView: FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('buddies');
    const [buddies, setBuddies] = useState<BioBuddyAPI[]>([]);
    const [articles, setArticles] = useState<ArticleAPI[]>([]);
    const [feedbacks, setFeedbacks] = useState<FeedbackAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showArticleModal, setShowArticleModal] = useState(false);

    // Check auth on mount
    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/admin');
        }
    }, [navigate]);

    // Load data based on active tab
    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'buddies') {
                const data = await getPendingBuddies();
                setBuddies(data);
            } else if (activeTab === 'articles') {
                const data = await getAllArticles();
                setArticles(data);
            } else {
                const data = await getFeedbacks();
                setFeedbacks(data);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            if ((error as Error).message === 'Session expired') {
                navigate('/admin');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin');
    };

    const handleApproveBuddy = async (id: number) => {
        try {
            await approveBuddy(id);
            setBuddies(buddies.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to approve buddy:', error);
        }
    };

    const handleDeleteBuddy = async (id: number) => {
        if (!confirm('Xác nhận xóa yêu cầu này?')) return;
        try {
            await deleteBuddy(id);
            setBuddies(buddies.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete buddy:', error);
        }
    };

    const handleDeleteArticle = async (id: number) => {
        if (!confirm('Xác nhận xóa bài viết này?')) return;
        try {
            await deleteArticle(id);
            setArticles(articles.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete article:', error);
        }
    };

    const handleMarkRead = async (id: number) => {
        try {
            await markFeedbackRead(id);
            setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, is_read: 1 } : f));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const tabs = [
        { id: 'buddies' as TabType, label: 'Bio-Buddies', icon: Users, count: buddies.length },
        { id: 'articles' as TabType, label: 'Bài viết', icon: FileText, count: articles.length },
        { id: 'feedbacks' as TabType, label: 'Phản hồi', icon: MessageSquare, count: feedbacks.filter(f => !f.is_read).length },
    ];

    return (
        <div className={`min-h-screen bg-[#EDEDED] ${styles.fonts.body}`}>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#EDEDED] rounded-xl flex items-center justify-center border border-[#0099FF]/20">
                            <Dna className="w-6 h-6 text-[#0099FF]" />
                        </div>
                        <div>
                            <h1 className={`text-xl font-bold text-[#000033] ${styles.fonts.heading}`}>Admin Dashboard</h1>
                            <p className="text-xs text-gray-500">BIOSCIZONE Management</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#0066CC] hover:bg-[#EDEDED] rounded-lg transition-all font-medium"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit shadow-sm border border-gray-100">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-[#0066CC] text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-600 hover:text-[#0066CC] hover:bg-[#EDEDED]'
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#0099FF]/10 text-[#0099FF]'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-3 border-[#0099FF]/30 border-t-[#0099FF] rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Bio-Buddies Tab */}
                        {activeTab === 'buddies' && (
                            <div className="space-y-4">
                                {buddies.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
                                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-[#000033] font-medium">Không có yêu cầu đang chờ duyệt</p>
                                    </div>
                                ) : (
                                    buddies.map(buddy => (
                                        <div key={buddy.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#0099FF]/30 hover:shadow-lg transition-all">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className={`text-lg font-bold text-[#000033] ${styles.fonts.heading}`}>{buddy.full_name}</h3>
                                                    <p className="text-gray-500 text-sm">{buddy.email} • {buddy.course}</p>
                                                    <div className="mt-3">
                                                        <p className="text-[#0066CC] font-semibold">{buddy.research_topic}</p>
                                                        <p className="text-gray-600 mt-2">{buddy.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleApproveBuddy(buddy.id)}
                                                        className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all"
                                                        title="Duyệt"
                                                    >
                                                        <Check size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteBuddy(buddy.id)}
                                                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Articles Tab */}
                        {activeTab === 'articles' && (
                            <div>
                                <button
                                    onClick={() => setShowArticleModal(true)}
                                    className="mb-6 flex items-center gap-2 px-5 py-2.5 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5"
                                >
                                    <Plus size={18} />
                                    Thêm bài viết
                                </button>
                                <div className="space-y-4">
                                    {articles.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-[#000033] font-medium">Chưa có bài viết nào</p>
                                        </div>
                                    ) : (
                                        articles.map(article => (
                                            <div key={article.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between hover:border-[#0099FF]/30 hover:shadow-lg transition-all">
                                                <div>
                                                    <span className="px-3 py-1 text-xs font-medium bg-[#0099FF]/10 text-[#0066CC] rounded-full">
                                                        {article.category}
                                                    </span>
                                                    <h3 className={`text-lg font-bold text-[#000033] mt-2 ${styles.fonts.heading}`}>{article.title}</h3>
                                                    <p className="text-gray-500 text-sm mt-1">
                                                        {article.author && `${article.author} • `}
                                                        {article.created_at?.split('T')[0]}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                    className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Feedbacks Tab */}
                        {activeTab === 'feedbacks' && (
                            <div className="space-y-4">
                                {feedbacks.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
                                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-[#000033] font-medium">Chưa có phản hồi nào</p>
                                    </div>
                                ) : (
                                    feedbacks.map(feedback => (
                                        <div
                                            key={feedback.id}
                                            className={`border rounded-2xl p-6 transition-all hover:shadow-lg ${feedback.is_read
                                                    ? 'bg-white border-gray-100'
                                                    : 'bg-[#0099FF]/5 border-[#0099FF]/30'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`text-lg font-bold text-[#000033] ${styles.fonts.heading}`}>{feedback.sender_name}</h3>
                                                        {!feedback.is_read && (
                                                            <span className="px-2 py-0.5 text-xs bg-[#0099FF] text-white rounded-full font-medium">Mới</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                                                        <Mail size={14} />
                                                        {feedback.email}
                                                        <span>•</span>
                                                        <Calendar size={14} />
                                                        {feedback.created_at?.split('T')[0]}
                                                    </p>
                                                    <p className="text-[#0066CC] font-semibold mt-3">{feedback.subject}</p>
                                                    <p className="text-gray-600 mt-2">{feedback.message}</p>
                                                </div>
                                                {!feedback.is_read && (
                                                    <button
                                                        onClick={() => handleMarkRead(feedback.id)}
                                                        className="p-2.5 bg-[#EDEDED] text-gray-600 hover:bg-[#0099FF]/10 hover:text-[#0066CC] rounded-xl transition-all"
                                                        title="Đánh dấu đã đọc"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create Article Modal */}
            {showArticleModal && (
                <ArticleModal
                    onClose={() => setShowArticleModal(false)}
                    onSuccess={(article) => {
                        setArticles([article, ...articles]);
                        setShowArticleModal(false);
                    }}
                />
            )}
        </div>
    );
};

// Article Creation Modal
const ArticleModal: FC<{
    onClose: () => void;
    onSuccess: (article: ArticleAPI) => void;
}> = ({ onClose, onSuccess }) => {
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

export default AdminDashboardView;
