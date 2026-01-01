import { useState, useEffect, memo, type FC, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Dna, Send } from 'lucide-react';
import { login, isLoggedIn } from '../../services/adminApi';
import { styles } from '../../data';

// Separate memoized component for particles - won't re-render on parent state changes
const ParticlesBackground = memo(() => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <div
                key={i}
                className="absolute rounded-full bg-[#0099FF] opacity-20"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 10 + 4}px`,
                    height: `${Math.random() * 10 + 4}px`,
                    animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                    animationDelay: `${Math.random() * 5}s`
                }}
            />
        ))}
        <style>{`
            @keyframes float {
                0% { transform: translateY(0) translateX(0); opacity: 0.1; }
                50% { transform: translateY(-50px) translateX(20px); opacity: 0.3; }
                100% { transform: translateY(-100px) translateX(0); opacity: 0.1; }
            }
        `}</style>
    </div>
));

const AdminLoginView: FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(username, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-[#EDEDED] ${styles.fonts.body} flex items-center justify-center p-4 relative overflow-hidden`}>
            <ParticlesBackground />

            <div className="relative w-full max-w-md z-10">
                {/* Login Card - matching ContactView & IdeaModal pattern */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header - matching IdeaModal pattern */}
                    <div className="bg-[#000033] p-6 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0099FF] rounded-lg flex items-center justify-center">
                                <Dna size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${styles.fonts.heading}`}>Admin Panel</h3>
                                <p className="text-xs text-[#0099FF] font-medium uppercase tracking-wider">BIOSCIZONE Management</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Username - matching ContactView input pattern */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    placeholder="admin"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password - matching ContactView input pattern */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0099FF]/20 focus:bg-white transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button - matching ContactView & IdeaModal pattern */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#0066CC] hover:bg-[#0055AA] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition transform hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={16} className="transform -rotate-45 mt-1.5" />
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to main site */}
                <div className="text-center mt-6">
                    <a
                        href="/"
                        className="text-gray-500 hover:text-[#0066CC] text-sm transition font-medium"
                    >
                        ← Quay về trang chủ
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginView;
