import { API_BASE_URL } from './config';

// ============ Chatbot API ============

export interface ChatMessageAPI {
    role: 'user' | 'assistant';
    content: string;
}

export async function sendChatMessage(message: string, history: ChatMessageAPI[] = []): Promise<string> {
    try {
        const res = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data?.detail || 'Chatbot hiện không khả dụng, vui lòng thử lại sau.');
        }
        return data.reply as string;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra xem backend có đang chạy không.');
        }
        throw error;
    }
}
