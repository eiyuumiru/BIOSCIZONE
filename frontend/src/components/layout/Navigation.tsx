import type { FC } from 'react';
import {
    Dna,
    X,
    Menu,
    Lightbulb
} from 'lucide-react';
import { styles } from '../../data';
import type { NavigationProps, NavItem } from '../../types';

const Navigation: FC<NavigationProps> = ({ currentView, setCurrentView, isMenuOpen, setIsMenuOpen, scrolled, onIdeaClick }) => {
    const desktopNavItems: NavItem[] = [
        { id: 'home', label: 'Trang chủ' },
        { id: 'bio-match', label: 'Bio-Match' },
        { id: 'bio-magazine', label: 'Bio-Magazine' },
        { id: 'science-corner', label: 'Góc Khoa Học' },
        { id: 'achievements', label: 'Thành tích' },
        { id: 'resources', label: 'Tài nguyên' },
        { id: 'contact', label: 'Liên hệ' },
    ];

    const mobileNavItems: NavItem[] = [
        { id: 'home', label: 'Trang chủ' },
        { id: 'bio-match', label: 'Bio-Match' },
        { id: 'bio-magazine', label: 'Bio-Magazine' },
        { id: 'science-corner', label: 'Góc Khoa Học' },
        { id: 'achievements', label: 'Thành tích' },
        { id: 'resources', label: 'Tài nguyên' },
        { id: 'contact', label: 'Liên hệ' }
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${styles.fonts.body}
      ${scrolled
                    ? 'bg-[#000033]/95 backdrop-blur-md shadow-lg py-3'
                    : 'bg-[#000033] py-4'}
    `}
        >
            <div className="container mx-auto px-8 md:px-12 lg:px-20">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div
                        className="flex items-center space-x-2 md:space-x-3 cursor-pointer group"
                        onClick={() => { setCurrentView('home'); setIsMenuOpen(false); }}
                    >
                        <div className="relative w-7 h-7 md:w-9 md:h-9 flex items-center justify-center">
                            <Dna className="text-[#0099FF] w-5 h-5 md:w-7 md:h-7 animate-[spin_10s_linear_infinite]" />
                        </div>
                        <span className={`font-bold text-base md:text-xl tracking-tight text-white ${styles.fonts.heading}`}>BIOSCIZONE</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {desktopNavItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className={`text-xs xl:text-sm font-bold uppercase tracking-wide transition-all duration-200 relative pb-1
                ${currentView === item.id ? 'text-white border-b-2 border-[#0099FF]' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-[#0099FF]/50 border-b-2 border-transparent'}
              `}
                            >
                                {item.label}
                            </button>
                        ))}

                        <button
                            onClick={onIdeaClick}
                            className="bg-[#0066CC] hover:bg-[#0055AA] text-white px-4 py-2 rounded-full text-[10px] xl:text-xs font-bold shadow-md transition transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap -mt-1"
                        >
                            <Lightbulb size={12} /> Ý tưởng
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden bg-[#000033] border-t border-gray-800 absolute w-full left-0 shadow-xl max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-4">
                        {mobileNavItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setCurrentView(item.id); setIsMenuOpen(false); }}
                                className="block w-full text-left py-2 text-white font-medium hover:text-[#0099FF] capitalize border-b border-gray-800 last:border-0"
                            >
                                {item.label}
                            </button>
                        ))}
                        <button
                            onClick={() => { onIdeaClick(); setIsMenuOpen(false); }}
                            className="w-full bg-[#0066CC] text-white py-3 rounded-full font-bold mt-2 shadow-lg text-center"
                        >
                            Gửi ý tưởng nghiên cứu
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;
