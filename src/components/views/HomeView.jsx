import React from 'react';
import {
    ArrowRight,
    Lightbulb,
    Microscope,
    Beaker,
    Share2,
    Dna,
    Video,
    FileBadge,
    Users
} from 'lucide-react';
import { styles } from '../../data.jsx';

const HomeView = ({ setCurrentView, onIdeaClick }) => (
    <>
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#EDEDED]">
            {/* Simulated Particles Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-[#0099FF] opacity-20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 4}px`,
                            height: `${Math.random() * 10 + 4}px`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
                <style>{`
           @keyframes float {
             0% { transform: translateY(0) translateX(0); opacity: 0.1; }
             50% { transform: translateY(-50px) translateX(20px); opacity: 0.3; }
             100% { transform: translateY(-100px) translateX(0); opacity: 0.1; }
           }
         `}</style>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 h-full">
                {/* Left Column: Text */}
                <div className="text-left animate-fade-in-up pl-4 md:pl-0">
                    <h2 className={`text-[#0066CC] font-bold text-sm tracking-widest uppercase mb-4 ${styles.fonts.heading}`}>
                        Nền tảng kết nối NCKH
                    </h2>
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#000033] mb-6 leading-tight ${styles.fonts.heading}`}>
                        Khám phá Tri thức <br />
                        <span className="text-[#0099FF]">Kết nối Đam mê</span>
                    </h1>
                    <p className={`text-gray-600 text-lg mb-8 max-w-lg leading-relaxed ${styles.fonts.body}`}>
                        Mạng lưới kết nối sinh viên, giảng viên và các nguồn lực nghiên cứu khoa học hàng đầu tại Khoa SH-CNSH.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setCurrentView('bio-match')}
                            className="bg-[#0066CC] hover:bg-[#0055AA] text-white px-8 py-4 rounded-lg font-bold shadow-xl shadow-blue-500/20 transition transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                        >
                            Tìm đồng đội ngay <ArrowRight size={20} />
                        </button>

                        <button
                            onClick={onIdeaClick}
                            className="bg-white border-2 border-[#0066CC] text-[#0066CC] hover:bg-[#E6F4FF] px-8 py-4 rounded-lg font-bold shadow-md transition transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                        >
                            <Lightbulb size={20} /> Gửi ý tưởng
                        </button>
                    </div>
                </div>

                {/* Right Column: DNA Orbital Animation */}
                <div className="relative h-[400px] flex items-center justify-center">
                    {/* DNA Axis / Central Hub */}
                    <div className="w-64 h-64 rounded-full border-2 border-dashed border-[#0099FF]/30 flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
                        <div className="absolute w-full h-full rounded-full border border-gray-200 opacity-50 scale-125"></div>
                    </div>

                    {/* Central Logo */}
                    <div className="absolute bg-white p-6 rounded-full shadow-xl z-20">
                        <Dna className="text-[#000033] w-12 h-12" />
                    </div>

                    {/* Orbiting Icons */}
                    <div className="absolute animate-[spin_10s_linear_infinite] w-64 h-64 z-10">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-md text-[#0066CC]">
                            <Microscope size={24} />
                        </div>
                        <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-[#0099FF]">
                            <Beaker size={24} />
                        </div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full shadow-md text-[#000033]">
                            <Users size={24} />
                        </div>
                        <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-[#0066CC]">
                            <Share2 size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Quick Access Grid */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Science Corner", icon: <Video />, desc: "Video ngắn và bài chia sẻ kinh nghiệm NCKH." },
                        { title: "Bio-Magazine", icon: <FileBadge />, desc: "Cập nhật các bài báo khoa học đã công bố." },
                        { title: "Bio-Match", icon: <Users />, desc: "Tìm kiếm bạn đồng hành và giảng viên hướng dẫn." }
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                if (card.title === "Science Corner") setCurrentView('science-corner');
                                else if (card.title === "Bio-Magazine") setCurrentView('bio-magazine');
                                else setCurrentView('bio-match');
                            }}
                            className="bg-[#EDEDED]/30 p-8 rounded-2xl hover:bg-white border border-transparent hover:border-[#0099FF]/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#0066CC] mb-6 shadow-sm group-hover:bg-[#0066CC] group-hover:text-white transition">
                                {card.icon}
                            </div>
                            <h3 className={`text-xl font-bold text-[#000033] mb-3 ${styles.fonts.heading}`}>{card.title}</h3>
                            <p className={`text-gray-600 text-sm leading-relaxed ${styles.fonts.body}`}>{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </>
);

export default HomeView;
