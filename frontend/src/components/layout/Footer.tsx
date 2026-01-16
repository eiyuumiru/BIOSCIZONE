import type { FC } from 'react';
import {
    Dna
} from 'lucide-react';
import { FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { styles } from '../../data';
import type { FooterProps } from '../../types';

const Footer: FC<FooterProps> = ({ setCurrentView }) => (
    <footer className="bg-[#000033] text-gray-400 py-10 md:py-16 font-['Inter']">
        <div className="container mx-auto px-8 md:px-12 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <Dna className="text-[#0099FF] w-6 h-6" />
                    <h4 className={`text-white text-xl font-bold ${styles.fonts.heading}`}>BIOSCIZONE</h4>
                </div>
                <p className="text-sm mb-6 leading-relaxed italic">
                    "Kết nối đam mê khoa học, kiến tạo tương lai nghiên cứu cho sinh viên."
                </p>
                <div className="mt-auto">
                    <img src="/logo-khoa-sinh-new.png" alt="Khoa Sinh học - CNSH" className="h-16 md:h-20 w-auto object-contain" />
                </div>
            </div>

            <div className="flex flex-col">
                <h5 className={`text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-widest ${styles.fonts.heading}`}>Khám phá</h5>
                <ul className="space-y-3 text-sm mb-6 md:mb-10">
                    <li><button onClick={() => setCurrentView('bio-match')} className="hover:text-[#0099FF] transition">Bio-Match</button></li>
                    <li><button onClick={() => setCurrentView('bio-magazine')} className="hover:text-[#0099FF] transition">Bio-Magazine</button></li>
                    <li><button onClick={() => setCurrentView('science-corner')} className="hover:text-[#0099FF] transition">Science Corner</button></li>
                </ul>
                <div className="mt-auto">
                    <img src="/logo-doan-tncs.png" alt="Đoàn TNCS Hồ Chí Minh" className="h-16 md:h-20 w-auto object-contain" />
                </div>
            </div>

            <div>
                <h5 className={`text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-widest ${styles.fonts.heading}`}>Hỗ trợ</h5>
                <ul className="space-y-3 text-sm">
                    <li><a href="/article/5" className="hover:text-[#0099FF] transition">Công cụ hỗ trợ nghiên cứu khoa học</a></li>
                    <li><button onClick={() => setCurrentView('resources')} className="hover:text-[#0099FF] transition">Hướng dẫn trích nguồn tài liệu</button></li>
                </ul>
            </div>

            <div>
                <h5 className={`text-white font-bold mb-4 md:mb-6 uppercase text-xs tracking-widest ${styles.fonts.heading}`}>Kết nối</h5>
                <div className="flex space-x-4 mb-6">
                    <a href="https://www.facebook.com/DoanKhoa.LienChiHoi.KhoaSinhHoc.DHKHTN" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><FaFacebookF size={18} /></a>
                    <a href="mailto:dkshcnsh.hcmus@gmail.com" className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><IoMail size={18} /></a>
                    <a href="https://www.youtube.com/@oankhoasinhhoc-congnghes-vi1xt" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><FaYoutube size={18} /></a>
                    <a href="https://www.tiktok.com/@biotalk.hcmus" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-[#0099FF] text-white cursor-pointer transition"><FaTiktok size={18} /></a>
                </div>
                <p className="text-sm text-white leading-relaxed">
                    <span className="whitespace-nowrap block font-bold">© Đoàn khoa Sinh học - Công nghệ Sinh học</span>
                    <span className="whitespace-nowrap block">Trường Đại học Khoa học tự nhiên, ĐHQG-HCM</span>
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
