import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import api from "../utils/api"; // pre-configured Axios instance

// ---------------- User type ----------------
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
}

// ---------------- Auth Context type ----------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  getInitials: () => string;
}

// ---------------- Default context ----------------
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  getInitials: () => "?",
});

// ---------------- AuthProvider ----------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // ---------------- Fetch current user on app start ----------------
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      api.get<User>("/me/")
        .then((res) => setUser(res.data))
        .catch(() => {
          Cookies.remove("token");
          setUser(null);
        });
    }
  }, []);

  // ---------------- Login function ----------------
  const login = async (username: string, password: string) => {
    try {
      const res = await api.post("/login/", { username, password });

      // Save JWT token in cookie
      Cookies.set("token", res.data.access, { expires: 7, sameSite: "Lax" });

      // Fetch current user
      const userRes = await api.get("/me/");
      setUser(userRes.data);
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err);
      logout();
      throw err; // This allows the SignIn UI to handle error & loading
    }
  };

  // ---------------- Logout function ----------------
  const logout = () => {
    setUser(null);
    Cookies.remove("token");
  };

  // ---------------- Helper: get initials from fullName ----------------
  const getInitials = () => {
    if (!user?.fullName) return "?";
    const parts = user.fullName.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
};

// ---------------- Custom hook for easy usage ----------------
export const useAuth = () => useContext(AuthContext);
