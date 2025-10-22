import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import axios from "axios";

// ---------------- User type ----------------
interface User {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  fullName?: string;
  full_name?: string;
  name?: string;
  avatar?: string;
  
  // 🎯 ADD THESE COLLABORATION-SPECIFIC FIELDS
  role: 'admin' | 'student' | 'mentor' | 'developer';
  skills: string[];
  githubUsername?: string;
  rating?: number;
  availability?: boolean;
  college?: string;
  year?: string;
  major?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ---------------- Session Response type ----------------
interface LoginResponse {
  user: User;
  session_code: string;
  expires_at: string;
  message: string;
}

// ---------------- Auth Context type ----------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSuperUser: boolean;
  isStaff: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getInitials: () => string;
  loading: boolean;
  // 🎯 ADD isLoading FOR COLLABORATION COMPATIBILITY
  isLoading: boolean;
}

// ---------------- Default context ----------------
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isSuperUser: false,
  isStaff: false,
  login: async () => {},
  logout: () => {},
  getInitials: () => "?",
  loading: true,
  isLoading: true, // 🎯 ADD THIS
});

// ---------------- Configure axios instance ----------------
const api = axios.create({
  baseURL: "https://stackhack-live.onrender.com/api",
  timeout: 10000,
});

// ---------------- AuthProvider ----------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🎯 HELPER: Convert backend user to frontend user format
  const transformUserData = (backendUser: any): User => {
    // 🎯 MAP BACKEND ROLES TO FRONTEND ROLES
    let role: 'admin' | 'student' | 'mentor' | 'developer' = 'student';
    
    if (backendUser.is_superuser) {
      role = 'admin';
    } else if (backendUser.role) {
      // If backend provides role directly, use it
      role = backendUser.role;
    } else if (backendUser.is_staff) {
      role = 'mentor'; // or whatever makes sense for your app
    }

    return {
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      is_superuser: backendUser.is_superuser || false,
      is_staff: backendUser.is_staff || false,
      fullName: backendUser.fullName || backendUser.full_name || backendUser.name || backendUser.username,
      name: backendUser.name || backendUser.username,
      avatar: backendUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.username)}&background=random`,
      
      // 🎯 ADD COLLABORATION FIELDS WITH DEFAULTS
      role: role,
      skills: backendUser.skills || [],
      githubUsername: backendUser.githubUsername || backendUser.github_username,
      rating: backendUser.rating || 0,
      availability: backendUser.availability || false,
      college: backendUser.college || '',
      year: backendUser.year || '',
      major: backendUser.major || '',
      createdAt: backendUser.createdAt ? new Date(backendUser.createdAt) : new Date(),
      updatedAt: backendUser.updatedAt ? new Date(backendUser.updatedAt) : new Date(),
    };
  };

  // ---------------- Set up axios interceptors ----------------
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const sessionCode = localStorage.getItem("session_code");
        if (sessionCode) {
          config.headers["X-Session-Code"] = sessionCode;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Session expired or invalid → just clear state (no redirect)
          localStorage.removeItem("session_code");
          localStorage.removeItem("user");
          localStorage.removeItem("session_expires");
          setUser(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ---------------- Fetch current user on app start ----------------
  useEffect(() => {
    const initializeAuth = async () => {
      const sessionCode = localStorage.getItem("session_code");
      const savedUser = localStorage.getItem("user");

      if (sessionCode && savedUser) {
        try {
          const response = await api.get<any>("/me/");
          // 🎯 TRANSFORM BACKEND USER DATA TO FRONTEND FORMAT
          const transformedUser = transformUserData(response.data);
          setUser(transformedUser);
          
          // 🎯 UPDATE LOCAL STORAGE WITH TRANSFORMED USER
          localStorage.setItem("user", JSON.stringify(transformedUser));
        } catch (error) {
          console.error("Session validation failed:", error);
          localStorage.removeItem("session_code");
          localStorage.removeItem("user");
          localStorage.removeItem("session_expires");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // ---------------- Login function ----------------
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      const response = await api.post<LoginResponse>("/login/", { username, password });

      const { user: userData, session_code, expires_at } = response.data;

      // 🎯 TRANSFORM BACKEND USER DATA TO FRONTEND FORMAT
      const transformedUser = transformUserData(userData);

      localStorage.setItem("session_code", session_code);
      localStorage.setItem("user", JSON.stringify(transformedUser));
      localStorage.setItem("session_expires", expires_at);

      api.defaults.headers.common["X-Session-Code"] = session_code;

      setUser(transformedUser);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error);
      localStorage.removeItem("session_code");
      localStorage.removeItem("user");
      localStorage.removeItem("session_expires");
      setUser(null);
      throw new Error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Logout function ----------------
  const logout = async () => {
    try {
      const sessionCode = localStorage.getItem("session_code");
      if (sessionCode) {
        await api.post("/logout/", { session_code: sessionCode });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("session_code");
      localStorage.removeItem("user");
      localStorage.removeItem("session_expires");

      delete api.defaults.headers.common["X-Session-Code"];

      setUser(null);
    }
  };

  // ---------------- Helper: get initials ----------------
  const getInitials = () => {
    if (!user) return "?";

    const fullName = user.fullName || user.full_name || user.name || "";
    if (!fullName.trim()) {
      return user.username.substring(0, 2).toUpperCase();
    }

    const parts = fullName.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();

    return parts[0][0].toUpperCase();
  };

  const isAuthenticated = !!user;
  const isSuperUser = !!user?.is_superuser;
  const isStaff = !!user?.is_staff;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isSuperUser, 
      isStaff, 
      login, 
      logout, 
      getInitials, 
      loading,
      isLoading: loading // 🎯 ADD THIS ALIAS FOR COLLABORATION COMPATIBILITY
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------------- Custom hook ----------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { api }; 