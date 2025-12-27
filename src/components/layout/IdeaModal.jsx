import React from 'react';
import {
    X,
    Lightbulb,
    Send
} from 'lucide-react';
import { styles } from '../../data.jsx';

const IdeaModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-[#000033]/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
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
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tên ý tưởng / Đề tài dự kiến</label>
                            <input type="text" placeholder="VD: Nghiên cứu ứng dụng vi tảo trong..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Lĩnh vực</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition">
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
                                <input type="text" placeholder="VD: Vi khuẩn, Nấm..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mô tả ngắn gọn ý tưởng</label>
                            <textarea rows="4" placeholder="Ý tưởng của bạn giải quyết vấn đề gì? Phương pháp dự kiến?" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition resize-none"></textarea>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Gửi ý tưởng <Send size={18} className="transform -rotate-45 mb-1" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default IdeaModal;
