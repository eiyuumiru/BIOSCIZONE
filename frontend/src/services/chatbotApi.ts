import { API_BASE_URL } from './config';

// ============ Chatbot API ============

export interface ChatMessageAPI {
    role: 'user' | 'assistant';
    content: string;
}

export async function sendChatMessage(message: string, history: ChatMessageAPI[] = []): Promise<string> {
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
}
