import { useState, type FC } from 'react';
import {
    MapPin,
    Send,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { styles } from '../../data';
import { submitFeedback } from '../../services/api';

const ContactView: FC = () => {
    const [formData, setFormData] = useState({
        sender_name: '',
        email: '',
        student_id: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await submitFeedback(formData);
            setIsSuccess(true);
            setFormData({
                sender_name: '',
                email: '',
                student_id: '',
                subject: '',
                message: ''
            });
            // Reset success message after 5 seconds
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi gửi. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
            <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className={`text-3xl md:text-4xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>Liên hệ với chúng tôi</h2>
                    <p className="text-gray-500 mt-4 max-w-lg mx-auto">Mọi thắc mắc và đóng góp ý kiến, vui lòng gửi tin nhắn hoặc liên hệ trực tiếp qua thông tin bên dưới.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className={`text-xl font-bold text-[#000033] mb-6 ${styles.fonts.heading}`}>Thông tin chi tiết</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#E6F4FF] rounded-lg flex items-center justify-center text-[#0066CC] shrink-0">
                                        <IoMail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                        <p className="text-sm font-medium text-gray-700">dkshcnsh.hcmus@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-[#E6F4FF] rounded-lg flex items-center justify-center text-[#0066CC] shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">Địa chỉ</p>
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium text-gray-700">
                                                <span className="font-bold block">Cơ sở 1:</span>
                                                227 Nguyễn Văn Cừ, Phường Chợ Quán, Thành phố Hồ Chí Minh
                                            </p>
                                            <p className="text-sm font-medium text-gray-700">
                                                <span className="font-bold block">Cơ sở 2:</span>
                                                Khu đô thị Đại học Quốc gia Thành phố Hồ Chí Minh, Phường Đông Hoà, Thành phố Hồ Chí Minh
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Mạng xã hội</h4>
                                <div className="flex gap-4">
                                    <a href="https://www.facebook.com/DoanKhoa.LienChiHoi.KhoaSinhHoc.DHKHTN" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-50 rounded-full hover:bg-[#0099FF] hover:text-white transition cursor-pointer text-[#000033]"><FaFacebookF size={20} /></a>
                                    <a href="https://www.youtube.com/@oankhoasinhhoc-congnghes-vi1xt" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-50 rounded-full hover:bg-[#0099FF] hover:text-white transition cursor-pointer text-[#000033]"><FaYoutube size={20} /></a>
                                    <a href="https://www.tiktok.com/@biotalk.hcmus" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-gray-50 rounded-full hover:bg-[#0099FF] hover:text-white transition cursor-pointer text-[#000033]"><FaTiktok size={20} /></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                            {/* Success Overlay */}
                            {isSuccess && (
                                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-fade-in text-center p-6">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className={`text-2xl font-bold text-[#000033] mb-2 ${styles.fonts.heading}`}>Gửi thành công!</h3>
                                    <p className="text-gray-500 max-w-sm">Cảm ơn bạn đã đóng góp ý kiến. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-8 text-[#0066CC] font-bold hover:underline"
                                    >
                                        Gửi tin nhắn khác
                                    </button>
                                </div>
                            )}

                            <h3 className={`text-xl font-bold text-[#000033] mb-8 ${styles.fonts.heading}`}>Gửi tin nhắn</h3>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ và tên <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.sender_name}
                                            onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                                            placeholder="Nhập tên của bạn"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="Nhập địa chỉ email"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mã số sinh viên (MSSV)</label>
                                    <input
                                        type="text"
                                        value={formData.student_id}
                                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                        placeholder="Nhập mã số sinh viên của bạn"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Chủ đề <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Bạn muốn liên hệ về việc gì?"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nội dung <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows={5}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Nhập nội dung tin nhắn..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-10 py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactView;
