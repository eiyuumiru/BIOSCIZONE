// Static styling data - kept for UI consistency
// Dynamic data (bioBuddies, articles, etc.) now fetched from backend API

import type { Styles } from './types';

export const styles: Styles = {
    colors: {
        bg: "bg-[#EDEDED]",        // 60%
        primary: "bg-[#000033]",   // 30%
        action: "bg-[#0066CC]",    // Accent
        highlight: "bg-[#0099FF]", // Highlight
        card: "bg-white",
    },
    fonts: {
        heading: "font-['Montserrat']",
        body: "font-['Inter']",
    }
};

// Note: The following data arrays have been moved to backend API:
// - newsItems → GET /api/articles?category=news
// - bioBuddies → GET /api/buddies
// - labInfo → GET /api/labs
// - resourcesList → GET /api/articles?category=resource
// - scienceCornerItems → GET /api/articles?category=science_corner
// - bioMagazineItems → GET /api/articles?category=magazine
// - achievementsItems → GET /api/articles?category=achievement
