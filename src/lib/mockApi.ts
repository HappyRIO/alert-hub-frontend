// In-memory mock backend with multi-channel accounts.
export interface AccountRec {
  id: number;
  type: "telegram" | "whatsapp" | "gmail" | "linkedin" | "discord";
  label: string;
  session_name: string;
  phone_number?: string;
  status: "active" | "disconnected" | "muted";
}

interface Notification {
  id: number;
  account_id?: number;
  sender: string;
  source: string;
  chat_name: string;
  message: string;
  is_read: boolean;
  message_time: string;
  created_at: string;
}

interface DB {
  users: Record<string, string>;
  accounts: AccountRec[];
  notifications: Notification[];
  pendingCodes: Record<string, true>;
  pushEnabled: boolean;
  nextId: number;
}

const KEY = "alerthub_mockdb_v3";

const SAMPLE_SENDERS = ["Alice Chen", "Bob Martinez", "Server Bot", "Mom", "DevOps Alerts", "Sarah Kim", "GitHub", "Unknown sender"];
const SAMPLE_CHATS = ["#general", "Direct message", "Family", "alerts-prod", "team-eng"];
const SAMPLE_MSGS = [
  "Hey, are we still meeting at 3pm?",
  "Build #482 succeeded on main.",
  "Don't forget to pick up groceries.",
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
    return { users: {}, accounts: [], notifications: [], pendingCodes: {}, pushEnabled: false, nextId: 1 };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const db: DB = {
    users: { "dev@test.com": "test123!@#" },
    accounts: [
      { id: 1, type: "telegram", label: "Personal", session_name: "personal", phone_number: "+15551234567", status: "active" },
    ],
    notifications: seedNotifications(),
    pendingCodes: {},
    pushEnabled: false,
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
      account_id: 1,
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
function commit() { saveDB(db); }

function token(email: string, kind: "a" | "r") { return `mock.${kind}.${btoa(email)}.${Date.now()}`; }
function emailFromToken(t: string | null | undefined): string | null {
  if (!t || !t.startsWith("mock.")) return null;
  try { return atob(t.split(".")[2]); } catch { return null; }
}
function delay<T>(v: T, ms = 200): Promise<T> { return new Promise((res) => setTimeout(() => res(v), ms)); }
function ok<T>(data: T) { return { status: 200, json: data }; }
function err(status: number, detail: string) { return { status, json: { detail } }; }

let lastInject = Date.now();
function maybeInjectNew() {
  const now = Date.now();
  if (now - lastInject < 12_000) return;
  const activeAccts = db.accounts.filter((a) => a.status === "active");
  if (activeAccts.length === 0) return;
  if (Math.random() < 0.5) {
    lastInject = now;
    const t = new Date().toISOString();
    const acct = activeAccts[Math.floor(Math.random() * activeAccts.length)];
    db.notifications.unshift({
      id: db.nextId++,
      account_id: acct.id,
      sender: SAMPLE_SENDERS[Math.floor(Math.random() * SAMPLE_SENDERS.length)],
      source: acct.type,
      chat_name: SAMPLE_CHATS[Math.floor(Math.random() * SAMPLE_CHATS.length)],
      message: SAMPLE_MSGS[Math.floor(Math.random() * SAMPLE_MSGS.length)],
      is_read: false,
      message_time: t,
      created_at: t,
    });
    commit();
  }
}

export interface MockResponse { status: number; json: any; }

export function handleMock(method: string, path: string, body: any, authHeader?: string | null): Promise<MockResponse> {
  const M = method.toUpperCase();

  if (path === "/auth/register" && M === "POST") {
    const { email, password } = body || {};
    if (!email || !password) return delay(err(400, "Email and password required"));
    if (db.users[email]) return delay(err(409, "User already exists"));
    db.users[email] = password; commit();
    return delay(ok({ access_token: token(email, "a"), refresh_token: token(email, "r"), token_type: "bearer" }));
  }
  if (path === "/auth/login" && M === "POST") {
    const { email, password } = body || {};
    if (!db.users[email] || db.users[email] !== password) return delay(err(401, "Authentication failed"));
    return delay(ok({ access_token: token(email, "a"), refresh_token: token(email, "r"), token_type: "bearer" }));
  }
  if (path === "/auth/refresh" && M === "POST") {
    const e = emailFromToken(body?.refresh_token);
    if (!e || !db.users[e]) return delay(err(401, "Invalid refresh token"));
    return delay(ok({ access_token: token(e, "a"), refresh_token: token(e, "r"), token_type: "bearer" }));
  }

  const bearer = authHeader?.replace(/^Bearer\s+/i, "");
  const email = emailFromToken(bearer);
  if (!email || !db.users[email]) {
    if (path === "/push/public-key" && M === "GET") return delay(ok({ public_key: "" }));
    return delay(err(401, "Unauthorized"));
  }

  // ---- Me ----
  if (path === "/me" && M === "GET") return delay(ok({ email }));
  if (path === "/me/email" && M === "PUT") {
    const { new_email, password } = body || {};
    if (db.users[email] !== password) return delay(err(401, "Wrong password"));
    if (!new_email) return delay(err(400, "Email required"));
    if (db.users[new_email] && new_email !== email) return delay(err(409, "Email taken"));
    const pw = db.users[email]; delete db.users[email]; db.users[new_email] = pw; commit();
    return delay(ok({ access_token: token(new_email, "a"), refresh_token: token(new_email, "r") }));
  }
  if (path === "/me/password" && M === "PUT") {
    const { current_password, new_password } = body || {};
    if (db.users[email] !== current_password) return delay(err(401, "Wrong password"));
    if (!new_password || new_password.length < 6) return delay(err(400, "Password too short"));
    db.users[email] = new_password; commit();
    return delay(ok({ ok: true }));
  }

  // ---- Notifications ----
  if (path.startsWith("/notifications/unread-count") && M === "GET") {
    maybeInjectNew();
    const mutedIds = new Set(db.accounts.filter((a) => a.status !== "active").map((a) => a.id));
    const count = db.notifications.filter((n) => !n.is_read && !mutedIds.has(n.account_id ?? -1)).length;
    return delay(ok({ count }));
  }
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
    if (n) n.is_read = true; commit();
    return delay(ok({ ok: true }));
  }

  // ---- Accounts (multi-channel) ----
  if (path === "/accounts" && M === "GET") return delay(ok(db.accounts));
  const acctMatch = path.match(/^\/accounts\/(\d+)(?:\/(\w+))?$/);
  if (acctMatch) {
    const id = parseInt(acctMatch[1], 10);
    const action = acctMatch[2];
    const a = db.accounts.find((x) => x.id === id);
    if (!a) return delay(err(404, "Account not found"));
    if (M === "DELETE" && !action) {
      db.accounts = db.accounts.filter((x) => x.id !== id); commit();
      return delay(ok({ ok: true }));
    }
    if (M === "POST" && action === "disconnect") { a.status = "disconnected"; commit(); return delay(ok(a)); }
    if (M === "POST" && action === "reconnect") { a.status = "active"; commit(); return delay(ok(a)); }
    if (M === "POST" && action === "mute") { a.status = "muted"; commit(); return delay(ok(a)); }
    if (M === "POST" && action === "unmute") { a.status = "active"; commit(); return delay(ok(a)); }
  }

  // ---- Telegram connect wizard ----
  if (path === "/telegram/connect/send-code" && M === "POST") {
    if (!body?.label || !body?.session_name || !body?.phone_number) return delay(err(400, "Missing fields"));
    db.pendingCodes[body.session_name] = true; commit();
    return delay(ok({ ok: true, hint: "Mock: any code works (use 00000 to simulate 2FA)" }));
  }
  if (path === "/telegram/connect/verify" && M === "POST") {
    if (!db.pendingCodes[body.session_name]) return delay(err(400, "Send code first"));
    if (!body.code) return delay(err(400, "Code required"));
    if (body.code === "00000" && !body.password) return delay(err(401, "2FA password required"));
    const a: AccountRec = {
      id: db.nextId++, type: "telegram",
      label: body.label, session_name: body.session_name,
      phone_number: body.phone_number, status: "active",
    };
    db.accounts.push(a);
    delete db.pendingCodes[body.session_name]; commit();
    return delay(ok({ ok: true, account: a }));
  }

  // ---- Push ----
  if (path === "/push/public-key" && M === "GET") return delay(ok({ public_key: "" }));
  if (path === "/push/state" && M === "GET") return delay(ok({ enabled: db.pushEnabled }));
  if (path === "/push/state" && M === "PUT") { db.pushEnabled = !!body?.enabled; commit(); return delay(ok({ enabled: db.pushEnabled })); }
  if (path === "/push/subscribe" && M === "POST") return delay(ok({ ok: true }));
  if (path === "/push/test" && M === "POST") return delay(ok({ ok: true }));

  return delay(err(404, `Mock: ${M} ${path} not implemented`));
}
