import { handleMock } from "./mockApi";

const API_BASE = "mock://api";

const ACCESS_KEY = "alerthub_access_token";
const REFRESH_KEY = "alerthub_refresh_token";

export const tokens = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const r = tokens.refresh;
  if (!r) return false;
  try {
    const res = await handleMock("POST", "/auth/refresh", { refresh_token: r });
    if (res.status >= 400) return false;
    const data = res.json;
    tokens.set(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export async function api<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean; raw?: boolean } = {},
): Promise<T> {
  const { auth = true, method = "GET", body } = opts;
  const parsedBody = typeof body === "string" ? safeParse(body) : body;
  const make = () =>
    handleMock(method as string, path, parsedBody, auth && tokens.access ? `Bearer ${tokens.access}` : undefined);

  let res = await make();
  if (res.status === 401 && auth && tokens.refresh) {
    if (!refreshing) refreshing = doRefresh().finally(() => (refreshing = null));
    const ok = await refreshing;
    if (ok) {
      res = await make();
    } else {
      tokens.clear();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired");
    }
  }
  if (res.status >= 400) {
    const msg = res.json?.detail || res.json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return res.json as T;
}

function safeParse(s: string): any {
  try { return JSON.parse(s); } catch { return s; }
}

export { API_BASE };