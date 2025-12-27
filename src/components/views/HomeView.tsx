import type { FC } from 'react';
import {
    ArrowRight,
    Microscope,
    Beaker,
    Share2,
    Dna,
    Video,
    FileBadge,
    Users,
    Sparkles
} from 'lucide-react';
import { styles } from '../../data';
import type { HomeViewProps, QuickAccessCard } from '../../types';

const HomeView: FC<HomeViewProps> = ({ setCurrentView, onIdeaClick }) => {
    const quickAccessCards: QuickAccessCard[] = [
        { title: "Science Corner", icon: <Video />, desc: "Video ngắn và bài chia sẻ kinh nghiệm Nghiên cứu khoa học." },
        { title: "Bio-Magazine", icon: <FileBadge />, desc: "Cập nhật các bài báo khoa học đã công bố." },
        { title: "Bio-Match", icon: <Users />, desc: "Tìm kiếm bạn đồng hành và giảng viên hướng dẫn." }
    ];

    return (
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
           @keyframes shimmer {
             0% { transform: translateX(-100%); }
             100% { transform: translateX(100%); }
           }
         `}</style>
                </div>

                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 h-full">
                    {/* Left Column: Text */}
                    <div className="text-center md:text-left animate-fade-in-up px-4 md:pl-0">
                        <h2 className={`text-[#0066CC] font-bold text-xs md:text-sm tracking-widest uppercase mb-4 mt-8 md:mt-0 ${styles.fonts.heading}`}>
                            Nền tảng kết nối Nghiên cứu khoa học
                        </h2>
                        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#000033] mb-6 leading-tight ${styles.fonts.heading}`}>
                            <span className="block mb-2">Khám phá Tri thức</span>
                            <span className="text-[#0099FF]">Kết nối Đam mê</span>
                        </h1>
                        <p className={`text-gray-600 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed ${styles.fonts.body}`}>
                            Mạng lưới kết nối sinh viên, giảng viên và các nguồn lực nghiên cứu khoa học hàng đầu tại Khoa SH-CNSH.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => setCurrentView('bio-match')}
                                className="bg-[#0066CC] hover:bg-[#0055AA] text-white px-8 py-4 rounded-lg font-bold shadow-xl shadow-blue-500/20 transition transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                            >
                                Tìm đồng đội ngay <ArrowRight size={20} />
                            </button>

                            <button
                                onClick={onIdeaClick}
                                className="group relative px-8 py-4 rounded-lg font-bold text-[#0066CC] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white/40 backdrop-blur-md border border-[#0099FF]/40 shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:shadow-[0_0_35px_rgba(0,153,255,0.6)] hover:bg-white/70 hover:border-[#0099FF]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Sparkles size={18} className="text-[#0099FF] animate-pulse" />
                                    Gửi ý tưởng
                                </span>
                                {/* Shining effect overlay */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent z-0"></div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: DNA Orbital Animation - 2.5x larger */}
                    <div className="relative h-[400px] md:h-[700px] flex items-center justify-center overflow-visible">
                        <div className="scale-[0.45] md:scale-100 flex items-center justify-center relative">
                            {/* DNA Axis / Central Hub - scaled 2.5x */}
                            <div className="w-[640px] h-[640px] rounded-full border-2 border-dashed border-[#0099FF]/30 flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
                                <div className="absolute w-full h-full rounded-full border border-gray-200 opacity-50 scale-125"></div>
                            </div>

                            {/* Central Logo - scaled up */}
                            <div className="absolute bg-white p-10 rounded-full border border-[#0099FF]/40 shadow-[0_0_20px_rgba(0,153,255,0.3)] z-20">
                                <Dna className="text-[#0099FF] w-24 h-24" />
                            </div>

                            {/* Orbiting Icons - scaled 2.5x */}
                            <div className="absolute animate-[spin_10s_linear_infinite] w-[640px] h-[640px] z-10">
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-full shadow-lg text-[#0099FF]">
                                    <Microscope size={40} />
                                </div>
                                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white p-5 rounded-full shadow-lg text-[#0099FF]">
                                    <Beaker size={40} />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-5 rounded-full shadow-lg text-[#0099FF]">
                                    <Users size={40} />
                                </div>
                                <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-white p-5 rounded-full shadow-lg text-[#0099FF]">
                                    <Share2 size={40} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VỀ BIOSCIZONE Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 md:px-4 max-w-4xl text-center">
                    <h2 className={`text-3xl md:text-4xl font-extrabold mb-8 ${styles.fonts.heading}`}>
                        <span className="text-[#000033]">VỀ </span>
                        <span className="text-[#0099FF]">BIOSCIZONE</span>
                    </h2>
                    <div className={`text-gray-700 text-base md:text-lg leading-relaxed mb-10 text-justify ${styles.fonts.body}`}>
                        <p className="mb-4">
                            Nằm trong khuôn khổ công trình thanh niên "BIO-RESEARCH" của Đoàn khoa Sinh học - Công nghệ Sinh học nhiệm kỳ 2025 - 2027, BIOSCIZONE ra đời với sứ mệnh tiên phong số hóa toàn diện hành trình nghiên cứu của sinh viên Khoa Sinh học – Công nghệ Sinh học.
                        </p>
                        <p className="mb-4">
                            Chúng tôi kiến tạo một hệ sinh thái học thuật trực tuyến, nơi công nghệ trở thành đòn bẩy cho trí tuệ. Tại BIOSCIZONE, mọi rào cản thông tin được xóa bỏ nhờ kho dữ liệu mở về quy trình và kỹ năng chuyên sâu. Đặc biệt, với tính năng Bio-Match, chúng tôi thiết lập một mạng lưới kết nối đa chiều: từ sự cộng hưởng giữa sinh viên với sinh viên, đến sự bảo trợ chuyên môn từ Giảng viên và Cựu sinh viên.
                        </p>
                        <p>
                            Hơn cả một công cụ, BIOSCIZONE là lời khẳng định về thế hệ sinh viên Khoa học tự nhiên hiện đại: Làm chủ công nghệ - Vững vàng chuyên môn - Sẵn sàng kết nối. Đây chính là bệ phóng để những ý tưởng từ phòng thí nghiệm vươn mình trở thành giải pháp thực tiễn cho cuộc sống.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => setCurrentView('bio-match')}
                            className="bg-[#0066CC] hover:bg-[#0055AA] text-white px-8 py-4 rounded-lg font-bold shadow-xl shadow-blue-500/20 transition transform hover:-translate-y-1 inline-flex items-center justify-center gap-2"
                        >
                            Tìm đồng đội ngay <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={onIdeaClick}
                            className="group relative px-8 py-4 rounded-lg font-bold text-[#0066CC] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white/40 backdrop-blur-md border border-[#0099FF]/40 shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:shadow-[0_0_35px_rgba(0,153,255,0.6)] hover:bg-white/70 hover:border-[#0099FF]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Sparkles size={18} className="text-[#0099FF] animate-pulse" />
                                Gửi ý tưởng
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Access Grid */}
            <section className="py-20 bg-[#EDEDED]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {quickAccessCards.map((card, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (card.title === "Science Corner") setCurrentView('science-corner');
                                    else if (card.title === "Bio-Magazine") setCurrentView('bio-magazine');
                                    else setCurrentView('bio-match');
                                }}
                                className="bg-white p-8 rounded-2xl hover:bg-white border border-transparent hover:border-[#0099FF]/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                                <div className="w-14 h-14 bg-[#EDEDED] rounded-xl flex items-center justify-center text-[#0066CC] mb-6 shadow-sm group-hover:bg-[#0066CC] group-hover:text-white transition">
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
};

export default HomeView;
