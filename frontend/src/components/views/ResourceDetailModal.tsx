import { useState, useEffect, type FC } from 'react';
import { X, Calendar, User, ExternalLink, FileText } from 'lucide-react';
import { type ArticleAPI } from '../../services/api';
import { styles } from '../../data';

interface ResourceDetailModalProps {
    resource: ArticleAPI;
    onClose: () => void;
}

const ResourceDetailModal: FC<ResourceDetailModalProps> = ({ resource, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Small delay to ensure the modal is in the DOM before animating
        const timer = setTimeout(() => {
            setIsAnimating(true);
        }, 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            {/* Modal Content */}
            <div className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden transition-all duration-300 transform ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {/* Header */}
                <div className="bg-[#000033] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0099FF] rounded-lg flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${styles.fonts.heading} line-clamp-1`}>
                                Chi Tiết Tài Nguyên
                            </h3>
                            <p className="text-xs text-[#0099FF] font-medium uppercase tracking-wider">TÀI LIỆU</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Title */}
                    <h2 className={`text-2xl font-extrabold text-[#000033] leading-tight ${styles.fonts.heading}`}>
                        {resource.title}
                    </h2>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 py-4 border-y border-gray-100">
                        {resource.author && (
                            <div className="flex items-center gap-2 text-gray-500">
                                <User size={16} className="text-[#0066CC]" />
                                <span className="text-sm font-medium">{resource.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={16} className="text-[#0066CC]" />
                            <span className="text-sm font-medium">
                                {resource.publication_date || resource.created_at.slice(0, 10)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nội dung / Mô tả</h4>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {resource.content || "Không có mô tả chi tiết cho tài nguyên này."}
                        </div>
                    </div>

                    {/* Action Links */}
                    {(resource.external_link || resource.file_url) && (
                        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                            {resource.external_link && (
                                <a
                                    href={resource.external_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 bg-[#0066CC] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#004499] transition shadow-lg shadow-blue-200"
                                >
                                    Truy cập liên kết <ExternalLink size={18} />
                                </a>
                            )}
                            {resource.file_url && (
                                <a
                                    href={resource.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 px-6 py-3 bg-gray-100 text-[#000033] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                                >
                                    Xem tài liệu <FileText size={18} />
                                </a>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ResourceDetailModal;
