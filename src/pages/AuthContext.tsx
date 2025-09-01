import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
    id: string;
    name: string;
    avatar: string;
    branch: string;
    year: number;
    skills?: string[];
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User, token?: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = (userData: User, token?: string) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (token) localStorage.setItem("token", token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};



// export default AuthContext;