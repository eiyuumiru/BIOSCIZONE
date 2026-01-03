import { useState, type FC } from 'react';
import { X, Key } from 'lucide-react';
import { createAdmin, updateAdmin, type AdminUser } from '../../services/adminApi';
import { styles } from '../../data';

interface AdminModalProps {
    admin: AdminUser | null;
    onClose: () => void;
    onSuccess: () => void;
}

const AdminModal: FC<AdminModalProps> = ({ admin, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: admin?.username || '',
        password: '',
        role: admin?.role || 'admin' as 'admin' | 'superadmin',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (admin) {
                // Update existing admin
                const updateData: { username?: string; password?: string; role?: 'admin' | 'superadmin' } = {};
                if (formData.username !== admin.username) updateData.username = formData.username;
                if (formData.password) updateData.password = formData.password;
                if (formData.role !== admin.role) updateData.role = formData.role;

                if (Object.keys(updateData).length > 0) {
                    await updateAdmin(admin.id, updateData);
                }
            } else {
                // Create new admin
                if (!formData.password) {
                    setError('Vui lòng nhập mật khẩu');
                    setIsSubmitting(false);
                    return;
                }
                await createAdmin({
                    username: formData.username,
                    password: formData.password,
                    role: formData.role,
                });
            }
            onSuccess();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-100 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className={`text-xl font-bold text-[#000033] ${styles.fonts.heading}`}>
                        {admin ? 'Chỉnh sửa Admin' : 'Thêm Admin mới'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-[#EDEDED] rounded-lg transition-all">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Tên đăng nhập *</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">
                            Mật khẩu {admin ? '(để trống nếu không đổi)' : '*'}
                        </label>
                        <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-[#000033] mb-2">Vai trò</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'superadmin' })}
                            className="w-full px-4 py-3 bg-[#EDEDED] border border-gray-200 rounded-xl text-[#000033] focus:outline-none focus:border-[#0099FF] focus:ring-2 focus:ring-[#0099FF]/20"
                        >
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-[#EDEDED] text-[#000033] font-medium rounded-xl hover:bg-gray-200 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-[#0066CC] text-white font-bold rounded-xl hover:bg-[#0055AA] transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? 'Đang xử lý...' : admin ? 'Cập nhật' : 'Tạo Admin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminModal;
