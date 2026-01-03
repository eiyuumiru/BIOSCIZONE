import type { ReactNode } from 'react';

// ============ Styling Types ============

export interface Styles {
    colors: {
        bg: string;
        primary: string;
        action: string;
        highlight: string;
        card: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
}

// ============ Component Props ============

export interface NavigationProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    scrolled: boolean;
    onIdeaClick: () => void;
}

export interface FooterProps {
    setCurrentView: (view: string) => void;
}

export interface IdeaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

export interface MagazineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
}

export interface HomeViewProps {
    setCurrentView: (view: string) => void;
    onIdeaClick: () => void;
}

// Navigation item type
export interface NavItem {
    id: string;
    label: string;
}

// Quick access card type
export interface QuickAccessCard {
    title: string;
    icon: ReactNode;
    desc: string;
}
