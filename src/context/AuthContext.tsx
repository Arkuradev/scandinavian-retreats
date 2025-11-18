import { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser } from "@/types/auth";
import type { LoginResult } from "@/lib/login";
import { getProfile } from "@/lib/getProfile";

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (res: LoginResult) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setUser(parsed.user ?? null);
      setToken(parsed.token ?? null);
    } catch {
      // bad JSON = clear
      localStorage.removeItem("auth");
    }
  }, []);

  const login = async (res: LoginResult) => {
    // 1. Save token first
    setToken(res.accessToken);

    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: res.accessToken,
        user: null,
      }),
    );

    // 2. Fetch real profile with correct venueManager
    const profile = await getProfile(res.name, res.accessToken);

    // 3. Build the correct user object
    const next = {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar ?? undefined,
      venueManager: profile.venueManager ?? false,
    };

    // 4. Store in state + storage
    setUser(next);
    setToken(res.accessToken);
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: res.accessToken,
        user: next,
        loggedInAt: Date.now(),
      }),
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
