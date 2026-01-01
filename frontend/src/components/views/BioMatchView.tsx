import { useState, useEffect, type FC } from 'react';
import {
    Filter,
    Users,
    Send,
    Microscope,
    ChevronDown,
    Mail,
    Phone,
    ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { styles } from '../../data';
import { getBuddies, getLabs, type BioBuddyAPI, type LabAPI } from '../../services/api';

type TabType = 'buddy' | 'info';

const BioMatchView: FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('buddy');
    const [openLabId, setOpenLabId] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string>('All');
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    // API data states
    const [buddies, setBuddies] = useState<BioBuddyAPI[]>([]);
    const [labs, setLabs] = useState<LabAPI[]>([]);
    const [loadingBuddies, setLoadingBuddies] = useState(true);
    const [loadingLabs, setLoadingLabs] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Fetch labs on mount
    useEffect(() => {
        setLoadingLabs(true);
        getLabs()
            .then(data => setLabs(data))
            .catch(err => setError(err.message))
            .finally(() => setLoadingLabs(false));
    }, []);

    const toggleField = (field: string): void => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter(f => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    // Filter buddies by selected research fields (client-side)
    const filteredBuddies = selectedFields.length > 0
        ? buddies.filter(b => b.research_field && selectedFields.includes(b.research_field))
        : buddies;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
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
                                <h3 className={`font-bold text-[#000033] mb-6 flex items-center gap-2 ${styles.fonts.heading}`}>
                                    <Filter size={20} /> Bộ lọc tìm kiếm
                                </h3>
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
                                    <p>Chưa có dữ liệu Bio-Buddy nào.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredBuddies.map(buddy => (
                                        <div
                                            key={buddy.id}
                                            className="bg-white rounded-xl p-6 shadow-sm border border-transparent hover:border-[#0099FF] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full relative overflow-hidden"
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
                                                <button className="w-full py-2.5 border border-[#0066CC] text-[#0066CC] rounded-lg font-bold text-sm hover:bg-[#0066CC] hover:text-white transition flex items-center justify-center gap-2">
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
                    <div className="max-w-3xl mx-auto space-y-4">
                        {loadingLabs ? (
                            <LoadingSpinner fullScreen={false} message="Đang tải danh sách Lab..." />
                        ) : labs.length === 0 ? (
                            <div className="text-center py-20 text-gray-500">
                                <p>Chưa có dữ liệu Lab/Bộ môn nào.</p>
                            </div>
                        ) : (
                            labs.map(lab => (
                                <div key={lab.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                                    <button
                                        onClick={() => setOpenLabId(openLabId === lab.id ? null : lab.id)}
                                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition text-left"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                          ${openLabId === lab.id ? 'bg-[#000033] text-white' : 'bg-[#EDEDED] text-[#000033]'}`}>
                                                <Microscope size={24} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-[#000033] text-lg ${styles.fonts.heading}`}>{lab.name}</h4>
                                                <p className="text-xs text-gray-500 font-semibold mt-1">Trưởng bộ môn: {lab.lead_name || 'Chưa cập nhật'}</p>
                                            </div>
                                        </div>
                                        <ChevronDown className={`text-gray-400 transition-transform duration-300 ${openLabId === lab.id ? 'rotate-180 text-[#0099FF]' : ''}`} />
                                    </button>
                                    {openLabId === lab.id && (
                                        <div className="px-6 pb-8 pt-2 bg-white border-t border-gray-100">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pl-[68px]">
                                                <div>
                                                    <h5 className="text-xs font-bold text-[#0099FF] uppercase mb-3 tracking-widest">Hướng nghiên cứu</h5>
                                                    <p className={`text-sm text-gray-600 leading-relaxed ${styles.fonts.body}`}>{lab.research_areas || 'Chưa cập nhật'}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-xs font-bold text-[#0099FF] uppercase mb-3 tracking-widest">Thông tin liên hệ</h5>
                                                    <ul className="text-sm text-gray-600 space-y-3">
                                                        <li className="flex items-center gap-3"><Mail size={16} className="text-gray-400" /> {lab.email || 'Chưa cập nhật'}</li>
                                                        <li className="flex items-center gap-3"><Phone size={16} className="text-gray-400" /> {lab.phone || '028 3835 4321'}</li>
                                                    </ul>
                                                    <button className="mt-4 text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1">
                                                        Xem hồ sơ giảng viên <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BioMatchView;
