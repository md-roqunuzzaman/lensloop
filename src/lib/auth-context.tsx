"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api";
import type { LoginInput, RegisterInput } from "@/lib/validations";
import type { User } from "@/types";
import { toast } from "sonner";

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: string;
  };
}

interface MeResponse {
  success: boolean;
  message: string;
  data: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function hydrate() {
    try {
      const response = await api.get<MeResponse>("/auth/me");

      // Backend response:
      // { success, message, data: user }
      setUser(response.data);
    } catch (error) {
      // 401 এখানে normal হতে পারে যখন user logged out.
      setUser(null);

      if (process.env.NODE_ENV === "development") {
        console.log("Auth hydration failed:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    hydrate();
  }, []);

  async function login(input: LoginInput): Promise<User> {
    const response = await api.post<AuthResponse>("/auth/login", input, {
      auth: false,
    });

    // Backend response:
    // {
    //   success: true,
    //   message: "Login successful",
    //   data: {
    //     user: {...}
    //   }
    // }

    const loggedInUser = response.data.user;

    setUser(loggedInUser);

    return loggedInUser;
  }

  async function register(input: RegisterInput) {
    const { confirmPassword, ...rest } = input;

    void confirmPassword;

    const response = await api.post<AuthResponse>("/auth/register", rest, {
      auth: false,
    });

    setUser(response.data.user);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");

      setUser(null);

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);

      // Even if API logout fails, clear local user state
      setUser(null);

      toast.error("Logout failed. Please try again.");
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
