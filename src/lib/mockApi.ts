// In-memory mock backend implementing the Alert Hub API contract.
// Persists to localStorage so the demo survives reloads.

interface Account {
  id: number;
  label: string;
  session_name: string;
  phone_number?: string;
}

interface Notification {
  id: number;
  sender: string;
  source: string;
  chat_name: string;
  message: string;
  is_read: boolean;
  message_time: string;
  created_at: string;
}

interface DB {
  users: Record<string, string>; // email -> password
  accounts: Account[];
  notifications: Notification[];
  pendingCodes: Record<string, true>; // session_name -> code-sent
  nextId: number;
}

const KEY = "alerthub_mockdb_v1";

const SAMPLE_SENDERS = ["Alice Chen", "Bob Martinez", "Server Bot", "Mom", "DevOps Alerts", "Sarah Kim", "GitHub", "Unknown sender"];
const SAMPLE_CHATS = ["#general", "Direct message", "Family", "alerts-prod", "team-eng"];
const SAMPLE_MSGS = [
  "Hey, are we still meeting at 3pm?",
  "Build #482 succeeded on main.",
  "Don't forget to pick up groceries 🥦",
  "Database CPU above 85% for 5 minutes.",
  "PR #1204 has been approved and merged.",
  "Reminder: stand-up in 10 minutes.",
  "Backup completed successfully.",
  "New login from a new device. Was this you?",
  "Lunch tomorrow?",
  "Deploy to staging finished. Check it out.",
];

function loadDB(): DB {
  if (typeof window === "undefined") {
    return { users: {}, accounts: [], notifications: [], pendingCodes: {}, nextId: 1 };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const db: DB = {
    users: { "dev@test.com": "test123!@#" },
    accounts: [],
    notifications: seedNotifications(),
    pendingCodes: {},
    nextId: 100,
  };
  saveDB(db);
  return db;
}

function saveDB(db: DB) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(db));
}

function seedNotifications(): Notification[] {
  const now = Date.now();
  const out: Notification[] = [];
  for (let i = 0; i < 24; i++) {
    const t = new Date(now - i * 1000 * 60 * (5 + Math.random() * 90)).toISOString();
    out.push({
      id: 1000 + i,
      sender: SAMPLE_SENDERS[i % SAMPLE_SENDERS.length],
      source: "telegram",
      chat_name: SAMPLE_CHATS[i % SAMPLE_CHATS.length],
      message: SAMPLE_MSGS[i % SAMPLE_MSGS.length],
      is_read: i > 6,
      message_time: t,
      created_at: t,
    });
  }
  return out;
}

let db = loadDB();

function commit() {
  saveDB(db);
}

function token(email: string, kind: "a" | "r") {
  return `mock.${kind}.${btoa(email)}.${Date.now()}`;
}

function emailFromToken(t: string | null | undefined): string | null {
  if (!t || !t.startsWith("mock.")) return null;
  try {
    return atob(t.split(".")[2]);
  } catch {
    return null;
  }
}

function delay<T>(v: T, ms = 250): Promise<T> {
  return new Promise((res) => setTimeout(() => res(v), ms));
}

function ok<T>(data: T) {
  return { status: 200, json: data };
}
function err(status: number, detail: string) {
  return { status, json: { detail } };
}

// Occasionally inject a brand-new unread notification to simulate live ingest.
let lastInject = Date.now();
function maybeInjectNew() {
  const now = Date.now();
  if (now - lastInject < 12_000) return;
  if (Math.random() < 0.5) {
    lastInject = now;
    const t = new Date().toISOString();
    db.notifications.unshift({
      id: db.nextId++,
      sender: SAMPLE_SENDERS[Math.floor(Math.random() * SAMPLE_SENDERS.length)],
      source: "telegram",
      chat_name: SAMPLE_CHATS[Math.floor(Math.random() * SAMPLE_CHATS.length)],
      message: SAMPLE_MSGS[Math.floor(Math.random() * SAMPLE_MSGS.length)],
      is_read: false,
      message_time: t,
      created_at: t,
    });
    commit();
  }
}

export interface MockResponse {
  status: number;
  json: any;
}

export function handleMock(method: string, path: string, body: any, authHeader?: string | null): Promise<MockResponse> {
  const M = method.toUpperCase();

  // ---- Auth ----
  if (path === "/auth/register" && M === "POST") {
    const { email, password } = body || {};
    if (!email || !password) return delay(err(400, "Email and password required"));
    if (db.users[email]) return delay(err(409, "User already exists"));
    db.users[email] = password;
    commit();
    return delay(ok({ access_token: token(email, "a"), refresh_token: token(email, "r"), token_type: "bearer" }));
  }
  if (path === "/auth/login" && M === "POST") {
    const { email, password } = body || {};
    if (!db.users[email] || db.users[email] !== password) return delay(err(401, "Authentication failed"));
    return delay(ok({ access_token: token(email, "a"), refresh_token: token(email, "r"), token_type: "bearer" }));
  }
  if (path === "/auth/refresh" && M === "POST") {
    const email = emailFromToken(body?.refresh_token);
    if (!email || !db.users[email]) return delay(err(401, "Invalid refresh token"));
    return delay(ok({ access_token: token(email, "a"), refresh_token: token(email, "r"), token_type: "bearer" }));
  }

  // ---- Auth gate ----
  const bearer = authHeader?.replace(/^Bearer\s+/i, "");
  const email = emailFromToken(bearer);
  if (!email || !db.users[email]) {
    // Push public-key is allowed without auth in many setups
    if (path === "/push/public-key" && M === "GET") {
      return delay(ok({ public_key: "" }));
    }
    return delay(err(401, "Unauthorized"));
  }

  // ---- Notifications ----
  if (path.startsWith("/notifications") && M === "GET") {
    maybeInjectNew();
    const url = new URL("http://x" + path);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const page_size = parseInt(url.searchParams.get("page_size") || "20", 10);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const isReadParam = url.searchParams.get("is_read");
    let filtered = db.notifications.slice();
    if (q) filtered = filtered.filter((n) => n.message.toLowerCase().includes(q) || n.sender.toLowerCase().includes(q));
    if (isReadParam === "true") filtered = filtered.filter((n) => n.is_read);
    if (isReadParam === "false") filtered = filtered.filter((n) => !n.is_read);
    const total = filtered.length;
    const items = filtered.slice((page - 1) * page_size, page * page_size);
    return delay(ok({ items, total, page, page_size }));
  }
  const readMatch = path.match(/^\/notifications\/(\d+)\/read$/);
  if (readMatch && M === "POST") {
    const id = parseInt(readMatch[1], 10);
    const n = db.notifications.find((x) => x.id === id);
    if (n) n.is_read = true;
    commit();
    return delay(ok({ ok: true }));
  }

  // ---- Telegram ----
  if (path === "/telegram/accounts" && M === "GET") {
    return delay(ok(db.accounts));
  }
  if (path === "/telegram/accounts" && M === "POST") {
    const a: Account = { id: db.nextId++, label: body.label, session_name: body.session_name, phone_number: body.phone_number };
    db.accounts.push(a);
    commit();
    return delay(ok(a));
  }
  if (path === "/telegram/connect/send-code" && M === "POST") {
    if (!body?.label || !body?.session_name || !body?.phone_number) return delay(err(400, "Missing fields"));
    db.pendingCodes[body.session_name] = true;
    commit();
    return delay(ok({ ok: true, hint: "Mock: enter any code (use 00000 to simulate 2FA required)" }));
  }
  if (path === "/telegram/connect/verify" && M === "POST") {
    if (!db.pendingCodes[body.session_name]) return delay(err(400, "Send code first"));
    if (!body.code) return delay(err(400, "Code required"));
    if (body.code === "00000" && !body.password) return delay(err(401, "2FA password required"));
    const a: Account = { id: db.nextId++, label: body.label, session_name: body.session_name, phone_number: body.phone_number };
    db.accounts.push(a);
    delete db.pendingCodes[body.session_name];
    commit();
    return delay(ok({ ok: true, account: a }));
  }

  // ---- Push ----
  if (path === "/push/public-key" && M === "GET") {
    return delay(ok({ public_key: "" })); // empty -> UI shows "Missing VAPID key"
  }
  if (path === "/push/subscribe" && M === "POST") {
    return delay(ok({ ok: true }));
  }
  if (path === "/push/test" && M === "POST") {
    return delay(ok({ ok: true }));
  }

  return delay(err(404, `Mock: ${M} ${path} not implemented`));
}