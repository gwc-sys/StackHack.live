import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import axios from "axios";
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

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
  firebase_uid?: string;
  
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
  token: string;
  message: string;
}

// ---------------- Firebase User type ----------------
interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// ---------------- Auth Context type ----------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isSuperUser: boolean;
  isStaff: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getInitials: () => string;
  loading: boolean;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;

  // NEW: update auth state after social/login flows
  updateUserAfterSocialLogin: (token: string, userData: any, firebaseUser?: FirebaseUser | null) => void;
}

// ---------------- Default context ----------------
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isSuperUser: false,
  isStaff: false,
  login: async () => {},
  logout: async () => {},
  getInitials: () => "?",
  loading: true,
  isLoading: true,
  firebaseUser: null,

  // no-op placeholder
  updateUserAfterSocialLogin: () => {},
});

// ---------------- Configure axios instance ----------------
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Updated to match your backend
  timeout: 10000,
});

// ---------------- AuthProvider ----------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
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
      avatar: backendUser.avatar || backendUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(backendUser.username)}&background=random`,
      firebase_uid: backendUser.firebase_uid,
      
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
        const token = localStorage.getItem("jwt_token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid → logout
          handleAutoLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // ---------------- Auto logout function ----------------
  const handleAutoLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    } finally {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setFirebaseUser(null);
    }
  };

  // ---------------- Firebase Auth State Listener ----------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const firebaseUserData: FirebaseUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        };
        setFirebaseUser(firebaseUserData);

        // Check if we have JWT token and user data
        const token = localStorage.getItem("jwt_token");
        const userData = localStorage.getItem("user_data");

        if (token && userData) {
          try {
            // Verify token is still valid by making an API call
            const response = await api.get("/auth/me/");
            const transformedUser = transformUserData(response.data);
            setUser(transformedUser);
          } catch (error) {
            console.error("Token validation failed:", error);
            await handleAutoLogout();
          }
        }
      } else {
        // User is signed out
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ---------------- Fetch current user on app start ----------------
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      const savedUser = localStorage.getItem("user_data");

      if (token && savedUser) {
        try {
          const response = await api.get<any>("/auth/me/");
          // 🎯 TRANSFORM BACKEND USER DATA TO FRONTEND FORMAT
          const transformedUser = transformUserData(response.data);
          setUser(transformedUser);
          
          // 🎯 UPDATE LOCAL STORAGE WITH TRANSFORMED USER
          localStorage.setItem("user_data", JSON.stringify(transformedUser));
        } catch (error) {
          console.error("Session validation failed:", error);
          await handleAutoLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // ---------------- Login function (for traditional login) ----------------
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      // This would be for traditional Django login
      // For Firebase, we use the signIn component directly
      const response = await api.post<LoginResponse>("/auth/login/", { 
        username, 
        password 
      });

      const { user: userData, token } = response.data;

      // 🎯 TRANSFORM BACKEND USER DATA TO FRONTEND FORMAT
      const transformedUser = transformUserData(userData);

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_data", JSON.stringify(transformedUser));

      setUser(transformedUser);
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error);
      await handleAutoLogout();
      throw new Error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Logout function ----------------
  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Call backend logout if needed
      const token = localStorage.getItem("jwt_token");
      if (token) {
        await api.post("/auth/logout/");
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user_data");
      
      // Clear axios headers
      delete api.defaults.headers.common["Authorization"];

      setUser(null);
      setFirebaseUser(null);
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

  // ---------------- Helper: Update user data after social login ----------------
  const updateUserAfterSocialLogin = (token: string, userData: any, firebaseUserData?: FirebaseUser | null) => {
    try {
      const transformedUser = transformUserData(userData);

      // persist
      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_data", JSON.stringify(transformedUser));

      // set axios default header so immediate requests include it
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // update react state
      setUser(transformedUser);

      if (firebaseUserData) {
        setFirebaseUser(firebaseUserData);
      }
    } catch (err) {
      console.error("updateUserAfterSocialLogin error:", err);
    }
  };

  const isAuthenticated = !!user && !!firebaseUser;
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
      isLoading: loading,
      firebaseUser,
      updateUserAfterSocialLogin, // <-- expose it
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