import { useState, useEffect, type FC } from 'react';
import {
    X,
    Lightbulb,
    Send,
    Loader2
} from 'lucide-react';
import { styles } from '../../data';
import { submitBuddy } from '../../services/api';
import type { IdeaModalProps } from '../../types';

const IdeaModal: FC<IdeaModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        student_id: '',
        course: 'K20',
        email: '',
        phone: '',
        research_topic: '',
        research_field: 'Di truyền',
        research_subject: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen && !isVisible) {
            setIsVisible(true);
            // Small delay to allow DOM to render before animating
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        }
    }, [isOpen, isVisible]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            setError(null);
            onClose();
        }, 300);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await submitBuddy({
                full_name: formData.full_name,
                student_id: formData.student_id || undefined,
                course: formData.course,
                email: formData.email,
                phone: formData.phone || undefined,
                research_topic: formData.research_topic,
                research_field: formData.research_field || undefined,
                research_subject: formData.research_subject || undefined,
                description: formData.description
            });

            // Reset form
            setFormData({
                full_name: '',
                student_id: '',
                course: 'K20',
                email: '',
                phone: '',
                research_topic: '',
                research_field: 'Di truyền',
                research_subject: '',
                description: ''
            });

            onSubmitSuccess();
            setIsAnimating(false);
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi gửi. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            <div className={`bg-white w-full max-w-6xl rounded-2xl shadow-2xl relative z-10 overflow-hidden transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="bg-[#000033] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0099FF] rounded-lg flex items-center justify-center">
                            <Lightbulb size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${styles.fonts.heading}`}>Gửi Ý Tưởng Nghiên Cứu</h3>
                            <p className="text-xs text-[#0099FF] font-medium uppercase tracking-wider">Chia sẻ đam mê với BIOSCIZONE</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Personal Information Section */}
                        <div className="space-y-4 flex flex-col">
                            <h4 className="text-sm font-bold text-[#000033] uppercase border-b border-gray-100 pb-2">Thông tin cá nhân</h4>
                            <div className="space-y-4 flex-grow">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ và tên <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập tên của bạn"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">MSSV</label>
                                        <input
                                            type="text"
                                            name="student_id"
                                            value={formData.student_id}
                                            onChange={handleInputChange}
                                            placeholder="Nhập mã số sinh viên"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Khóa <span className="text-red-500">*</span></label>
                                        <select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                        >
                                            <option>K20</option>
                                            <option>K21</option>
                                            <option>K22</option>
                                            <option>K23</option>
                                            <option>K24</option>
                                            <option>K25</option>
                                            <option>Khác</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập địa chỉ email"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Idea Details Section */}
                        <div className="space-y-4 flex flex-col">
                            <h4 className="text-sm font-bold text-[#000033] uppercase border-b border-gray-100 pb-2">Thông tin ý tưởng</h4>
                            <div className="space-y-4 flex flex-col flex-grow">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tên ý tưởng / Đề tài dự kiến <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="research_topic"
                                        value={formData.research_topic}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="VD: Nghiên cứu ứng dụng vi tảo trong..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Lĩnh vực</label>
                                        <select
                                            name="research_field"
                                            value={formData.research_field}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                        >
                                            <option>Di truyền</option>
                                            <option>Sinh học phân tử</option>
                                            <option>Sinh hóa</option>
                                            <option>Vi sinh</option>
                                            <option>Sinh lý thực vật</option>
                                            <option>Sinh lý động vật</option>
                                            <option>Sinh thái - Tiến hóa</option>
                                            <option>Khác</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Đối tượng nghiên cứu</label>
                                        <input
                                            type="text"
                                            name="research_subject"
                                            value={formData.research_subject}
                                            onChange={handleInputChange}
                                            placeholder="VD: Vi khuẩn, Nấm..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 flex-grow flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mô tả ngắn gọn ý tưởng <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ý tưởng của bạn giải quyết vấn đề gì? Phương pháp dự kiến?"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition resize-none flex-grow min-h-[120px]"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full md:flex-1 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition order-2 md:order-1 disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:flex-1 py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 order-1 md:order-2 disabled:opacity-50 disabled:transform-none"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send size={16} className="transform -rotate-45 mt-1.5" /> Gửi ngay
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IdeaModal;
