import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokens } from "./api";

interface RegisterResult {
  email: string;
  is_active: boolean;
  message: string;
}

interface AuthCtx {
  isAuthenticated: boolean;
  loading: boolean;
  user: { name: string; email: string; avatar_url?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<RegisterResult>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    const init = async () => {
      const hasToken = !!tokens.access;
      setAuth(hasToken);
      if (hasToken) {
        try {
          const me = await api<{ name: string; email: string; avatar_url?: string }>("/me");
          setUser(me);
        } catch {
          tokens.clear();
          setAuth(false);
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const doLogin = async (email: string, password: string) => {
    const data = await api<{ access_token: string; refresh_token: string }>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    });
    tokens.set(data.access_token, data.refresh_token);
    const me = await api<{ name: string; email: string; avatar_url?: string }>("/me");
    setUser(me);
    setAuth(true);
  };

  const doRegister = async (name: string, email: string, password: string): Promise<RegisterResult> => {
    return api<RegisterResult>("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ name, email, password }),
    });
  };

  return (
    <Ctx.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login: doLogin,
        register: doRegister,
        logout: () => {
          tokens.clear();
          setUser(null);
          setAuth(false);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}