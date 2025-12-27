import type { ReactNode } from 'react';

// ============ Data Types ============

export interface NewsItem {
    id: number;
    title: string;
    date: string;
    category: string;
}

export interface BioBuddy {
    id: number;
    name: string;
    course: string;
    topic: string;
    skills: string[];
    lookingFor: string;
}

export interface LabInfo {
    id: number;
    name: string;
    lead: string;
    email: string;
    research: string;
}

export interface ResourceItem {
    id: number;
    title: string;
    date: string;
    type: string;
    icon: ReactNode;
}

export interface ScienceCornerItem {
    id: number;
    title: string;
    author: string;
    type: 'video' | 'share';
    icon: ReactNode;
    desc: string;
}

export interface BioMagazineItem {
    id: number;
    title: string;
    authors: string;
    journal: string;
    year: string;
    vol: string;
}

export interface AchievementItem {
    id: number;
    title: string;
    recipient: string;
    project: string;
    level: string;
}

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
