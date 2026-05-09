import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

// User type matching Laravel response
type User = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

// Context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUserData: (user: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set user data
  const setUserData = (userData: User) => {
    setUser(userData);
  };

  // Fetch current logged-in user
  const fetchMe = async () => {
    try {
      const res = await apiClient.get("/api/auth/profile");
      if (res.data.success && res.data.data) {
        setUserData(res.data.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Then fetch user data
      await fetchMe();
    };

    initializeAuth();
  }, []);

  // Logout function - calls backend logout endpoint
  const logout = async () => {
    try {
      await apiClient.post("/api/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUserData,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
