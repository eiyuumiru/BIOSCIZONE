import { createContext, useContext, useState, useEffect, type FC, type ReactNode } from 'react';
import {
    getToken, getStoredUser, clearAuth, fetchMe,
    type UserInfo,
} from '../services/authApi';

interface AuthContextValue {
    user: UserInfo | null;
    loading: boolean;
    login: (token: string, user: UserInfo) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInfo | null>(getStoredUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        // Verify token is still valid on app load
        fetchMe(token)
            .then(u => {
                setUser(u);
                localStorage.setItem('uniguide_user', JSON.stringify(u));
            })
            .catch(() => {
                clearAuth();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (token: string, u: UserInfo) => {
        localStorage.setItem('uniguide_token', token);
        localStorage.setItem('uniguide_user', JSON.stringify(u));
        setUser(u);
    };

    const logout = () => {
        clearAuth();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
