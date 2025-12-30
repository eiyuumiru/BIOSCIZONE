import { useState, useEffect, type FC } from 'react';
import {
    X,
    FileBadge,
    Send,
    Upload,
    Link as LinkIcon
} from 'lucide-react';
import { styles } from '../../data';
import type { MagazineModalProps } from '../../types';

const MagazineModal: FC<MagazineModalProps> = ({ isOpen, onClose, onSubmitSuccess }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen && !isVisible) {
            setIsVisible(true);
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
            onClose();
        }, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitSuccess();
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className={`absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            <div className={`bg-white w-full max-w-7xl rounded-2xl shadow-2xl relative z-10 overflow-hidden transition-all duration-300 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="bg-[#000033] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0066CC] rounded-lg flex items-center justify-center">
                            <FileBadge size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${styles.fonts.heading}`}>Gửi Bài Đăng Tạp Chí</h3>
                            <p className="text-xs text-[#0099FF] font-medium uppercase tracking-wider">Chia sẻ công trình nghiên cứu của bạn</p>
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Basic Information Section */}
                        <div className="space-y-4 flex flex-col">
                            <h4 className="text-sm font-bold text-[#000033] uppercase border-b border-gray-100 pb-2">Thông tin cơ bản</h4>
                            <div className="space-y-4 flex-grow">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tiêu đề bài đăng (Title)</label>
                                    <input required type="text" placeholder="Nhập tiêu đề bài báo/tạp chí" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Ngày công bố</label>
                                        <div className="mt-auto">
                                            <input required type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2">Tác giả chính (Corresponding Author)</label>
                                        <input required type="text" placeholder="Họ và tên tác giả chính" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Đồng tác giả (Co-authors)</label>
                                    <input type="text" placeholder="Danh sách các đồng tác giả (cách nhau bởi dấu phẩy)" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Từ khóa (Keywords)</label>
                                    <input type="text" placeholder="VD: Molecular Biology, Genetics..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">DOI / Link gốc</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <LinkIcon size={16} />
                                        </div>
                                        <input type="url" placeholder="https://doi.org/..." className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content & Files Section */}
                        <div className="space-y-4 flex flex-col">
                            <h4 className="text-sm font-bold text-[#000033] uppercase border-b border-gray-100 pb-2">Nội dung & Tệp tin</h4>
                            <div className="space-y-4 flex flex-col flex-grow">
                                <div className="space-y-2 flex-grow flex flex-col">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tóm tắt (Abstract)</label>
                                    <textarea required placeholder="Tóm tắt nội dung nghiên cứu..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition resize-none flex-grow min-h-[150px]"></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">File toàn văn (Full-text PDF)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full px-4 py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:bg-gray-100 group-hover:border-[#0099FF]/30 transition">
                                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#0066CC]">
                                                <Upload size={24} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-gray-700">Nhấp để tải lên hoặc kéo thả tệp</p>
                                                <p className="text-xs text-gray-500">Chỉ chấp nhận định dạng PDF (Tối đa 20MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full md:flex-1 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition order-2 md:order-1"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="w-full md:flex-1 py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 order-1 md:order-2"
                        >
                            <Send size={16} className="transform -rotate-45 mt-1.5" /> Gửi bài đăng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MagazineModal;
