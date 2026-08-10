"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { api, setToken, clearToken } from "@/lib/api";
import type { LoginInput, RegisterInput } from "@/lib/validations";
import type { Role, User } from "@/types";

interface JwtPayload {
  sub: string;
  role: Role;
  exp: number;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function hydrate() {
    const token = typeof window !== "undefined" ? localStorage.getItem("lensloop_token") : null;
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp * 1000 < Date.now()) {
        clearToken();
        setLoading(false);
        return;
      }
      const me = await api.get<User>("/auth/me");
      setUser(me);
    } catch {
      clearToken();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Standard auth-hydration-on-mount pattern: decode any stored JWT and fetch
    // the current user once when the provider mounts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(input: LoginInput): Promise<User> {
    const res = await api.post<AuthResponse>("/auth/login", input, {
      auth: false,
    });
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }

  async function register(input: RegisterInput) {
    const { confirmPassword, ...rest } = input;
    void confirmPassword;
    const res = await api.post<AuthResponse>("/auth/register", rest, {
      auth: false,
    });
    setToken(res.accessToken);
    setUser(res.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
