import { API_BASE_URL } from './config';
import { BioBuddyAPI, ArticleAPI } from './api';

// ============ Types ============

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface FeedbackAPI {
    id: number;
    sender_name: string;
    email: string;
    student_id: string | null;
    subject: string;
    message: string;
    is_read: number;
    created_at: string;
}

export interface ArticleCreateData {
    category: string;
    title: string;
    content?: string;
    author?: string;
    external_link?: string;
    file_url?: string;
    publication_date?: string;
}

// ============ Token Management ============

const TOKEN_KEY = 'admin_token';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

// ============ Auth Header ============

function authHeaders(): HeadersInit {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

// ============ API Functions ============

/**
 * Login with username and password
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Login failed' }));
        throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    setToken(data.access_token);
    return data;
}

/**
 * Logout - remove token
 */
export function logout(): void {
    removeToken();
}

/**
 * Get pending bio-buddy submissions
 */
export async function getPendingBuddies(): Promise<BioBuddyAPI[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/pending`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        if (response.status === 401) {
            removeToken();
            throw new Error('Session expired');
        }
        throw new Error('Failed to fetch pending buddies');
    }

    return response.json();
}

/**
 * Approve a bio-buddy submission
 */
export async function approveBuddy(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/approve-buddy/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
    });

    if (!response.ok) throw new Error('Failed to approve buddy');
    return response.json();
}

/**
 * Delete a bio-buddy submission
 */
export async function deleteBuddy(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/buddies/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete buddy');
    return response.json();
}

/**
 * Get all articles (for admin management)
 */
export async function getAllArticles(): Promise<ArticleAPI[]> {
    const response = await fetch(`${API_BASE_URL}/api/articles`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
}

/**
 * Create a new article
 */
export async function createArticle(data: ArticleCreateData): Promise<ArticleAPI> {
    const response = await fetch(`${API_BASE_URL}/api/admin/articles`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
}

/**
 * Update an existing article
 */
export async function updateArticle(id: number, data: Partial<ArticleCreateData>): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
}

/**
 * Delete an article
 */
export async function deleteArticle(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
}

/**
 * Get all feedbacks
 */
export async function getFeedbacks(): Promise<FeedbackAPI[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/feedbacks`, {
        headers: authHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch feedbacks');
    return response.json();
}

/**
 * Mark feedback as read
 */
export async function markFeedbackRead(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/feedbacks/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders(),
    });

    if (!response.ok) throw new Error('Failed to mark feedback as read');
    return response.json();
}

// ============ Superadmin Types ============

export interface CurrentUser {
    username: string;
    role: 'admin' | 'superadmin';
}

export interface AdminUser {
    id: string;
    username: string;
    role: 'admin' | 'superadmin';
}

export interface AdminCreateData {
    username: string;
    password: string;
    role: 'admin' | 'superadmin';
}

export interface AdminUpdateData {
    username?: string;
    password?: string;
    role?: 'admin' | 'superadmin';
}

export interface SystemSetting {
    key: string;
    value: string;
    updated_at?: string;
    updated_by?: string;
}

export interface AuditLog {
    id: number;
    admin_username: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    details?: string;
    created_at: string;
}

// ============ Superadmin API Functions ============

/**
 * Get current user info (username and role)
 */
export async function getCurrentUser(): Promise<CurrentUser> {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        if (response.status === 401) {
            removeToken();
            throw new Error('Session expired');
        }
        throw new Error('Failed to get current user');
    }

    return response.json();
}

/**
 * Get user role from stored token (decode JWT)
 */
export function getUserRoleFromToken(): 'admin' | 'superadmin' | null {
    const token = getToken();
    if (!token) return null;

    try {
        // Decode JWT payload (base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || 'admin';
    } catch {
        return null;
    }
}

// ============ Admin Management (Superadmin only) ============

/**
 * Get all admin accounts
 */
export async function listAdmins(): Promise<AdminUser[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        if (response.status === 403) throw new Error('Superadmin access required');
        throw new Error('Failed to fetch admins');
    }

    return response.json();
}

/**
 * Create a new admin account
 */
export async function createAdmin(data: AdminCreateData): Promise<AdminUser> {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to create admin' }));
        throw new Error(error.detail || 'Failed to create admin');
    }

    return response.json();
}

/**
 * Update an admin account
 */
export async function updateAdmin(id: string, data: AdminUpdateData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to update admin' }));
        throw new Error(error.detail || 'Failed to update admin');
    }

    return response.json();
}

/**
 * Delete an admin account
 */
export async function deleteAdmin(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/admins/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Failed to delete admin' }));
        throw new Error(error.detail || 'Failed to delete admin');
    }

    return response.json();
}

// ============ System Settings (Superadmin only) ============

/**
 * Get all system settings
 */
export async function getSettings(): Promise<SystemSetting[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        if (response.status === 403) throw new Error('Superadmin access required');
        throw new Error('Failed to fetch settings');
    }

    return response.json();
}

/**
 * Update a system setting
 */
export async function updateSetting(key: string, value: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/settings/${key}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ value }),
    });

    if (!response.ok) throw new Error('Failed to update setting');
    return response.json();
}

// ============ Audit Logs (Superadmin only) ============

/**
 * Get audit logs
 */
export async function getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs?limit=${limit}`, {
        headers: authHeaders(),
    });

    if (!response.ok) {
        if (response.status === 403) throw new Error('Superadmin access required');
        throw new Error('Failed to fetch audit logs');
    }

    return response.json();
}

/**
 * Delete a feedback entry
 */
export async function deleteFeedback(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/feedbacks/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete feedback');
    return response.json();
}
