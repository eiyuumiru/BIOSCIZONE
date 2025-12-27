import type { FC } from 'react';
import {
    PlayCircle,
    Share2,
    ArrowRight
} from 'lucide-react';
import { styles, scienceCornerItems } from '../../data';

const ScienceCornerView: FC = () => (
    <div className="min-h-screen pt-28 pb-20 bg-[#EDEDED]">
        <div className="container mx-auto px-8 md:px-12 lg:px-20 max-w-6xl">
            <div className="text-center mb-12">
                <h2 className={`text-3xl font-extrabold text-[#000033] mb-4 ${styles.fonts.heading}`}>SCIENCE CORNER</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Nơi chia sẻ kinh nghiệm Nghiên cứu khoa học từ sinh viên và các video khoa học thú vị.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {scienceCornerItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100">
                        <div className={`h-48 relative flex items-center justify-center ${item.type === 'video' ? 'bg-gray-900' : 'bg-[#E6F4FF]'}`}>
                            {item.type === 'video' ? (
                                <PlayCircle size={64} className="text-white opacity-80 group-hover:scale-110 transition" />
                            ) : (
                                <Share2 size={64} className="text-[#0066CC] opacity-50 group-hover:scale-110 transition" />
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'video' ? 'bg-red-500 text-white' : 'bg-[#0066CC] text-white'
                                    }`}>
                                    {item.type === 'video' ? 'Video' : 'Chia sẻ'}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className={`text-xl font-bold text-[#000033] mb-2 group-hover:text-[#0066CC] transition ${styles.fonts.heading}`}>
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-bold mb-3">Tác giả: {item.author}</p>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{item.desc}</p>

                            <button className="text-[#0099FF] font-bold text-sm flex items-center gap-2 mt-auto hover:underline">
                                {item.type === 'video' ? 'Xem video' : 'Đọc bài viết'} <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ScienceCornerView;
