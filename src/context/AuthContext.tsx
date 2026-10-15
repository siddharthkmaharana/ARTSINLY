"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
  avatar?: string | null;
  phone?: string | null;
  sellerProfile?: {
    id: string;
    shopName: string;
    slug: string;
    craftTradition: string;
    state: string;
    locality?: string | null;
    giCode?: string | null;
    isVerified: boolean;
    bio?: string | null;
    story?: string | null;
    bannerUrl?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: "BUYER" | "SELLER";
    phone?: string;
  }) => Promise<{ success: boolean; error?: string; user?: UserProfile }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      // Check localStorage backup first for immediate visual hydration
      const cached = localStorage.getItem("artsinly_user");
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          // ignore parsing error
        }
      }

      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("artsinly_user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("artsinly_user");
        }
      }
    } catch (err) {
      console.error("Failed to check auth state:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }

      setUser(data.user);
      localStorage.setItem("artsinly_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during login" };
    }
  };

  const register = async (inputData: {
    email: string;
    password: string;
    name: string;
    role: "BUYER" | "SELLER";
    phone?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }

      setUser(data.user);
      localStorage.setItem("artsinly_user", JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error during registration" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("artsinly_user");
      window.location.href = "/";
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
