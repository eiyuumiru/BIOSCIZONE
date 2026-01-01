import { Suspense, lazy, useEffect, useState, type FC } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Dna, CheckCircle } from 'lucide-react';

// Layout Components (always loaded)
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import IdeaModal from './components/layout/IdeaModal';

// View Components (lazy loaded)
const HomeView = lazy(() => import('./components/views/HomeView'));
const BioMatchView = lazy(() => import('./components/views/BioMatchView'));
const ScienceCornerView = lazy(() => import('./components/views/ScienceCornerView'));
const BioMagazineView = lazy(() => import('./components/views/BioMagazineView'));
const AchievementsView = lazy(() => import('./components/views/AchievementsView'));
const ResourcesView = lazy(() => import('./components/views/ResourcesView'));
const ContactView = lazy(() => import('./components/views/ContactView'));

import { styles } from './data';

// Loading component for Suspense fallback
const LoadingSpinner: FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEDED]">
        <div className="text-center">
            <Dna className="w-12 h-12 text-[#0099FF] animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Đang tải...</p>
        </div>
    </div>
);

// Scroll to top on route change
const ScrollToTop: FC = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
    return null;
};

// Main App content with routing
const AppContent: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isIdeaModalOpen, setIsIdeaModalOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
    const [isToastAnimating, setIsToastAnimating] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<{ title: string, desc: string }>({ title: '', desc: '' });

    const handleSubmitSuccess = (type: 'idea' | 'magazine') => {
        if (type === 'idea') {
            setSuccessMessage({
                title: 'Đã gửi ý tưởng thành công!',
                desc: 'Cảm ơn bạn đã chia sẻ với BIOSCIZONE'
            });
            setIsIdeaModalOpen(false);
        } else {
            setSuccessMessage({
                title: 'Đã gửi bài báo thành công!',
                desc: 'Công trình của bạn đang được xét duyệt'
            });
        }
        setShowSuccessToast(true);
        setIsToastAnimating(false);
        // Small delay to allow DOM to render before animating in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsToastAnimating(true);
            });
        });
        setTimeout(() => {
            setIsToastAnimating(false); // Start fade out
            setTimeout(() => {
                setShowSuccessToast(false);
            }, 300); // Fade out duration
        }, 5000); // Display for 5 seconds
    };

    // Get current view from pathname
    const getCurrentView = (): string => {
        const path = location.pathname;
        if (path === '/') return 'home';
        return path.slice(1); // Remove leading '/'
    };

    // Navigate to a view
    const setCurrentView = (view: string): void => {
        if (view === 'home') {
            navigate('/');
        } else {
            navigate(`/${view}`);
        }
        setIsMenuOpen(false);
    };

    // Handle Scroll for Header Effect
    useEffect(() => {
        const handleScroll = (): void => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`min-h-screen bg-[#EDEDED] ${styles.fonts.body} text-gray-700 selection:bg-[#0099FF] selection:text-white`}>
            <ScrollToTop />
            <Navigation
                currentView={getCurrentView()}
                setCurrentView={setCurrentView}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                scrolled={scrolled}
                onIdeaClick={() => setIsIdeaModalOpen(true)}
            />

            <main>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/" element={<HomeView setCurrentView={setCurrentView} onIdeaClick={() => setIsIdeaModalOpen(true)} />} />
                        <Route path="/bio-match" element={<BioMatchView />} />
                        <Route path="/science-corner" element={<ScienceCornerView />} />
                        <Route path="/bio-magazine" element={<BioMagazineView />} />
                        <Route path="/achievements" element={<AchievementsView />} />
                        <Route path="/resources" element={<ResourcesView />} />
                        <Route path="/contact" element={<ContactView />} />
                        {/* Fallback to home for unknown routes */}
                        <Route path="*" element={<HomeView setCurrentView={setCurrentView} onIdeaClick={() => setIsIdeaModalOpen(true)} />} />
                    </Routes>
                </Suspense>
            </main>

            <Footer setCurrentView={setCurrentView} />

            <IdeaModal
                isOpen={isIdeaModalOpen}
                onClose={() => setIsIdeaModalOpen(false)}
                onSubmitSuccess={() => handleSubmitSuccess('idea')}
            />

            {/* Success Toast - Bottom Right */}
            {showSuccessToast && (
                <div className={`fixed bottom-6 right-6 z-[200] transition-all duration-300 ${isToastAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                        <CheckCircle size={24} />
                        <div>
                            <p className="font-bold">{successMessage.title}</p>
                            <p className="text-sm opacity-90">{successMessage.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// App wrapper with Router
const App: FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
