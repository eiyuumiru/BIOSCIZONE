import { useState, type FC, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, BookOpen, Mail, Lock, User, Hash, Loader2 } from 'lucide-react';
import { styles } from '../../data';
import { registerUser, loginUser, type UserRole } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

type Mode = 'login' | 'register';

const AuthView: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const initialMode: Mode = location.pathname === '/register' ? 'register' : 'login';
    const [mode, setMode] = useState<Mode>(initialMode);
    const [role, setRole] = useState<UserRole>('student');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [course, setCourse] = useState('');
    const [academicTitle, setAcademicTitle] = useState('');
    const [academicDegree, setAcademicDegree] = useState('');
    const [workplace, setWorkplace] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            if (mode === 'register') {
                await registerUser({
                    email,
                    password,
                    full_name: fullName,
                    role,
                    student_id: role === 'student' ? studentId : null,
                    course: role === 'student' ? course : null,
                    academic_title: role === 'lecturer' ? academicTitle : null,
                    academic_degree: role === 'lecturer' ? academicDegree : null,
                    workplace: role === 'lecturer' ? workplace : null,
                });
                // Auto-login after successful registration
                const { token, user } = await loginUser(email, password);
                login(token, user);
                navigate('/');
            } else {
                const { token, user } = await loginUser(email, password);
                login(token, user);
                navigate('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const switchMode = (m: Mode) => {
        setMode(m);
        setError(null);
        navigate(m === 'register' ? '/register' : '/login', { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center p-4 pt-24 pb-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h1 className={`text-2xl font-bold text-gray-800 ${styles.fonts.heading}`}>
                        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {mode === 'login'
                            ? 'Đăng nhập với vai trò sinh viên hoặc giảng viên'
                            : 'Tạo tài khoản để tham gia cộng đồng NCKH'}
                    </p>
                </div>

                {/* Mode tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'login' ? 'bg-white shadow text-[#0099FF]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Đăng nhập
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode('register')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'register' ? 'bg-white shadow text-[#0099FF]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Đăng ký
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <>
                            {/* Role selection */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${role === 'student' ? 'border-[#0099FF] bg-blue-50 text-[#0099FF]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    <GraduationCap size={18} />
                                    <span className="text-sm font-medium">Sinh viên</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('lecturer')}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${role === 'lecturer' ? 'border-[#0099FF] bg-blue-50 text-[#0099FF]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    <BookOpen size={18} />
                                    <span className="text-sm font-medium">Giảng viên</span>
                                </button>
                            </div>

                            {/* Full name */}
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Họ và tên"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                />
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                        />
                    </div>

                    {mode === 'register' && role === 'student' && (
                        <>
                            {/* Student ID */}
                            <div className="relative">
                                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    placeholder="Mã số sinh viên (MSSV)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                />
                            </div>

                            {/* Course (year level) */}
                            <select
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm bg-white"
                            >
                                <option value="">Chọn năm học (không bắt buộc)</option>
                                <option value="Năm 1">Năm 1</option>
                                <option value="Năm 2">Năm 2</option>
                                <option value="Năm 3">Năm 3</option>
                                <option value="Năm 4">Năm 4</option>
                                <option value="&gt; Năm 4">&gt; Năm 4</option>
                            </select>
                        </>
                    )}

                    {mode === 'register' && role === 'lecturer' && (
                        <>
                            {/* Academic Title (Học hàm) */}
                            <div className="relative">
                                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={academicTitle}
                                    onChange={(e) => setAcademicTitle(e.target.value)}
                                    placeholder="Học hàm (ví dụ: Giáo sư, Phó giáo sư...)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                />
                            </div>

                            {/* Academic Degree (Học vị) */}
                            <div className="relative">
                                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={academicDegree}
                                    onChange={(e) => setAcademicDegree(e.target.value)}
                                    placeholder="Học vị (ví dụ: Tiến sĩ, Thạc sĩ...)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                />
                            </div>

                            {/* Workplace (Cơ quan công tác) */}
                            <div className="relative">
                                <Hash size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={workplace}
                                    onChange={(e) => setWorkplace(e.target.value)}
                                    placeholder="Cơ quan công tác (ví dụ: Đại học...)"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0099FF] focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#0099FF] hover:bg-[#0077cc] disabled:opacity-60 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 size={18} className="animate-spin" />}
                        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthView;
