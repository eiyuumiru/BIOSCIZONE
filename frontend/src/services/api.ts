import { API_BASE_URL } from './config';

// ============ Types matching Backend responses ============

export interface BioBuddyAPI {
    id: number;
    full_name: string;
    student_id: string | null;
    course: string;
    email: string;
    phone: string | null;
    research_topic: string;
    research_field: string | null;
    research_subject: string | null;
    description: string;
    status: string;
    created_at: string;
}

export interface ArticleAPI {
    id: number;
    category: string;
    title: string;
    content: string | null;
    author: string | null;
    external_link: string | null;
    file_url: string | null;
    publication_date: string | null;
    created_at: string;
}

export interface LabAPI {
    id: number;
    name: string;
    lead_name: string | null;
    email: string | null;
    phone: string | null;
    research_areas: string | null;
}

export interface SearchResultAPI {
    buddies: BioBuddyAPI[];
    articles: ArticleAPI[];
}

// ============ API Functions ============

/**
 * Fetch approved buddies, optionally filtered by course
 */
export async function getBuddies(course?: string): Promise<BioBuddyAPI[]> {
    const params = new URLSearchParams();
    if (course && course !== 'All') {
        params.append('course', course);
    }
    const url = `${API_BASE_URL}/api/buddies${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch buddies');
    return response.json();
}

/**
 * Submit a new buddy request
 */
export async function submitBuddy(data: {
    full_name: string;
    student_id?: string;
    course: string;
    email: string;
    phone?: string;
    research_topic: string;
    research_field?: string;
    research_subject?: string;
    description: string;
}): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/buddies/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit buddy');
    return response.json();
}

/**
 * Fetch articles by category
 */
export async function getArticles(category?: string): Promise<ArticleAPI[]> {
    const params = new URLSearchParams();
    if (category) {
        params.append('category', category);
    }
    const url = `${API_BASE_URL}/api/articles${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
}

/**
 * Fetch all labs/departments
 */
export async function getLabs(): Promise<LabAPI[]> {
    const response = await fetch(`${API_BASE_URL}/api/labs`);
    if (!response.ok) throw new Error('Failed to fetch labs');
    return response.json();
}

/**
 * Global search across buddies and articles
 */
export async function globalSearch(query: string): Promise<SearchResultAPI> {
    const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return response.json();
}

/**
 * Submit feedback/contact form
 */
export async function submitFeedback(data: {
    sender_name: string;
    email: string;
    student_id?: string;
    subject: string;
    message: string;
}): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit feedback');
    return response.json();
}
