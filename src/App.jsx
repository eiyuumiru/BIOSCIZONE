import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Atom } from 'lucide-react';

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

import { styles } from './data.jsx';

// Loading component for Suspense fallback
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#EDEDED]">
        <div className="text-center">
            <Atom className="w-12 h-12 text-[#0099FF] animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Đang tải...</p>
        </div>
    </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);
    return null;
};

// Main App content with routing
const AppContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isIdeaModalOpen, setIsIdeaModalOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    // Get current view from pathname
    const getCurrentView = () => {
        const path = location.pathname;
        if (path === '/') return 'home';
        return path.slice(1); // Remove leading '/'
    };

    // Navigate to a view
    const setCurrentView = (view) => {
        if (view === 'home') {
            navigate('/');
        } else {
            navigate(`/${view}`);
        }
        setIsMenuOpen(false);
    };

    // Handle Scroll for Header Effect
    useEffect(() => {
        const handleScroll = () => {
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
            />
        </div>
    );
};

// App wrapper with Router
const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
