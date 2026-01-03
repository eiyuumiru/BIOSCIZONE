import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, FileText, MessageSquare, LogOut, Check, Trash2,
    Plus, Mail, Calendar, Eye, Dna, Settings, UserCog, Shield, Clock, Edit
} from 'lucide-react';
import {
    isLoggedIn, logout, getPendingBuddies, approveBuddy, deleteBuddy,
    getAllArticles, deleteArticle,
    getFeedbacks, markFeedbackRead,
    getUserRoleFromToken, getSettings, updateSetting,
    listAdmins, deleteAdmin, getAuditLogs,
    type FeedbackAPI,
    type AdminUser, type SystemSetting, type AuditLog
} from '../../services/adminApi';
import { getBuddies, type BioBuddyAPI, type ArticleAPI } from '../../services/api';
import LoadingSpinner from '../layout/LoadingSpinner';
import ArticleModal from '../admin/ArticleModal';
import AdminModal from '../admin/AdminModal';
import { styles } from '../../data';

type TabType = 'buddies' | 'articles' | 'feedbacks' | 'admins' | 'settings';
type BuddySubTab = 'pending' | 'approved';

const AdminDashboardView: FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('buddies');
    const [buddySubTab, setBuddySubTab] = useState<BuddySubTab>('pending');
    const [pendingBuddies, setPendingBuddies] = useState<BioBuddyAPI[]>([]);
    const [approvedBuddies, setApprovedBuddies] = useState<BioBuddyAPI[]>([]);
    const [articles, setArticles] = useState<ArticleAPI[]>([]);
    const [feedbacks, setFeedbacks] = useState<FeedbackAPI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showArticleModal, setShowArticleModal] = useState(false);

    // Superadmin states
    const [userRole, setUserRole] = useState<'admin' | 'superadmin' | null>(null);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

    // Check auth on mount and get role
    useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/admin');
        } else {
            const role = getUserRoleFromToken();
            setUserRole(role);
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
                const [pending, approved] = await Promise.all([
                    getPendingBuddies(),
                    getBuddies()
                ]);
                setPendingBuddies(pending);
                setApprovedBuddies(approved);
            } else if (activeTab === 'articles') {
                const data = await getAllArticles();
                setArticles(data);
            } else if (activeTab === 'feedbacks') {
                const data = await getFeedbacks();
                setFeedbacks(data);
            } else if (activeTab === 'admins' && userRole === 'superadmin') {
                const [adminData, logData] = await Promise.all([
                    listAdmins(),
                    getAuditLogs(50)
                ]);
                setAdmins(adminData);
                setAuditLogs(logData);
            } else if (activeTab === 'settings' && userRole === 'superadmin') {
                const data = await getSettings();
                setSettings(data);
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
            const approvedItem = pendingBuddies.find(b => b.id === id);
            setPendingBuddies(pendingBuddies.filter(b => b.id !== id));
            if (approvedItem) {
                setApprovedBuddies([approvedItem, ...approvedBuddies]);
            }
        } catch (error) {
            console.error('Failed to approve buddy:', error);
        }
    };

    const handleDeleteBuddy = async (id: number) => {
        if (!confirm('Xác nhận xóa yêu cầu này?')) return;
        try {
            await deleteBuddy(id);
            setPendingBuddies(pendingBuddies.filter(b => b.id !== id));
            setApprovedBuddies(approvedBuddies.filter(b => b.id !== id));
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

    const handleToggleSetting = async (key: string, currentValue: string) => {
        const newValue = currentValue === 'true' ? 'false' : 'true';
        try {
            await updateSetting(key, newValue);
            setSettings(settings.map(s => s.key === key ? { ...s, value: newValue } : s));
        } catch (error) {
            console.error('Failed to update setting:', error);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!confirm('Xác nhận xóa tài khoản admin này?')) return;
        try {
            await deleteAdmin(id);
            setAdmins(admins.filter(a => a.id !== id));
            loadData(); // Reload to get updated audit logs
        } catch (error) {
            alert((error as Error).message);
        }
    };

    const tabs = [
        { id: 'buddies' as TabType, label: 'Bio-Buddies', icon: Users, count: pendingBuddies.length },
        { id: 'articles' as TabType, label: 'Bài viết', icon: FileText, count: articles.length },
        { id: 'feedbacks' as TabType, label: 'Phản hồi', icon: MessageSquare, count: feedbacks.filter(f => !f.is_read).length },
        // Superadmin only tabs
        ...(userRole === 'superadmin' ? [
            { id: 'admins' as TabType, label: 'Tài khoản', icon: UserCog, count: admins.length },
            { id: 'settings' as TabType, label: 'Cài đặt', icon: Settings, count: 0 },
        ] : []),
    ];

    return (
        <div className={`min-h-screen bg-[#EDEDED] ${styles.fonts.body}`}>
            {/* Header */}
            <header className={`bg-[#000033] sticky top-0 z-50 shadow-lg py-4 ${styles.fonts.body}`}>
                <div className="container mx-auto px-8 md:px-12 lg:px-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                            <Dna className="text-[#0099FF] w-6 h-6 md:w-8 h-8 animate-[spin_10s_linear_infinite]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className={`text-base md:text-xl font-bold text-white tracking-tight ${styles.fonts.heading}`}>Admin Dashboard</h1>
                                {userRole === 'superadmin' && (
                                    <span className="px-2 py-0.5 text-[10px] bg-amber-500 text-white rounded-full font-bold uppercase">
                                        Superadmin
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-medium">BIOSCIZONE Management</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Đăng xuất</span>
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-8 md:px-12 lg:px-20 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl w-fit shadow-sm border border-gray-100 flex-wrap">
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
                            {(tab.id !== 'buddies' && tab.id !== 'settings' && tab.count > 0) && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-[#0099FF]/10 text-[#0099FF]'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                            {tab.id === 'buddies' && pendingBuddies.length > 0 && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {pendingBuddies.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingSpinner fullScreen={false} message="Đang tải dữ liệu hệ thống..." />
                ) : (
                    <>
                        {/* Bio-Buddies Tab */}
                        {activeTab === 'buddies' && (
                            <div className="space-y-6">
                                {/* Sub-tabs for Buddies */}
                                <div className="flex gap-4 border-b border-gray-200 pb-px">
                                    <button
                                        onClick={() => setBuddySubTab('pending')}
                                        className={`pb-3 px-2 text-sm font-bold transition-all relative ${buddySubTab === 'pending'
                                            ? 'text-[#0066CC]'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        Chờ duyệt ({pendingBuddies.length})
                                        {buddySubTab === 'pending' && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0066CC]" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setBuddySubTab('approved')}
                                        className={`pb-3 px-2 text-sm font-bold transition-all relative ${buddySubTab === 'approved'
                                            ? 'text-[#0066CC]'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        Đã duyệt ({approvedBuddies.length})
                                        {buddySubTab === 'approved' && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0066CC]" />
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {buddySubTab === 'pending' ? (
                                        pendingBuddies.length === 0 ? (
                                            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
                                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p className="text-[#000033] font-medium">Không có yêu cầu đang chờ duyệt</p>
                                            </div>
                                        ) : (
                                            pendingBuddies.map(buddy => (
                                                <div key={buddy.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#0099FF]/30 hover:shadow-lg transition-all">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className={`text-lg font-bold text-[#000033] ${styles.fonts.heading}`}>{buddy.full_name}</h3>
                                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full uppercase">Chờ duyệt</span>
                                                            </div>
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
                                        )
                                    ) : (
                                        approvedBuddies.length === 0 ? (
                                            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
                                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                <p className="text-[#000033] font-medium">Chưa có Bio-Buddy nào được duyệt</p>
                                            </div>
                                        ) : (
                                            approvedBuddies.map(buddy => (
                                                <div key={buddy.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#0099FF]/30 hover:shadow-lg transition-all">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className={`text-lg font-bold text-[#000033] ${styles.fonts.heading}`}>{buddy.full_name}</h3>
                                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full uppercase">Đã duyệt</span>
                                                            </div>
                                                            <p className="text-gray-500 text-sm">{buddy.email} • {buddy.course}</p>
                                                            <div className="mt-3">
                                                                <p className="text-[#0066CC] font-semibold">{buddy.research_topic}</p>
                                                                <p className="text-gray-600 mt-2">{buddy.description}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 ml-4">
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
                                        )
                                    )}
                                </div>
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

                        {/* Admins Tab (Superadmin only) */}
                        {activeTab === 'admins' && userRole === 'superadmin' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-bold text-[#000033] ${styles.fonts.heading}`}>Quản lý Tài khoản Admin</h2>
                                    <button
                                        onClick={() => { setEditingAdmin(null); setShowAdminModal(true); }}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5"
                                    >
                                        <Plus size={18} />
                                        Thêm Admin
                                    </button>
                                </div>

                                {/* Admin List */}
                                <div className="space-y-4">
                                    {admins.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
                                            <UserCog className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-[#000033] font-medium">Chưa có tài khoản admin nào</p>
                                        </div>
                                    ) : (
                                        admins.map(admin => (
                                            <div key={admin.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-between hover:border-[#0099FF]/30 hover:shadow-lg transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${admin.role === 'superadmin' ? 'bg-amber-100' : 'bg-[#0099FF]/10'}`}>
                                                        {admin.role === 'superadmin' ? <Shield className="text-amber-600" size={24} /> : <UserCog className="text-[#0066CC]" size={24} />}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-lg font-bold text-[#000033] ${styles.fonts.heading}`}>{admin.username}</h3>
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${admin.role === 'superadmin' ? 'bg-amber-100 text-amber-700' : 'bg-[#0099FF]/10 text-[#0066CC]'}`}>
                                                            {admin.role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingAdmin(admin); setShowAdminModal(true); }}
                                                        className="p-2.5 bg-[#EDEDED] text-gray-600 hover:bg-[#0099FF]/10 hover:text-[#0066CC] rounded-xl transition-all"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Audit Logs */}
                                {auditLogs.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className={`text-lg font-bold text-[#000033] mb-4 flex items-center gap-2 ${styles.fonts.heading}`}>
                                            <Clock size={20} className="text-[#0099FF]" />
                                            Lịch sử hoạt động
                                        </h3>
                                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                                            <div className="max-h-80 overflow-y-auto">
                                                {auditLogs.map(log => (
                                                    <div key={log.id} className="px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-all">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="font-semibold text-[#000033]">{log.admin_username}</span>
                                                                <span className="text-gray-500 mx-2">đã</span>
                                                                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${log.action === 'create' ? 'bg-green-100 text-green-700' :
                                                                    log.action === 'update' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                    {log.action === 'create' ? 'tạo' : log.action === 'update' ? 'cập nhật' : 'xóa'}
                                                                </span>
                                                                <span className="text-gray-500 ml-2">{log.entity_type}</span>
                                                            </div>
                                                            <span className="text-xs text-gray-400">{log.created_at?.split('T')[0]}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab (Superadmin only) */}
                        {activeTab === 'settings' && userRole === 'superadmin' && (
                            <div className="space-y-6">
                                <h2 className={`text-xl font-bold text-[#000033] ${styles.fonts.heading}`}>Cài đặt Hệ thống</h2>

                                <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
                                    {settings.map(setting => (
                                        <div key={setting.key} className="p-6 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-[#000033]">
                                                    {setting.key === 'registration_enabled' ? 'Cho phép đăng ký tài khoản' :
                                                        setting.key === 'maintenance_mode' ? 'Chế độ bảo trì' : setting.key}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {setting.key === 'registration_enabled'
                                                        ? 'Khi bật, người dùng có thể đăng ký tài khoản admin mới tại trang đăng nhập'
                                                        : setting.key === 'maintenance_mode'
                                                            ? 'Khi bật, trang web sẽ hiển thị thông báo bảo trì'
                                                            : ''}
                                                </p>
                                                {setting.updated_by && (
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        Cập nhật bởi {setting.updated_by} lúc {setting.updated_at?.split('T')[0]}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleToggleSetting(setting.key, setting.value)}
                                                className={`relative w-14 h-8 rounded-full transition-all ${setting.value === 'true' ? 'bg-[#0066CC]' : 'bg-gray-300'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${setting.value === 'true' ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    ))}
                                    {settings.length === 0 && (
                                        <div className="p-6 text-center text-gray-500">
                                            Chưa có cài đặt nào
                                        </div>
                                    )}
                                </div>
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

            {/* Admin Modal */}
            {showAdminModal && (
                <AdminModal
                    admin={editingAdmin}
                    onClose={() => { setShowAdminModal(false); setEditingAdmin(null); }}
                    onSuccess={() => {
                        loadData();
                        setShowAdminModal(false);
                        setEditingAdmin(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboardView;
