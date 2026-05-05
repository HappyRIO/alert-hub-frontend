import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, tokens } from "./api";

interface AuthCtx {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuth(!!tokens.access);
    setLoading(false);
  }, []);

  const handle = async (path: string, email: string, password: string) => {
    const data = await api<{ access_token: string; refresh_token: string }>(path, {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password }),
    });
    tokens.set(data.access_token, data.refresh_token);
    setAuth(true);
  };

  return (
    <Ctx.Provider
      value={{
        isAuthenticated,
        loading,
        login: (e, p) => handle("/auth/login", e, p),
        register: (e, p) => handle("/auth/register", e, p),
        logout: () => {
          tokens.clear();
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