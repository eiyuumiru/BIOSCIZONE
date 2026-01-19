import { useState, useEffect, type FC } from 'react';
import {
    Filter,
    Users,
    Send,
    Lightbulb,
    Mail,
    Phone,
    ArrowRight,
    X,
    Copy,
    Check,
    Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../layout/LoadingSpinner';
import { styles } from '../../data';
import { getBuddies, getArticles, type BioBuddyAPI, type ArticleAPI } from '../../services/api';

type TabType = 'buddy' | 'info';

const BioMatchView: FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('buddy');
    const [selectedCourse, setSelectedCourse] = useState<string>('All');
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [selectedBuddyForContact, setSelectedBuddyForContact] = useState<BioBuddyAPI | null>(null);
    const [isContactModalAnimating, setIsContactModalAnimating] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [searchBuddy, setSearchBuddy] = useState('');
    const [selectedBuddyForDescription, setSelectedBuddyForDescription] = useState<BioBuddyAPI | null>(null);
    const [isDescriptionModalAnimating, setIsDescriptionModalAnimating] = useState(false);

    // API data states
    const [buddies, setBuddies] = useState<BioBuddyAPI[]>([]);
    const [articles, setArticles] = useState<ArticleAPI[]>([]);
    const [loadingBuddies, setLoadingBuddies] = useState(true);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInfo, setSearchInfo] = useState('');

    const courseOptions = ['All', 'K20', 'K21', 'K22', 'K23', 'K24', 'K25', 'Khác'];
    const fieldOptions = ['Di truyền', 'Sinh học phân tử', 'Sinh hóa', 'Vi sinh', 'Sinh lý thực vật', 'Sinh lý động vật', 'Sinh thái - Tiến hóa', 'Khác'];

    // Fetch buddies when course filter changes
    useEffect(() => {
        setLoadingBuddies(true);
        setError(null);
        getBuddies(selectedCourse)
            .then(data => setBuddies(data))
            .catch(err => setError(err.message))
            .finally(() => setLoadingBuddies(false));
    }, [selectedCourse]);

    // Fetch bio-info articles
    useEffect(() => {
        setLoadingArticles(true);
        getArticles('bio_info')
            .then(data => setArticles(data))
            .catch(err => setError(err.message))
            .finally(() => setLoadingArticles(false));
    }, []);

    const toggleField = (field: string): void => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter(f => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    // Filter buddies by fields and search query
    const filteredBuddies = buddies.filter(b => {
        const matchesField = selectedFields.length === 0 || (b.research_field && selectedFields.includes(b.research_field));
        if (!matchesField) return false;
        if (!searchBuddy.trim()) return true;
        const query = searchBuddy.toLowerCase();
        return (
            b.full_name?.toLowerCase().includes(query) ||
            b.research_topic?.toLowerCase().includes(query) ||
            b.research_field?.toLowerCase().includes(query) ||
            b.course?.toLowerCase().includes(query)
        );
    });

    const filteredArticles = articles.filter(item => {
        if (!searchInfo.trim()) return true;
        const query = searchInfo.toLowerCase();
        return (
            item.title?.toLowerCase().includes(query) ||
            item.content?.toLowerCase().includes(query) ||
            item.author?.toLowerCase().includes(query)
        );
    });

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Animation logic for contact modal
    useEffect(() => {
        if (selectedBuddyForContact) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsContactModalAnimating(true);
                });
            });
        }
    }, [selectedBuddyForContact]);

    const handleCloseContactModal = () => {
        setIsContactModalAnimating(false);
        setTimeout(() => {
            setSelectedBuddyForContact(null);
        }, 300);
    };

    // Animation logic for description modal
    useEffect(() => {
        if (selectedBuddyForDescription) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsDescriptionModalAnimating(true);
                });
            });
        }
    }, [selectedBuddyForDescription]);

    const handleCloseDescriptionModal = () => {
        setIsDescriptionModalAnimating(false);
        setTimeout(() => {
            setSelectedBuddyForDescription(null);
        }, 300);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            {/* Contact Modal */}
            {selectedBuddyForContact && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isContactModalAnimating ? 'opacity-100' : 'opacity-0'}`}>
                    <div
                        className={`absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity duration-300 ${isContactModalAnimating ? 'opacity-100' : 'opacity-0'}`}
                        onClick={handleCloseContactModal}
                    ></div>
                    <div className={`bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden transform transition-all duration-300 ${isContactModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        {/* Header Section */}
                        <div className="bg-[#000033] p-8 pb-7 relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 backdrop-blur-sm shadow-inner">
                                        <Users size={28} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold text-white ${styles.fonts.heading}`}>
                                            Thông tin liên hệ
                                        </h3>
                                        <p className="text-sm text-blue-200/70 font-medium mt-0.5">Bio-Buddy: {selectedBuddyForContact.full_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseContactModal}
                                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 pt-7">
                            <div className="space-y-4">
                                <div className="group relative">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Mã số sinh viên (MSSV)</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-[#0066CC]/30 transition">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0066CC] shadow-sm">
                                            <Users size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-[#000033] truncate">{selectedBuddyForContact.student_id || 'Chưa cập nhật'}</p>
                                        </div>
                                        {selectedBuddyForContact.student_id && (
                                            <button
                                                onClick={() => copyToClipboard(selectedBuddyForContact.student_id!, 'mssv')}
                                                className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-[#0066CC] transition shadow-sm hover:shadow"
                                            >
                                                {copiedField === 'mssv' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Email</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-[#0066CC]/30 transition">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0066CC] shadow-sm">
                                            <Mail size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-[#000033] truncate">{selectedBuddyForContact.email}</p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(selectedBuddyForContact.email, 'email')}
                                            className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-[#0066CC] transition shadow-sm hover:shadow"
                                        >
                                            {copiedField === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Số điện thoại</label>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group-hover:border-[#0066CC]/30 transition">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0066CC] shadow-sm">
                                            <Phone size={18} />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-semibold text-[#000033] truncate">{selectedBuddyForContact.phone || 'Chưa cập nhật'}</p>
                                        </div>
                                        {selectedBuddyForContact.phone && (
                                            <button
                                                onClick={() => copyToClipboard(selectedBuddyForContact.phone!, 'phone')}
                                                className="p-2.5 hover:bg-white rounded-xl text-gray-400 hover:text-[#0066CC] transition shadow-sm hover:shadow"
                                            >
                                                {copiedField === 'phone' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Description Modal */}
            {selectedBuddyForDescription && (
                <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isDescriptionModalAnimating ? 'opacity-100' : 'opacity-0'}`}>
                    <div
                        className={`absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity duration-300 ${isDescriptionModalAnimating ? 'opacity-100' : 'opacity-0'}`}
                        onClick={handleCloseDescriptionModal}
                    ></div>
                    <div className={`bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden transform transition-all duration-300 ${isDescriptionModalAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        {/* Header Section */}
                        <div className="bg-[#000033] p-8 pb-7 relative overflow-hidden">
                            {/* Decorative element */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/10 backdrop-blur-sm shadow-inner">
                                        <Lightbulb size={28} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold text-white ${styles.fonts.heading}`}>
                                            Chi tiết ý tưởng
                                        </h3>
                                        <p className="text-sm text-white/70 font-medium mt-0.5">{selectedBuddyForDescription.full_name} - {selectedBuddyForDescription.course}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseDescriptionModal}
                                    className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 pt-7">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Đề tài / Ý tưởng</label>
                                    <p className={`text-base font-semibold text-[#000033] italic ${styles.fonts.body}`}>"{selectedBuddyForDescription.research_topic}"</p>
                                </div>

                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Mô tả chi tiết</label>
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 max-h-60 overflow-y-auto">
                                        <p className={`text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ${styles.fonts.body}`}>
                                            {selectedBuddyForDescription.description || 'Chưa có mô tả chi tiết.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {selectedBuddyForDescription.research_field && (
                                        <span className="text-xs font-bold bg-[#E6F4FF] text-[#0066CC] px-3 py-1.5 rounded-full">
                                            {selectedBuddyForDescription.research_field}
                                        </span>
                                    )}
                                    {selectedBuddyForDescription.research_subject && (
                                        <span className="text-xs font-bold bg-[#E6F4FF] text-[#0066CC] px-3 py-1.5 rounded-full">
                                            {selectedBuddyForDescription.research_subject}
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        handleCloseDescriptionModal();
                                        setTimeout(() => setSelectedBuddyForContact(selectedBuddyForDescription), 350);
                                    }}
                                    className="w-full py-3 bg-[#0066CC] text-white rounded-xl font-bold text-sm hover:bg-[#0055AA] transition flex items-center justify-center gap-2 mt-4"
                                >
                                    <Send size={16} className="transform -rotate-45 mt-1" /> Liên hệ ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto px-8 md:px-12 lg:px-20">
                <div className="flex justify-center mb-10">
                    <div className="bg-white p-1.5 rounded-full shadow-sm inline-flex border border-gray-200">
                        <button
                            onClick={() => setActiveTab('buddy')}
                            className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${styles.fonts.body}
                ${activeTab === 'buddy' ? 'bg-[#000033] text-white shadow-md' : 'text-gray-500 hover:text-[#0066CC]'}`}
                        >
                            Bio-Buddy
                        </button>
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${styles.fonts.body}
                ${activeTab === 'info' ? 'bg-[#000033] text-white shadow-md' : 'text-gray-500 hover:text-[#0066CC]'}`}
                        >
                            Bio-Information
                        </button>
                    </div>
                </div>

                {activeTab === 'buddy' ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <aside className="lg:w-72 flex-shrink-0">
                            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-28 border border-gray-100">
                                <h3 className={`font-bold text-[#000033] mb-4 flex items-center gap-2 ${styles.fonts.heading}`}>
                                    <Filter size={20} /> Bộ lọc tìm kiếm
                                </h3>
                                {/* Search Bar for Buddies */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Tìm theo tên, đề tài..."
                                        value={searchBuddy}
                                        onChange={(e) => setSearchBuddy(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:border-[#0066CC] focus:bg-white focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block tracking-wider">Khóa sinh viên</label>
                                        <div className="flex flex-wrap gap-2">
                                            {courseOptions.map(k => (
                                                <label key={k} className="cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="course"
                                                        className="peer sr-only"
                                                        checked={selectedCourse === k}
                                                        onChange={() => setSelectedCourse(k)}
                                                    />
                                                    <span className="px-3 py-1 rounded-md text-sm border border-gray-200 text-gray-600 peer-checked:bg-[#0066CC] peer-checked:text-white peer-checked:border-[#0066CC] transition hover:border-[#0066CC]">
                                                        {k}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase mb-3 block tracking-wider">Hướng nghiên cứu</label>
                                        <div className="space-y-3">
                                            {fieldOptions.map(k => (
                                                <label key={k} className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer hover:text-[#0066CC] group">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${selectedFields.includes(k) ? 'border-[#0066CC] bg-[#E6F4FF]' : 'border-gray-300 group-hover:border-[#0066CC]'}`}>
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only"
                                                            checked={selectedFields.includes(k)}
                                                            onChange={() => toggleField(k)}
                                                        />
                                                        <div className={`w-2 h-2 rounded bg-[#0066CC] transition ${selectedFields.includes(k) ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-30'}`}></div>
                                                    </div>
                                                    {k}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1 relative pb-12">
                            {loadingBuddies ? (
                                <LoadingSpinner fullScreen={false} message="Đang tìm kiếm Bio-Buddy..." />
                            ) : error ? (
                                <div className="text-center py-20 text-red-500">
                                    <p>Đã xảy ra lỗi: {error}</p>
                                </div>
                            ) : filteredBuddies.length === 0 ? (
                                <div className="text-center py-20 text-gray-500">
                                    <p>{searchBuddy || selectedFields.length > 0 ? 'Không tìm thấy kết quả phù hợp.' : 'Chưa có dữ liệu Bio-Buddy nào.'}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredBuddies.map(buddy => (
                                        <div
                                            key={buddy.id}
                                            className="bg-white rounded-xl p-6 shadow-sm border border-transparent hover:border-[#0099FF] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full relative overflow-hidden cursor-pointer"
                                            onClick={() => setSelectedBuddyForDescription(buddy)}
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0066CC] to-[#0099FF] opacity-0 group-hover:opacity-100 transition"></div>
                                            <div className="flex justify-between items-start mb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-[#EDEDED] flex items-center justify-center text-[#000033] group-hover:bg-[#0066CC] group-hover:text-white transition">
                                                        <Users size={24} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-lg font-bold text-[#000033] leading-tight ${styles.fonts.heading}`}>{buddy.full_name}</h4>
                                                        <span className="text-xs font-semibold text-gray-400">{buddy.course}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-6 flex-grow">
                                                <div className="mb-2">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Đề tài / Ý tưởng</span>
                                                    <p className={`text-sm text-gray-700 mt-1 line-clamp-2 italic ${styles.fonts.body}`}>"{buddy.research_topic}"</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4 mt-auto">
                                                <div className="flex flex-wrap gap-2">
                                                    {buddy.research_field && (
                                                        <span className="text-[11px] font-bold bg-[#E6F4FF] text-[#0066CC] px-2.5 py-1 rounded-full">
                                                            {buddy.research_field}
                                                        </span>
                                                    )}
                                                    {buddy.research_subject && (
                                                        <span className="text-[11px] font-bold bg-[#E6F4FF] text-[#0066CC] px-2.5 py-1 rounded-full">
                                                            {buddy.research_subject}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedBuddyForContact(buddy);
                                                    }}
                                                    className="w-full py-2.5 border border-[#0066CC] text-[#0066CC] rounded-lg font-bold text-sm hover:bg-[#0066CC] hover:text-white transition flex items-center justify-center gap-2"
                                                >
                                                    <Send size={16} className="transform -rotate-45 mt-1.5" /> Liên hệ ngay
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {/* Bio-Information Articles Section */}
                        <div className="mb-12">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                                <h3 className={`text-xl font-bold text-[#000033] ${styles.fonts.heading}`}>Bio-Information</h3>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Tìm bài viết..."
                                        value={searchInfo}
                                        onChange={(e) => setSearchInfo(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-[#0066CC] outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loadingArticles ? (
                                    <LoadingSpinner fullScreen={false} message="Đang tải Bio-Information..." />
                                ) : filteredArticles.length === 0 ? (
                                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
                                        Không tìm thấy bài viết nào.
                                    </div>
                                ) : (
                                    filteredArticles.map(article => (
                                        <div
                                            key={article.id}
                                            onClick={() => navigate(`/article/${article.id}`)}
                                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group flex justify-between items-center"
                                        >
                                            <div className="flex-1 pr-4">
                                                <h4 className={`font-bold text-[#000033] mb-1 group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                                    {article.title}
                                                </h4>
                                                <p className="text-xs text-[#0066CC] line-clamp-1 opacity-80">
                                                    {article.content ? article.content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') : 'Chi tiết thông tin...'}
                                                </p>
                                            </div>
                                            <ArrowRight size={18} className="text-gray-300 group-hover:text-[#0066CC] transform group-hover:translate-x-1 transition" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BioMatchView;
