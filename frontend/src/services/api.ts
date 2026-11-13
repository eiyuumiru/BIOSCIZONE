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
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Không thể tải danh sách ý tưởng');
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

/**
 * Submit a new buddy request
 */
export async function submitBuddy(data: {
    full_name: string;
    student_id?: string;
    course?: string;
    academic_title?: string;
    academic_degree?: string;
    workplace?: string;
    email: string;
    phone?: string;
    research_topic: string;
    research_field?: string;
    research_subject?: string;
    description: string;
}): Promise<{ message: string }> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/buddies/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let message = 'Không thể gửi ý tưởng';
        try {
                const body = await response.json();
              if (typeof body.detail === 'string') message = body.detail;
            } catch {
                // Keep the default message when the body is not JSON.
          }
            throw new Error(message);
        }
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
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
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Không thể tải danh sách bài viết');
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

/**
 * Fetch a single article by ID
 */
export async function getArticle(id: number): Promise<ArticleAPI> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/articles/${id}`);
        if (!response.ok) {
            if (response.status === 404) throw new Error('Không tìm thấy bài viết');
            throw new Error('Không thể tải bài viết');
        }
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

/**
 * Fetch all labs/departments
 */
export async function getLabs(): Promise<LabAPI[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/labs`);
        if (!response.ok) throw new Error('Không thể tải danh sách phòng lab');
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

/**
 * Global search across buddies and articles
 */
export async function globalSearch(query: string): Promise<SearchResultAPI> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Tìm kiếm thất bại');
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
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
    try {
        const response = await fetch(`${API_BASE_URL}/api/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Không thể gửi phản hồi');
        return response.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

/**
 * Check if admin registration is enabled
 */
export async function getRegistrationStatus(): Promise<{ enabled: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/registration-status`);
    if (!response.ok) return { enabled: false };
    return response.json();
}
