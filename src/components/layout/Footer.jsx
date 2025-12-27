import React from 'react';
import {
    Dna,
    Facebook,
    Mail,
    Youtube
} from 'lucide-react';
import { styles } from '../../data.jsx';

const Footer = ({ setCurrentView }) => (
    <footer className="bg-[#000033] text-gray-400 py-16 font-['Inter']">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <Dna className="text-[#0099FF] w-6 h-6" />
                    <h4 className={`text-white text-xl font-bold ${styles.fonts.heading}`}>BIOSCIZONE</h4>
                </div>
                <p className="text-sm mb-4 leading-relaxed italic">
                    "Kết nối đam mê khoa học, kiến tạo tương lai nghiên cứu cho sinh viên."
                </p>
            </div>

            <div>
                <h5 className={`text-white font-bold mb-6 uppercase text-xs tracking-widest ${styles.fonts.heading}`}>Khám phá</h5>
                <ul className="space-y-3 text-sm">
                    <li><button onClick={() => setCurrentView('bio-match')} className="hover:text-[#0099FF] transition">Bio-Match</button></li>
                    <li><button onClick={() => setCurrentView('science-corner')} className="hover:text-[#0099FF] transition">Science Corner</button></li>
                    <li><button onClick={() => setCurrentView('bio-magazine')} className="hover:text-[#0099FF] transition">Bio-Magazine</button></li>
                </ul>
            </div>

            <div>
                <h5 className={`text-white font-bold mb-6 uppercase text-xs tracking-widest ${styles.fonts.heading}`}>Hỗ trợ</h5>
                <ul className="space-y-3 text-sm">
                    <li><button onClick={() => setCurrentView('resources')} className="hover:text-[#0099FF] transition">Hướng dẫn APA</button></li>
                    <li><button onClick={() => setCurrentView('resources')} className="hover:text-[#0099FF] transition">Quy trình NCKH</button></li>
                    <li><button className="hover:text-[#0099FF] transition">Góp ý hệ thống</button></li>
                </ul>
            </div>

            <div>
                <h5 className={`text-white font-bold mb-6 uppercase text-xs tracking-widest ${styles.fonts.heading}`}>Kết nối</h5>
                <div className="flex space-x-4 mb-6">
                    <div className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><Facebook size={18} /></div>
                    <div className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><Mail size={18} /></div>
                    <div className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><Youtube size={18} /></div>
                </div>
                <p className="text-xs text-gray-500">
                    © 2026 Đoàn khoa Sinh học - Công nghệ Sinh học.<br />Trường ĐH Khoa học Tự nhiên, ĐHQG-HCM.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
