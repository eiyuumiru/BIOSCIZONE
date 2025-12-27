import type { FC } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    Facebook,
    Youtube,
    Linkedin
} from 'lucide-react';
import { styles } from '../../data';

const ContactView: FC = () => (
    <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
        <div className="container mx-auto px-4 max-w-6xl">
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
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                    <p className="text-sm font-medium text-gray-700">bioscizone@hcmus.edu.vn</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#E6F4FF] rounded-lg flex items-center justify-center text-[#0066CC] shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Điện thoại</p>
                                    <p className="text-sm font-medium text-gray-700">028 3835 4321</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#E6F4FF] rounded-lg flex items-center justify-center text-[#0066CC] shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Địa chỉ</p>
                                    <p className="text-sm font-medium text-gray-700">227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Mạng xã hội</h4>
                            <div className="flex gap-4">
                                <div className="p-2.5 bg-gray-50 rounded-full hover:bg-[#0099FF] hover:text-white transition cursor-pointer text-[#000033]"><Facebook size={20} /></div>
                                <div className="p-2.5 bg-gray-50 rounded-full hover:bg-[#0099FF] hover:text-white transition cursor-pointer text-[#000033]"><Youtube size={20} /></div>
                                <div className="p-2.5 bg-gray-50 rounded-full hover:bg-[#0099FF] hover:text-white transition cursor-pointer text-[#000033]"><Linkedin size={20} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className={`text-xl font-bold text-[#000033] mb-8 ${styles.fonts.heading}`}>Gửi tin nhắn</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Họ và tên</label>
                                    <input type="text" placeholder="Nhập tên của bạn" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                                    <input type="email" placeholder="Nhập địa chỉ email" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Chủ đề</label>
                                <input type="text" placeholder="Bạn muốn liên hệ về việc gì?" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nội dung</label>
                                <textarea rows={5} placeholder="Nhập nội dung tin nhắn..." className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full md:w-auto px-10 py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                Gửi ngay <Send size={18} className="transform -rotate-45 mb-1" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ContactView;
