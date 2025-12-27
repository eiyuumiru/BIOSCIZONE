import type { FC } from 'react';
import {
    FileBadge,
    FileText,
    ArrowRight
} from 'lucide-react';
import { styles, bioMagazineItems } from '../../data';

const BioMagazineView: FC = () => (
    <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
        <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-300 pb-4">
                <div>
                    <h2 className={`text-3xl font-extrabold text-[#000033] ${styles.fonts.heading}`}>BIO-MAGAZINE</h2>
                    <p className="text-gray-600 mt-2">Tổng hợp bài báo, tạp chí Nghiên cứu khoa học của Giảng viên & Sinh viên.</p>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-2 bg-[#000033] text-white font-bold rounded hover:bg-[#0066CC] transition flex items-center gap-2">
                    <FileBadge size={16} /> Gửi bài đăng
                </button>
            </div>

            <div className="space-y-4">
                {bioMagazineItems.map((item) => (
                    <div key={item.id} className="bg-white p-6 md:p-8 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-transparent hover:border-[#000033] group">
                        <div className="flex items-start gap-4">
                            <div className="hidden sm:flex flex-col items-center justify-center min-w-[60px] text-center">
                                <FileText size={32} className="text-gray-300 mb-1 group-hover:text-[#000033] transition" />
                                <span className="text-xs font-bold text-gray-400">{item.year}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-lg md:text-xl font-bold text-[#000033] mb-2 group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 italic mb-1">{item.authors}</p>
                                <p className="text-sm text-[#0066CC] font-medium">{item.journal} • {item.vol}</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-[#0066CC] transition">
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default BioMagazineView;
