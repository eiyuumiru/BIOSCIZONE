import { useState, useRef, useEffect, type FC, type FormEvent } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { sendChatMessage, type ChatMessageAPI } from '../../services/chatbotApi';

// Render **bold** markdown in bot replies
const renderMarkdown = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });

interface Msg extends ChatMessageAPI {
    id: number;
    error?: boolean;
}

const WELCOME: Msg = {
    id: 0,
    role: 'assistant',
    content: 'Xin chào! 👋 Mình là trợ lý ảo của UNIGUIDE. Bạn có thể hỏi mình về Uni-Buddy, UNI-MAGAZINE, Science Corner, cách đăng ký tài khoản... hoặc bất cứ nội dung nào trên trang web.',
};

const SUGGESTIONS = [
    'Uni-Buddy là gì?',
    'Làm sao để đăng ký tài khoản?',
    'Trang web có những mục nào?',
];

const ChatbotWidget: FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([WELCOME]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const idRef = useRef(1);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    const send = async (text?: string) => {
        const content = (text ?? input).trim();
        if (!content || loading) return;
        setInput('');

        const userMsg: Msg = { id: idRef.current++, role: 'user', content };
        const history = messages
            .filter(m => !m.error && m.id !== 0)
            .map(m => ({ role: m.role, content: m.content }));
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const reply = await sendChatMessage(content, history);
            setMessages(prev => [...prev, { id: idRef.current++, role: 'assistant', content: reply }]);
        } catch (err) {
            setMessages(prev => [...prev, {
                id: idRef.current++,
                role: 'assistant',
                content: err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.',
                error: true,
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        void send();
    };

    return (
        <>
            {/* Floating button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    aria-label="Mở chatbot"
                    className="fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full bg-[#0099FF] text-white shadow-xl hover:bg-[#0088E0] hover:scale-105 transition-all flex items-center justify-center"
                >
                    <MessageCircle size={26} />
                </button>
            )}

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-6 right-6 z-[150] w-[92vw] max-w-sm h-[520px] max-h-[75vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-[#0099FF] text-white px-4 py-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <Bot size={22} />
                            <div>
                                <p className="font-bold text-sm leading-tight">Trợ lý UNIGUIDE</p>
                                <p className="text-[11px] opacity-80">Powered by Gemini</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} aria-label="Đóng chatbot" className="hover:opacity-75 transition-opacity">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#F5F8FA]">
                        {messages.map(m => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${m.role === 'user'
                                        ? 'bg-[#0099FF] text-white rounded-br-sm'
                                        : m.error
                                            ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-sm'
                                            : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm'
                                    }`}>
                                    {m.role === 'user' ? m.content : renderMarkdown(m.content)}
                                </div>
                            </div>
                        ))}

                        {/* Suggestions (only before first user message) */}
                        {messages.length === 1 && !loading && (
                            <div className="flex flex-col gap-1.5 items-start pl-1">
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => void send(s)}
                                        className="text-xs text-[#0099FF] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2 text-gray-400 text-sm">
                                    <Loader2 size={14} className="animate-spin" />
                                    Đang soạn câu trả lời...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex gap-2 bg-white shrink-0">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn..."
                            className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#0099FF] focus:ring-1 focus:ring-[#0099FF]"
                            maxLength={2000}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label="Gửi tin nhắn"
                            className="bg-[#0099FF] text-white px-3 py-2 rounded-lg disabled:opacity-40 hover:bg-[#0088E0] transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;
