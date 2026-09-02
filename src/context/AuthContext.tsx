import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("rn_admin_token"));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("rn_admin_token");
      if (savedToken) {
        try {
          const res = await api.adminMe();
          setUser(res.user);
          setToken(savedToken);
        } catch (err) {
          console.warn("Auth check failed:", err);
          localStorage.removeItem("rn_admin_token");
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.adminLogin(email, password);
    localStorage.setItem("rn_admin_token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch {}
    localStorage.removeItem("rn_admin_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

