const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "http://localhost:8000/api";

function apiOrigin(): string {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return "http://localhost:8000";
  }
}

/** Media/notifications may store absolute URLs built with a dev `public_base_url`. Point them at the configured API host. */
export function resolveBackendMediaUrl(url: string | null | undefined): string {
  if (url == null) return "";
  const u = url.trim();
  if (!u) return "";
  const origin = apiOrigin();
  for (const host of ["http://localhost:8000", "http://127.0.0.1:8000"]) {
    if (u.startsWith(`${host}/`) || u === host) {
      return origin + u.slice(host.length);
    }
  }
  return u;
}

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
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: r }),
    });
    if (res.status >= 400) return false;
    const data = await res.json();
    tokens.set(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

const DEFAULT_TIMEOUT_MS = 15000;

export async function api<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean; raw?: boolean; timeoutMs?: number } = {},
): Promise<T> {
  const {
    auth = true,
    method = "GET",
    body,
    headers,
    raw = false,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    signal,
    ...rest
  } = opts;
  const make = () => {
    const requestHeaders = new Headers(headers || {});
    const hasBody = body !== undefined && body !== null;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (hasBody && !isFormData && !requestHeaders.has("Content-Type")) {
      requestHeaders.set("Content-Type", "application/json");
    }
    if (auth && tokens.access) {
      requestHeaders.set("Authorization", `Bearer ${tokens.access}`);
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    if (signal) {
      if (signal.aborted) controller.abort();
      else signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
    return fetch(`${API_BASE}${path}`, {
      method,
      body,
      headers: requestHeaders,
      signal: controller.signal,
      ...rest,
    })
      .catch((err) => {
        if (err?.name === "AbortError") {
          throw new Error(`Request timed out after ${timeoutMs}ms (${method} ${path})`);
        }
        throw new Error(err?.message || `Network error (${method} ${path})`);
      })
      .finally(() => clearTimeout(timer));
  };

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
    let payload: any = null;
    try {
      payload = await res.json();
    } catch {}
    const msg = payload?.detail || payload?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (raw) return (res as T);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export { API_BASE };