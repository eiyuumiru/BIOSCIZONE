import { API_BASE_URL } from './config';

export type UserRole = 'student' | 'lecturer';

export interface UserInfo {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    student_id: string | null;
    course: string | null;
    academic_title: string | null;
    academic_degree: string | null;
    workplace: string | null;
}

const TOKEN_KEY = 'uniguide_token';
const USER_KEY = 'uniguide_user';

// ============ Token / user persistence ============

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserInfo | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as UserInfo;
    } catch {
        return null;
    }
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// ============ API calls ============

export async function registerUser(payload: {
    email: string;
    password: string;
    full_name: string;
    role: UserRole;
    student_id?: string | null;
    course?: string | null;
    academic_title?: string | null;
    academic_degree?: string | null;
    workplace?: string | null;
}): Promise<UserInfo> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Đăng ký thất bại');
        return data;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: UserInfo }> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Đăng nhập thất bại');
        return { token: data.access_token, user: data.user };
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}

export async function fetchMe(token: string): Promise<UserInfo> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Session expired');
        return res.json();
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}
