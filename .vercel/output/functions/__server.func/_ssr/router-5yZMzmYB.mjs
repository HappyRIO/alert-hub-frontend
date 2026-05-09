import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, d as useNavigate, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root$2 } from "../_libs/radix-ui__react-label.mjs";
import { R as Root$1, T as Thumb } from "../_libs/radix-ui__react-switch.mjs";
import { r as reactDomExports } from "../_libs/react-dom.mjs";
import { u as ungzip_1 } from "../_libs/pako.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as Separator2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2, L as Label2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { P as Plus, B as BellOff, a as PowerOff, b as Bell, c as Power, T as Trash2, S as Send, M as MessageCircle, d as Mail, L as Linkedin, H as Hash, K as KeyRound, e as Menu, f as Search, V as VolumeX, g as Pin, A as ArrowLeft, X, h as Phone, E as EllipsisVertical, C as CircleCheck, i as Circle, j as SendHorizontal, F as FileText, k as Sticker, I as Image, l as Video, m as Music2, n as CheckCheck, o as Check, p as Paperclip, R as Reply, q as Copy, D as Download, r as SquareCheckBig, s as Pencil, t as Volume2, u as EyeOff, v as Eye, w as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const API_BASE = "https://alert-hub-backend.onrender.com/api"?.replace(/\/$/, "") || "http://localhost:8000/api";
const ACCESS_KEY = "alerthub_access_token";
const REFRESH_KEY = "alerthub_refresh_token";
const tokens = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access, refresh) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};
let refreshing = null;
async function doRefresh() {
  const r = tokens.refresh;
  if (!r) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: r })
    });
    if (res.status >= 400) return false;
    const data = await res.json();
    tokens.set(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}
const DEFAULT_TIMEOUT_MS = 15e3;
async function api(path, opts = {}) {
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
    const hasBody = body !== void 0 && body !== null;
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
      ...rest
    }).catch((err) => {
      if (err?.name === "AbortError") {
        throw new Error(`Request timed out after ${timeoutMs}ms (${method} ${path})`);
      }
      throw new Error(err?.message || `Network error (${method} ${path})`);
    }).finally(() => clearTimeout(timer));
  };
  let res = await make();
  if (res.status === 401 && auth && tokens.refresh) {
    if (!refreshing) refreshing = doRefresh().finally(() => refreshing = null);
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
    let payload = null;
    try {
      payload = await res.json();
    } catch {
    }
    const msg = payload?.detail || payload?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  if (raw) return res;
  if (res.status === 204) return void 0;
  return await res.json();
}
const Ctx = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [isAuthenticated, setAuth] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const [user, setUser] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const init = async () => {
      const hasToken = !!tokens.access;
      setAuth(hasToken);
      if (hasToken) {
        try {
          const me = await api("/me");
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
  const doLogin = async (email, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, password })
    });
    tokens.set(data.access_token, data.refresh_token);
    const me = await api("/me");
    setUser(me);
    setAuth(true);
  };
  const doRegister = async (name, email, password) => {
    return api("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ name, email, password })
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        isAuthenticated,
        loading,
        user,
        login: doLogin,
        register: doRegister,
        logout: () => {
          tokens.clear();
          setUser(null);
          setAuth(false);
        }
      },
      children
    }
  );
}
function useAuth() {
  const c = reactExports.useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
const appCss = "/assets/styles-CzZmSF3y.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
const Route$e = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
const $$splitComponentImporter$a = () => import("./settings-D65ACzTs.mjs");
const Route$d = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Alert Hub"
    }, {
      name: "description",
      content: "Manage push notifications and your account credentials."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./notifications-BmXB19Kw.mjs");
const Route$c = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "Notifications — Alert Hub"
    }, {
      name: "description",
      content: "Browse, search, and manage your notification feed."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./login-VzGorV6j.mjs");
const Route$b = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — Alert Hub"
    }, {
      name: "description",
      content: "Sign in or create an Alert Hub account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./dashboard-CzU2eI6M.mjs");
const Route$a = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Alert Hub"
    }, {
      name: "description",
      content: "Your unified Alert Hub notification feed."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./chat-BK-Pfyuv.mjs");
const Route$9 = createFileRoute("/chat")({
  head: () => ({
    meta: [{
      title: "Chat — Alert Hub"
    }, {
      name: "description",
      content: "Chat with connected accounts in channel-specific layouts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./account-oTdbrsNP.mjs");
const Route$8 = createFileRoute("/account")({
  head: () => ({
    meta: [{
      title: "Accounts — Alert Hub"
    }, {
      name: "description",
      content: "Manage your connected message accounts."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-8IQ21w7D.mjs");
const Route$7 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Alert Hub"
    }, {
      name: "description",
      content: "Unified notification dashboard for Telegram and beyond."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./dashboard.index-DYy4yCT5.mjs");
const Route$6 = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{
      title: "Notifications — Alert Hub"
    }, {
      name: "description",
      content: "Browse, search, and manage your notification feed."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./account.index-BSPvrqw_.mjs");
const Route$5 = createFileRoute("/account/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Input = reactExports.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Root$2, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = Root$2.displayName;
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root$1.displayName;
const Route$4 = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Alert Hub" },
      { name: "description", content: "Manage push notifications and your account credentials." }
    ]
  }),
  component: SettingsPage
});
function PwInput({ id, value, onChange, autoComplete }) {
  const [show, setShow] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id, type: show ? "text" : "password", value, onChange: (e) => onChange(e.target.value), autoComplete, className: "pr-10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setShow((s) => !s),
        className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
        "aria-label": show ? "Hide password" : "Show password",
        children: show ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
      }
    )
  ] });
}
function SettingsPage() {
  const [pushOn, setPushOn] = reactExports.useState(false);
  const [pushBusy, setPushBusy] = reactExports.useState(false);
  const [me, setMe] = reactExports.useState("");
  const [newEmail, setNewEmail] = reactExports.useState("");
  const [emailPw, setEmailPw] = reactExports.useState("");
  const [busyEmail, setBusyEmail] = reactExports.useState(false);
  const [curPw, setCurPw] = reactExports.useState("");
  const [newPw, setNewPw] = reactExports.useState("");
  const [newPw2, setNewPw2] = reactExports.useState("");
  const [busyPw, setBusyPw] = reactExports.useState(false);
  reactExports.useEffect(() => {
    api("/push/state").then((d) => setPushOn(d.enabled)).catch(() => {
    });
    api("/me").then((d) => {
      setMe(d.email);
      setNewEmail(d.email);
    }).catch(() => {
    });
  }, []);
  const togglePush = async (v) => {
    setPushBusy(true);
    try {
      await api("/push/state", { method: "PUT", body: JSON.stringify({ enabled: v }) });
      setPushOn(v);
      toast.success(v ? "Push notifications enabled" : "Push notifications disabled");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setPushBusy(false);
    }
  };
  const updateEmail = async (e) => {
    e.preventDefault();
    setBusyEmail(true);
    try {
      const data = await api("/me/email", {
        method: "PUT",
        body: JSON.stringify({ new_email: newEmail, password: emailPw })
      });
      if (data.access_token && data.refresh_token) {
        tokens.set(data.access_token, data.refresh_token);
      }
      toast.success("Email updated");
      setMe(newEmail);
      setEmailPw("");
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setBusyEmail(false);
    }
  };
  const updatePassword = async (e) => {
    e.preventDefault();
    if (newPw !== newPw2) {
      toast.error("Passwords don't match");
      return;
    }
    setBusyPw(true);
    try {
      await api("/me/password", { method: "PUT", body: JSON.stringify({ current_password: curPw, new_password: newPw }) });
      toast.success("Password updated");
      setCurPw("");
      setNewPw("");
      setNewPw2("");
    } catch (e2) {
      toast.error(e2.message);
    } finally {
      setBusyPw(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-xl border border-border bg-card p-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Browser push notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Get real-time alerts in your browser when new messages arrive." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: pushOn, disabled: pushBusy, onCheckedChange: togglePush })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Change login email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Current: ",
            me
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: updateEmail, className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-email", children: "New email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "new-email", type: "email", value: newEmail, onChange: (e) => setNewEmail(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email-pw", children: "Confirm password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PwInput, { id: "email-pw", value: emailPw, onChange: setEmailPw, autoComplete: "current-password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busyEmail, children: busyEmail ? "Saving…" : "Update email" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Change password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use at least 6 characters." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: updatePassword, className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cur-pw", children: "Current password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PwInput, { id: "cur-pw", value: curPw, onChange: setCurPw, autoComplete: "current-password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-pw", children: "New password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PwInput, { id: "new-pw", value: newPw, onChange: setNewPw, autoComplete: "new-password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "new-pw2", children: "Confirm new password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PwInput, { id: "new-pw2", value: newPw2, onChange: setNewPw2, autoComplete: "new-password" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: busyPw, children: busyPw ? "Saving…" : "Update password" }) })
      ] })
    ] })
  ] });
}
function telegramStyleInitials(displayName) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    const w = parts[0];
    if (w.length >= 2) return `${w[0]}${w[1]}`.toUpperCase();
    return w[0].toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
function avatarTone(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  return `hsl(${hash} 65% 45%)`;
}
function accountDisplayName$1(a) {
  return a.display_name || a.label || a.username || "Unnamed account";
}
function AccountAvatar({
  account,
  className = "",
  sizeClassName = "h-7 w-7",
  textClassName = "text-[10px]",
  muted: mutedProp
}) {
  const [failed, setFailed] = reactExports.useState(false);
  const url = (account.avatar_url || "").trim();
  const name = accountDisplayName$1(account);
  const initials = telegramStyleInitials(name);
  const showImg = Boolean(url) && !failed;
  const muted = mutedProp ?? account.status === "muted";
  reactExports.useEffect(() => {
    setFailed(false);
  }, [url]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${textClassName} ${sizeClassName} ${className}`,
      style: { backgroundColor: avatarTone(name) },
      title: muted ? `${name} · Notifications muted` : name,
      children: [
        showImg ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: url,
            alt: "",
            className: "h-full w-full object-cover",
            onError: () => setFailed(true)
          }
        ) : initials,
        muted && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "pointer-events-none absolute -left-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-1 ring-border/60",
            title: "Notifications muted",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-2 w-2 text-amber-600", "aria-hidden": true })
          }
        )
      ]
    }
  );
}
function ConnectedAccountAvatar({
  avatarUrl,
  displayName,
  muted = false,
  className = "",
  sizeClassName = "h-9 w-9",
  textClassName = "text-[11px]"
}) {
  const [failed, setFailed] = reactExports.useState(false);
  const url = (avatarUrl || "").trim();
  const initials = telegramStyleInitials(displayName);
  const showImg = Boolean(url) && !failed;
  reactExports.useEffect(() => {
    setFailed(false);
  }, [url]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${textClassName} ${sizeClassName} ${className}`,
      style: { backgroundColor: avatarTone(displayName) },
      title: muted ? `${displayName} · Notifications muted` : displayName,
      children: [
        showImg ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: url,
            alt: "",
            className: "h-full w-full object-cover",
            onError: () => setFailed(true)
          }
        ) : initials,
        muted && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "pointer-events-none absolute -left-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-1 ring-border/60",
            title: "Notifications muted",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-2 w-2 text-amber-600", "aria-hidden": true })
          }
        )
      ]
    }
  );
}
const CHANNELS = [
  { type: "telegram", label: "Telegram", icon: Send, color: "text-sky-400", available: true, description: "Connect a Telegram account to ingest messages." },
  { type: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-emerald-400", available: false, description: "Sync your WhatsApp conversations." },
  { type: "gmail", label: "Gmail", icon: Mail, color: "text-rose-400", available: false, description: "Get notified about important inbox messages." },
  { type: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-400", available: false, description: "Stay on top of LinkedIn DMs and mentions." },
  { type: "discord", label: "Discord", icon: Hash, color: "text-indigo-400", available: false, description: "Forward Discord pings and DMs." }
];
function channelFor(type) {
  return CHANNELS.find((c) => c.type === type) ?? CHANNELS[0];
}
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const Route$3 = createFileRoute("/dashboard/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Alert Hub" },
      { name: "description", content: "Chat with connected accounts in channel-specific layouts." }
    ]
  }),
  component: ChatPage
});
function TgsSticker({
  url,
  className
}) {
  const containerRef = reactExports.useRef(null);
  const [failed, setFailed] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let active = true;
    let animation = null;
    const load = async () => {
      try {
        const { default: lottie } = await import("../_libs/lottie-web.mjs").then(function(n) {
          return n.l;
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load sticker");
        const buf = await res.arrayBuffer();
        const jsonText = ungzip_1(new Uint8Array(buf), { to: "string" });
        const data = JSON.parse(jsonText);
        if (!active || !containerRef.current) return;
        animation = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data
        });
      } catch {
        if (active) setFailed(true);
      }
    };
    load();
    return () => {
      active = false;
      animation?.destroy();
    };
  }, [url]);
  if (failed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sticker, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Sticker" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: className || "h-40 w-40" });
}
const OUTBOX_KEY = "alerthub_chat_outbox_v1";
const DISMISSED_THREADS_KEY = "alerthub_chat_dismissed_threads_v1";
const CHAT_SELECTED_SENDER_KEY = "alerthub_chat_selected_sender_v1";
const CHAT_SELECTED_THREAD_KEY = "alerthub_chat_selected_thread_v1";
const CHAT_PINNED_MESSAGES_KEY = "alerthub_chat_pinned_messages_v1";
const CHAT_MUTED_THREADS_KEY = "alerthub_chat_muted_threads_v1";
const CHAT_PINNED_THREADS_ORDER_KEY = "alerthub_chat_pinned_threads_order_v1";
function msgTime(n) {
  return n.message_time || n.message_at || n.created_at || null;
}
function senderName(n) {
  return n.sender || n.sender_name || "Unknown sender";
}
function jstTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d);
}
function jstDayToken(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  const month = parts.find((p) => p.type === "month")?.value || "00";
  const day = parts.find((p) => p.type === "day")?.value || "00";
  return `${month}:${day}`;
}
function peerTypeOf(n) {
  if (!n) return "user";
  const s = `${n.sender || n.sender_name || ""}`.toLowerCase();
  const c = `${n.chat_name || ""}`.toLowerCase();
  if (!c || c === "direct message") return "user";
  if (s.includes("bot") || c.includes("bot")) return "bot";
  if (c.includes("channel") || c.startsWith("#")) return "channel";
  const cid = n.chat_id;
  if (cid != null && cid < 0 && c) return "group";
  return "user";
}
function buildThreadKey(n) {
  if (n.chat_id != null) return `chat:${n.chat_id}`;
  const sender = (n.sender_id || n.sender || n.sender_name || "").trim();
  return sender ? `sender:${sender}` : "sender:unknown";
}
function notificationMatchesThread(n, thread) {
  const accId = n.account_id ?? n.telegram_account_id;
  if (accId !== thread.accountId) return false;
  const threadId = `${thread.accountKey}::${buildThreadKey(n)}`;
  return threadId === thread.id;
}
function messageBody(n) {
  return n.message || n.message_text || "(no content)";
}
function messagePreview(text) {
  const lower = text.toLowerCase();
  if (lower.includes("sticker")) return "Sticker";
  const links = extractUrls(text);
  if (links.length === 0) return text;
  if (isGifLikeMedia(links[0], text)) return "GIF";
  const kind = mediaKindFromUrl(links[0]);
  if (kind === "sticker") return "Sticker";
  if (kind === "image") return "Image";
  if (kind === "video") return "Video";
  if (kind === "audio") return "Audio";
  return "File";
}
function safeLocalStorageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function errorMessage(err, fallback) {
  return err instanceof Error && err.message ? err.message : fallback;
}
function accountIdentity(a) {
  return a.username || String(a.id);
}
function classifyMessage(text) {
  const t = text.trim();
  if (!t) return "text";
  if (t.toLowerCase() === "sticker") return "sticker";
  if (t.toLowerCase() === "photo") return "image";
  if (t.toLowerCase().includes("video")) return "video";
  if (t.toLowerCase().includes("audio") || t.toLowerCase().includes("voice")) return "audio";
  if (t.toLowerCase().startsWith("file")) return "file";
  if (/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\s]+$/u.test(t)) return "emoji";
  return "text";
}
function extractUrls(text) {
  const matches = text.match(/https?:\/\/[^\s]+/gi);
  if (!matches) return [];
  return Array.from(new Set(matches));
}
function mediaKindFromUrl(url) {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(webp|tgs)$/.test(clean)) return "sticker";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(clean)) return "image";
  if (/\.(mp4|webm|mov|m4v)$/.test(clean)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(clean)) return "audio";
  return "file";
}
function isGifLikeMedia(url, text) {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.gif$/.test(clean)) return true;
  if (/\.(mp4|webm|mov|m4v)$/.test(clean) && /gif/.test(clean)) return true;
  if ((text || "").toLowerCase().includes("gif") && /\.(mp4|webm|mov|m4v)$/.test(clean)) return true;
  return false;
}
function isAnimatedStickerUrl(url) {
  return /\.tgs(\?|$)/i.test(url);
}
function ChatPage() {
  const [accounts, setAccounts] = reactExports.useState([]);
  const [notifications, setNotifications] = reactExports.useState([]);
  const [selectedThreadId, setSelectedThreadId] = reactExports.useState("");
  const [senderId, setSenderId] = reactExports.useState("");
  const [query, setQuery] = reactExports.useState("");
  const [draft, setDraft] = reactExports.useState("");
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [outgoing, setOutgoing] = reactExports.useState([]);
  const [dismissedThreadIds, setDismissedThreadIds] = reactExports.useState([]);
  const [pinnedMessageByThread, setPinnedMessageByThread] = reactExports.useState({});
  const [selectedMessageIds, setSelectedMessageIds] = reactExports.useState([]);
  const [replyToMessage, setReplyToMessage] = reactExports.useState(null);
  const [editingMessage, setEditingMessage] = reactExports.useState(null);
  const [contextMenu, setContextMenu] = reactExports.useState(null);
  const [deleteDialog, setDeleteDialog] = reactExports.useState(null);
  const [mutedThreadIds, setMutedThreadIds] = reactExports.useState([]);
  const [pinnedThreadOrder, setPinnedThreadOrder] = reactExports.useState([]);
  const [threadListMenu, setThreadListMenu] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [sending, setSending] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [mobileView, setMobileView] = reactExports.useState("list");
  const [mediaViewer, setMediaViewer] = reactExports.useState(null);
  const [isDraggingMedia, setIsDraggingMedia] = reactExports.useState(false);
  const messagesViewportRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const draftInputRef = reactExports.useRef(null);
  const dragStartRef = reactExports.useRef(null);
  const longPressTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setOutgoing(safeLocalStorageGet(OUTBOX_KEY, []));
    setDismissedThreadIds(safeLocalStorageGet(DISMISSED_THREADS_KEY, []));
    setPinnedMessageByThread(safeLocalStorageGet(CHAT_PINNED_MESSAGES_KEY, {}));
    setMutedThreadIds(safeLocalStorageGet(CHAT_MUTED_THREADS_KEY, []));
    setPinnedThreadOrder(safeLocalStorageGet(CHAT_PINNED_THREADS_ORDER_KEY, []));
    setSenderId(safeLocalStorageGet(CHAT_SELECTED_SENDER_KEY, ""));
    setSelectedThreadId(safeLocalStorageGet(CHAT_SELECTED_THREAD_KEY, ""));
  }, []);
  reactExports.useEffect(() => {
    api("/accounts").then((data) => {
      setAccounts(data);
      if (!senderId && data.length > 0) setSenderId(String(data[0].id));
    }).catch((e) => setError(e.message));
  }, [senderId]);
  reactExports.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api(
          "/notifications?page=1&page_size=250&include_outgoing=true&for_chat=true"
        );
        setNotifications(data.items || []);
        setError(null);
      } catch (e) {
        setError(errorMessage(e, "Failed to load chat messages"));
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = window.setInterval(load, 6e3);
    return () => window.clearInterval(id);
  }, []);
  reactExports.useEffect(() => {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(outgoing));
  }, [outgoing]);
  reactExports.useEffect(() => {
    localStorage.setItem(DISMISSED_THREADS_KEY, JSON.stringify(dismissedThreadIds));
  }, [dismissedThreadIds]);
  reactExports.useEffect(() => {
    localStorage.setItem(CHAT_PINNED_MESSAGES_KEY, JSON.stringify(pinnedMessageByThread));
  }, [pinnedMessageByThread]);
  reactExports.useEffect(() => {
    localStorage.setItem(CHAT_SELECTED_SENDER_KEY, JSON.stringify(senderId));
  }, [senderId]);
  reactExports.useEffect(() => {
    localStorage.setItem(CHAT_SELECTED_THREAD_KEY, JSON.stringify(selectedThreadId));
  }, [selectedThreadId]);
  reactExports.useEffect(() => {
    localStorage.setItem(CHAT_MUTED_THREADS_KEY, JSON.stringify(mutedThreadIds));
  }, [mutedThreadIds]);
  reactExports.useEffect(() => {
    localStorage.setItem(CHAT_PINNED_THREADS_ORDER_KEY, JSON.stringify(pinnedThreadOrder));
  }, [pinnedThreadOrder]);
  const sender = reactExports.useMemo(
    () => accounts.find((a) => String(a.id) === senderId),
    [accounts, senderId]
  );
  const threads = reactExports.useMemo(() => {
    if (!sender) return [];
    const grouped = /* @__PURE__ */ new Map();
    notifications.filter((n) => (n.account_id ?? n.telegram_account_id) === sender.id).forEach((n) => {
      const personName = senderName(n);
      const chatName = n.chat_name || "Direct message";
      const threadKey = buildThreadKey(n);
      const threadId = `${accountIdentity(sender)}::${threadKey}`;
      const existing = grouped.get(threadId);
      if (existing) {
        existing.items.push(n);
      } else {
        grouped.set(threadId, { items: [n], personName, chatName });
      }
    });
    outgoing.filter((m) => m.threadId.startsWith(`${accountIdentity(sender)}::`)).forEach((m) => {
      if (!grouped.has(m.threadId)) {
        grouped.set(m.threadId, {
          items: [],
          personName: m.personName || "Unknown",
          chatName: m.chatName || "Direct message"
        });
      }
    });
    return Array.from(grouped.entries()).map(([id, info]) => {
      const incomingLast = info.items.map((n) => msgTime(n)).filter((v) => !!v).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;
      const outLast = outgoing.filter((m) => m.threadId === id).map((m) => m.createdAt).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;
      const lastAt = [incomingLast, outLast].filter((v) => !!v).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;
      const latestIncoming = info.items.slice().sort(
        (a, b) => new Date(msgTime(b) || 0).getTime() - new Date(msgTime(a) || 0).getTime()
      )[0];
      const latestOut = outgoing.filter((m) => m.threadId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      const latestText = latestOut && (!latestIncoming || new Date(latestOut.createdAt) >= new Date(msgTime(latestIncoming) || 0)) ? `You: ${latestOut.text}` : latestIncoming ? messagePreview(messageBody(latestIncoming)) : "No messages yet";
      const rawUnread = info.items.filter((n) => !n.is_read).length;
      return {
        id,
        accountId: sender.id,
        accountKey: accountIdentity(sender),
        personName: info.personName,
        chatName: info.chatName,
        preview: latestText,
        unread: mutedThreadIds.includes(id) ? 0 : rawUnread,
        lastAt
      };
    }).filter((t) => !dismissedThreadIds.includes(t.id)).sort((a, b) => {
      const ia = pinnedThreadOrder.indexOf(a.id);
      const ib = pinnedThreadOrder.indexOf(b.id);
      const aPinned = ia >= 0;
      const bPinned = ib >= 0;
      if (aPinned && bPinned) return ia - ib;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return new Date(b.lastAt || 0).getTime() - new Date(a.lastAt || 0).getTime();
    });
  }, [dismissedThreadIds, mutedThreadIds, notifications, outgoing, pinnedThreadOrder, sender]);
  const filteredThreads = reactExports.useMemo(
    () => threads.filter(
      (t) => `${t.personName} ${t.chatName}`.toLowerCase().includes(query.toLowerCase())
    ),
    [threads, query]
  );
  const selectedThread = reactExports.useMemo(
    () => filteredThreads.find((t) => t.id === selectedThreadId) || filteredThreads[0],
    [filteredThreads, selectedThreadId]
  );
  reactExports.useEffect(() => {
    if (filteredThreads.length === 0) {
      setSelectedThreadId("");
      return;
    }
    const stillExists = filteredThreads.some((t) => t.id === selectedThreadId);
    if (!stillExists) setSelectedThreadId(filteredThreads[0].id);
  }, [filteredThreads, selectedThreadId]);
  reactExports.useEffect(() => {
    if (selectedThreadId) setMobileView("chat");
  }, [selectedThreadId]);
  reactExports.useEffect(() => {
    setReplyToMessage(null);
    setEditingMessage(null);
    setSelectedMessageIds([]);
    setContextMenu(null);
    setThreadListMenu(null);
  }, [selectedThread?.id]);
  reactExports.useEffect(() => {
    const onWindowClick = () => {
      setContextMenu(null);
      setThreadListMenu(null);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setContextMenu(null);
        setThreadListMenu(null);
      }
    };
    window.addEventListener("click", onWindowClick);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);
  const canSend = !!sender && sender.status === "active";
  const selectedMessages = reactExports.useMemo(() => {
    if (!selectedThread) return [];
    const incoming = notifications.filter((n) => notificationMatchesThread(n, selectedThread)).map((n) => ({
      id: `in-${n.id}`,
      from: n.is_outgoing ? "me" : "them",
      text: messageBody(n),
      createdAt: msgTime(n),
      peerRead: !!n.peer_read,
      avatarUrl: n.sender_avatar_url || null,
      notificationId: Number(n.id),
      externalMessageId: n.external_message_id_int ?? null,
      replyToExternalMessageId: n.reply_to_external_message_id_int ?? null,
      editedAt: n.edited_at || null
    }));
    const out = outgoing.filter((m) => m.threadId === selectedThread.id).map((m) => ({
      id: `out-${m.id}`,
      from: "me",
      text: m.text,
      createdAt: m.createdAt,
      peerRead: false,
      avatarUrl: null,
      notificationId: null,
      externalMessageId: null,
      replyToExternalMessageId: null,
      editedAt: null
    }));
    return [...incoming, ...out].sort(
      (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
  }, [notifications, outgoing, selectedThread]);
  const selectedThreadChatId = reactExports.useMemo(() => {
    if (!selectedThread) return null;
    const match = notifications.find(
      (n) => notificationMatchesThread(n, selectedThread) && n.chat_id != null
    );
    return match?.chat_id ?? null;
  }, [notifications, selectedThread]);
  const selectedThreadType = reactExports.useMemo(() => {
    if (!selectedThread) return "user";
    const inThread = notifications.filter((n) => notificationMatchesThread(n, selectedThread));
    const incoming = inThread.find((n) => !n.is_outgoing);
    return peerTypeOf(incoming ?? inThread[0]);
  }, [notifications, selectedThread]);
  const mediaGallery = reactExports.useMemo(() => {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const m of selectedMessages) {
      const links = extractUrls(m.text);
      for (const link of links) {
        const kind = mediaKindFromUrl(link);
        if (kind !== "image" && kind !== "video" && kind !== "sticker") continue;
        const key = `${kind}:${link}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ url: link, kind });
      }
    }
    return out;
  }, [selectedMessages]);
  const selectedMessagesByExternalId = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const message of selectedMessages) {
      if (message.externalMessageId != null) {
        map.set(message.externalMessageId, message);
      }
    }
    return map;
  }, [selectedMessages]);
  const openMediaViewer = (url, kind) => {
    const idx = mediaGallery.findIndex((m) => m.url === url && m.kind === kind);
    setMediaViewer({
      items: mediaGallery,
      index: idx >= 0 ? idx : 0,
      scale: 1,
      offsetX: 0,
      offsetY: 0
    });
  };
  reactExports.useEffect(() => {
    if (!mediaViewer) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMediaViewer(null);
        return;
      }
      if (e.key === "ArrowRight" && mediaViewer.items.length > 0) {
        setMediaViewer((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            index: (prev.index + 1) % prev.items.length,
            scale: 1,
            offsetX: 0,
            offsetY: 0
          };
        });
      }
      if (e.key === "ArrowLeft" && mediaViewer.items.length > 0) {
        setMediaViewer((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            index: (prev.index - 1 + prev.items.length) % prev.items.length,
            scale: 1,
            offsetX: 0,
            offsetY: 0
          };
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mediaViewer]);
  reactExports.useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = viewport.scrollHeight;
  }, [selectedThreadId, selectedMessages.length]);
  const markSelectedAsRead = async (silent = false) => {
    if (!selectedThread) return;
    const unread = notifications.filter(
      (n) => notificationMatchesThread(n, selectedThread) && !n.is_read
    );
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => api(`/notifications/${n.id}/read`, { method: "POST" })));
      if (sender?.type === "telegram") {
        await api("/telegram/messages/read", {
          method: "POST",
          body: JSON.stringify({
            account_id: selectedThread.accountId,
            chat_id: selectedThreadChatId,
            peer: selectedThread.personName
          })
        });
      }
      setNotifications(
        (prev) => prev.map((n) => unread.some((u) => u.id === n.id) ? { ...n, is_read: true } : n)
      );
      if (!silent) toast.success("Marked as read");
    } catch (e) {
      if (!silent) toast.error(errorMessage(e, "Failed to mark read"));
    }
  };
  reactExports.useEffect(() => {
    if (!selectedThread) return;
    void markSelectedAsRead(true);
  }, [selectedThread?.id, notifications, sender?.type]);
  const clearThreadHistory = () => {
    if (!selectedThread) return;
    setOutgoing((prev) => prev.filter((m) => m.threadId !== selectedThread.id));
    toast("Sent message history cleared for this thread");
  };
  const dismissThread = () => {
    if (!selectedThread) return;
    setDismissedThreadIds((prev) => Array.from(/* @__PURE__ */ new Set([...prev, selectedThread.id])));
    toast("Thread removed from chat list");
  };
  const pinThreadToTop = (thread) => {
    setPinnedThreadOrder((prev) => {
      const rest = prev.filter((id) => id !== thread.id);
      return [thread.id, ...rest];
    });
    toast.success("Pinned to top");
  };
  const unpinThreadFromTop = (thread) => {
    setPinnedThreadOrder((prev) => prev.filter((id) => id !== thread.id));
    toast.success("Unpinned from top");
  };
  const deleteChatThread = (thread) => {
    setDismissedThreadIds((prev) => Array.from(/* @__PURE__ */ new Set([...prev, thread.id])));
    setOutgoing((prev) => prev.filter((m) => m.threadId !== thread.id));
    setPinnedThreadOrder((prev) => prev.filter((id) => id !== thread.id));
    setMutedThreadIds((prev) => prev.filter((id) => id !== thread.id));
    setPinnedMessageByThread((prev) => {
      const next = { ...prev };
      delete next[thread.id];
      return next;
    });
    toast.success("Chat deleted");
  };
  const toggleMuteThread = (thread) => {
    const muted = mutedThreadIds.includes(thread.id);
    setMutedThreadIds(
      (prev) => muted ? prev.filter((id) => id !== thread.id) : [...prev, thread.id]
    );
    toast.success(muted ? "Chat unmuted" : "Chat muted");
  };
  const selectMessage = (messageId) => {
    setSelectedMessageIds(
      (prev) => prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId]
    );
  };
  const selectionMode = selectedMessageIds.length > 0;
  const clearLongPress = () => {
    if (longPressTimerRef.current != null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  const copyMessage = async (msg) => {
    try {
      await navigator.clipboard.writeText(msg.text);
      toast.success("Message copied");
    } catch {
      toast.error("Failed to copy message");
    }
  };
  const downloadMessage = (msg) => {
    const firstUrl = extractUrls(msg.text)[0];
    if (firstUrl) {
      const link2 = document.createElement("a");
      link2.href = firstUrl;
      link2.target = "_blank";
      link2.rel = "noreferrer";
      link2.download = "";
      link2.click();
      return;
    }
    const blob = new Blob([msg.text], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `message-${msg.id}.txt`;
    link.click();
    URL.revokeObjectURL(href);
  };
  const pinMessage = async (msg) => {
    if (!selectedThread || !sender) return;
    if (sender.type === "telegram" && msg.externalMessageId != null) {
      try {
        await api("/telegram/messages/pin", {
          method: "POST",
          body: JSON.stringify({
            account_id: selectedThread.accountId,
            chat_id: selectedThreadChatId,
            peer: selectedThread.personName,
            message_id: msg.externalMessageId
          })
        });
      } catch (e) {
        toast.error(errorMessage(e, "Failed to pin message"));
        return;
      }
    }
    setPinnedMessageByThread((prev) => ({ ...prev, [selectedThread.id]: msg.id }));
    toast.success("Message pinned");
  };
  const deleteMessage = async (msg, revoke = true) => {
    if (!selectedThread || !sender) return;
    try {
      if (sender.type === "telegram" && msg.externalMessageId != null) {
        await api("/telegram/messages/delete", {
          method: "POST",
          body: JSON.stringify({
            account_id: selectedThread.accountId,
            chat_id: selectedThreadChatId,
            peer: selectedThread.personName,
            message_id: msg.externalMessageId,
            revoke
          })
        });
      }
      if (msg.notificationId != null) {
        await api("/notifications/delete-selected", {
          method: "POST",
          body: JSON.stringify({ ids: [msg.notificationId] })
        });
      } else if (msg.id.startsWith("out-")) {
        const outId = msg.id.replace("out-", "");
        setOutgoing((prev) => prev.filter((item) => item.id !== outId));
      }
      setNotifications((prev) => prev.filter((n) => Number(n.id) !== msg.notificationId));
      setSelectedMessageIds((prev) => prev.filter((id) => id !== msg.id));
      toast.success("Message deleted");
    } catch (e) {
      toast.error(errorMessage(e, "Failed to delete message"));
    }
  };
  const beginEditMessage = (msg) => {
    if (msg.from !== "me") {
      toast.error("Only your messages can be edited");
      return;
    }
    if (msg.externalMessageId == null) {
      toast.error("Message is not synced yet");
      return;
    }
    setEditingMessage(msg);
    setReplyToMessage(null);
    setDraft(msg.text);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "grid h-full min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-none border-y border-border bg-card shadow-sm md:rounded-none md:border-x-0",
      onContextMenu: (e) => {
        const el = e.target;
        if (el.closest("[data-chat-custom-context='true']")) return;
        if (el.closest("input, textarea, [contenteditable='true']")) return;
        e.preventDefault();
      },
      children: [
        mediaViewer && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4",
            onContextMenu: (e) => e.preventDefault(),
            onClick: () => setMediaViewer(null),
            onWheel: (e) => {
              const current = mediaViewer.items[mediaViewer.index];
              if (!current || current.kind !== "image" && current.kind !== "sticker") return;
              e.preventDefault();
              const delta = e.deltaY > 0 ? -0.1 : 0.1;
              setMediaViewer((prev) => {
                if (!prev) return prev;
                const nextScale = Math.min(4, Math.max(1, Number((prev.scale + delta).toFixed(2))));
                return { ...prev, scale: nextScale };
              });
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute right-4 top-4 rounded-md bg-black/40 px-2 py-1 text-sm text-white",
                  onClick: () => setMediaViewer(null),
                  children: "Close"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "max-h-[92vh] max-w-[92vw] select-none",
                  onClick: (e) => e.stopPropagation(),
                  onMouseMove: (e) => {
                    if (!isDraggingMedia || !dragStartRef.current) return;
                    const dx = e.clientX - dragStartRef.current.x;
                    const dy = e.clientY - dragStartRef.current.y;
                    setMediaViewer(
                      (prev) => prev ? {
                        ...prev,
                        offsetX: dragStartRef.current.ox + dx,
                        offsetY: dragStartRef.current.oy + dy
                      } : prev
                    );
                  },
                  onMouseUp: () => {
                    setIsDraggingMedia(false);
                    dragStartRef.current = null;
                  },
                  onMouseLeave: () => {
                    setIsDraggingMedia(false);
                    dragStartRef.current = null;
                  },
                  children: [
                    (mediaViewer.items[mediaViewer.index]?.kind === "image" || mediaViewer.items[mediaViewer.index]?.kind === "sticker") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: mediaViewer.items[mediaViewer.index].url,
                        alt: "Preview",
                        className: "max-h-[92vh] max-w-[92vw] cursor-grab object-contain",
                        style: {
                          transform: `translate(${mediaViewer.offsetX}px, ${mediaViewer.offsetY}px) scale(${mediaViewer.scale})`,
                          transformOrigin: "center center"
                        },
                        onMouseDown: (e) => {
                          if (mediaViewer.scale <= 1) return;
                          setIsDraggingMedia(true);
                          dragStartRef.current = {
                            x: e.clientX,
                            y: e.clientY,
                            ox: mediaViewer.offsetX,
                            oy: mediaViewer.offsetY
                          };
                        }
                      }
                    ),
                    mediaViewer.items[mediaViewer.index]?.kind === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "video",
                      {
                        src: mediaViewer.items[mediaViewer.index].url,
                        controls: true,
                        autoPlay: true,
                        className: "max-h-[92vh] max-w-[92vw] rounded-lg object-contain"
                      }
                    ),
                    mediaViewer.items.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs text-white", children: [
                      mediaViewer.index + 1,
                      " / ",
                      mediaViewer.items.length
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-background px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          accounts.map((a) => {
            const ch = channelFor(a.type);
            const Icon = ch.icon;
            const active = String(a.id) === senderId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setSenderId(String(a.id)),
                className: `flex items-center gap-2 rounded-md border px-3 py-1.5 transition-colors ${active ? "border-primary/40 bg-primary/10" : "border-border bg-muted/20 hover:bg-muted/40"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `relative flex h-7 w-7 items-center justify-center ${ch.color}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AccountAvatar, { account: a, sizeClassName: "h-7 w-7" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pointer-events-none absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-1 ring-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-2.5 w-2.5" }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: accountDisplayName$1(a) })
                ]
              },
              a.id
            );
          }),
          accounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "No connected accounts." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-h-0 grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "aside",
            {
              className: `min-h-0 border-r border-border bg-muted/20 ${mobileView === "chat" ? "hidden md:flex md:flex-col" : "flex flex-col"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => toast("Unread filter selected"), children: "Unread chats" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => toast("Muted filter selected"), children: "Muted chats" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => toast("Chat settings opened"), children: "Chat settings" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        className: "pl-8",
                        placeholder: "Search people or chats",
                        value: query,
                        onChange: (e) => setQuery(e.target.value)
                      }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-500/40 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400/55 [&::-webkit-scrollbar-track]:bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md p-2 text-xs text-destructive", children: error }),
                  filteredThreads.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md p-4 text-sm text-muted-foreground", children: "No chat people found for this account." }),
                  filteredThreads.map((thread) => {
                    const active = thread.id === selectedThread?.id;
                    const avatarName = thread.personName || thread.chatName;
                    const isPinned = pinnedThreadOrder.includes(thread.id);
                    const isMuted = mutedThreadIds.includes(thread.id);
                    const threadAvatar = notifications.find(
                      (n) => notificationMatchesThread(n, thread) && !!n.sender_avatar_url
                    )?.sender_avatar_url;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        "data-chat-custom-context": "true",
                        onClick: () => {
                          setSelectedThreadId(thread.id);
                          setMobileView("chat");
                        },
                        onContextMenu: (e) => {
                          e.preventDefault();
                          setThreadListMenu({ x: e.clientX, y: e.clientY, thread });
                        },
                        className: `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${active ? "bg-accent" : "hover:bg-accent/60"} ${isMuted ? "opacity-80" : ""}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "relative flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold text-white",
                              style: { backgroundColor: avatarTone(avatarName) },
                              children: [
                                threadAvatar ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "img",
                                  {
                                    src: threadAvatar,
                                    alt: avatarName,
                                    className: "h-full w-full rounded-full object-cover"
                                  }
                                ) : telegramStyleInitials(avatarName),
                                isMuted && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-1 ring-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-2.5 w-2.5 text-muted-foreground" }) })
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-medium", children: [
                              isPinned && /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "mr-1 inline-block h-3.5 w-3.5 shrink-0 align-text-bottom text-primary" }),
                              thread.personName,
                              thread.unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary", children: thread.unread })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: thread.preview })
                          ] })
                        ]
                      },
                      thread.id
                    );
                  })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex h-full min-h-0 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(40,120,180,0.04),transparent)] ${mobileView === "list" ? "hidden md:flex" : "flex"}`,
              children: [
                !selectedThread && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center p-8 text-sm text-muted-foreground", children: "Select a person from the left list to start chatting." }),
                selectedThread && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "md:hidden",
                          onClick: () => setMobileView("list"),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "relative flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white",
                          style: { backgroundColor: avatarTone(selectedThread.personName) },
                          children: (() => {
                            const avatarFromNotif = notifications.find(
                              (n) => notificationMatchesThread(n, selectedThread) && !!n.sender_avatar_url
                            )?.sender_avatar_url;
                            return avatarFromNotif ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: avatarFromNotif,
                                alt: selectedThread.personName,
                                className: "h-full w-full rounded-full object-cover"
                              }
                            ) : telegramStyleInitials(selectedThread.personName);
                          })()
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: selectionMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold", children: [
                        selectedMessageIds.length,
                        " selected"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: selectedThread.personName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedThreadType })
                      ] }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: selectionMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          onClick: () => setSelectedMessageIds([]),
                          title: "Cancel selection",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "ghost",
                          size: "icon",
                          className: "text-destructive",
                          title: "Delete selected",
                          onClick: async () => {
                            const targets = selectedMessages.filter(
                              (m) => selectedMessageIds.includes(m.id)
                            );
                            for (const msg of targets) {
                              await deleteMessage(msg, true);
                            }
                            setSelectedMessageIds([]);
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                        }
                      )
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => void markSelectedAsRead(), children: "Mark as read" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => toast("Pinned chats are coming soon"), children: "Pin chat" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: clearThreadHistory, children: "Clear sent history" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: dismissThread, className: "text-destructive", children: "Hide chat" })
                        ] })
                      ] })
                    ] }) })
                  ] }),
                  pinnedMessageByThread[selectedThread.id] && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border bg-amber-50/60 px-4 py-2 text-xs dark:bg-amber-900/10", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Pinned:" }),
                    " ",
                    selectedMessages.find((m) => m.id === pinnedMessageByThread[selectedThread.id])?.text || "Message"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      ref: messagesViewportRef,
                      className: "h-full min-h-0 overflow-y-auto p-4 [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-500/40 [&::-webkit-scrollbar-thumb:hover]:bg-slate-400/55 [&::-webkit-scrollbar-track]:bg-transparent",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-full flex-col justify-end gap-2 pb-4", children: [
                        selectedMessages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md p-3 text-sm text-muted-foreground", children: "No messages in this conversation yet." }),
                        (() => {
                          let lastDay = "";
                          return selectedMessages.map((m) => {
                            const repliedMessage = m.replyToExternalMessageId != null ? selectedMessagesByExternalId.get(m.replyToExternalMessageId) || null : null;
                            const dayToken = jstDayToken(m.createdAt);
                            const showDay = !!dayToken && dayToken !== lastDay;
                            if (showDay) lastDay = dayToken;
                            const links = extractUrls(m.text);
                            const primaryMediaKind = links.length > 0 ? mediaKindFromUrl(links[0]) : null;
                            const textWithoutUrls = m.text.replace(/https?:\/\/[^\s]+/gi, "").trim();
                            const isGenericMediaLabel = /^(photo|image|video file|video note|audio file|voice message|file|media message|sticker|gif)$/i.test(
                              textWithoutUrls
                            );
                            const hasCaption = textWithoutUrls.length > 0 && !isGenericMediaLabel;
                            const isMediaBubble = links.length > 0;
                            const isMediaOnly = isMediaBubble && !hasCaption;
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
                              showDay && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-border/70 bg-background/90 px-3 py-1 text-[10px] font-medium tracking-wide text-muted-foreground shadow-sm backdrop-blur", children: dayToken }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.from === "me" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  className: `flex items-end gap-2 ${m.from === "me" ? "flex-row-reverse" : "flex-row"}`,
                                  children: [
                                    selectionMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        className: "mb-1 shrink-0 text-primary",
                                        onClick: () => selectMessage(m.id),
                                        "aria-label": "Toggle message selection",
                                        children: selectedMessageIds.includes(m.id) ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-5 w-5 text-muted-foreground" })
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "div",
                                      {
                                        className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                                        style: {
                                          backgroundColor: avatarTone(
                                            m.from === "me" ? "You" : selectedThread.personName
                                          )
                                        },
                                        children: m.from === "me" ? sender ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          AccountAvatar,
                                          {
                                            account: sender,
                                            sizeClassName: "h-7 w-7",
                                            textClassName: "text-[10px]"
                                          }
                                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-full w-full items-center justify-center rounded-full bg-[#229ED9] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { className: "h-3.5 w-3.5" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          ConnectedAccountAvatar,
                                          {
                                            avatarUrl: m.avatarUrl,
                                            displayName: selectedThread.personName,
                                            sizeClassName: "h-7 w-7",
                                            textClassName: "text-[10px]"
                                          }
                                        )
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        "data-chat-custom-context": "true",
                                        className: `max-w-[70%] rounded-2xl text-sm shadow-sm ${isMediaOnly ? "overflow-hidden p-0" : "px-3 py-2"} ${isMediaBubble ? "relative" : ""} ${selectedMessageIds.includes(m.id) ? "ring-2 ring-primary/60" : ""} ${m.from === "me" ? `rounded-br-md ${isMediaOnly ? "bg-transparent text-white shadow-none" : "bg-sky-500 text-white"}` : `rounded-bl-md ${isMediaOnly ? "bg-transparent text-foreground shadow-none" : "border border-border/80 bg-background/95 text-foreground"}`}`,
                                        onContextMenu: (e) => {
                                          e.preventDefault();
                                          setContextMenu({
                                            x: e.clientX,
                                            y: e.clientY,
                                            message: m
                                          });
                                        },
                                        onClick: () => {
                                          if (selectionMode) selectMessage(m.id);
                                        },
                                        onTouchStart: () => {
                                          clearLongPress();
                                          longPressTimerRef.current = window.setTimeout(() => {
                                            selectMessage(m.id);
                                          }, 450);
                                        },
                                        onTouchEnd: clearLongPress,
                                        onTouchMove: clearLongPress,
                                        onTouchCancel: clearLongPress,
                                        children: [
                                          (() => {
                                            const kind = classifyMessage(m.text);
                                            if (links.length > 0) {
                                              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: hasCaption ? "space-y-2" : "", children: [
                                                repliedMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "div",
                                                  {
                                                    className: `mx-1 mt-1 rounded-md border-l-2 px-2 py-1 text-xs ${m.from === "me" ? "border-white/70 bg-white/15 text-white/90" : "border-primary/70 bg-primary/10 text-foreground"}`,
                                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2", children: repliedMessage.text || "(original message)" })
                                                  }
                                                ),
                                                links.map((link) => {
                                                  const gifLike = isGifLikeMedia(link, m.text);
                                                  if (gifLike) {
                                                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "video",
                                                      {
                                                        src: link,
                                                        autoPlay: true,
                                                        loop: true,
                                                        muted: true,
                                                        playsInline: true,
                                                        controls: true,
                                                        className: "max-h-80 w-full rounded-lg"
                                                      }
                                                    ) }, link);
                                                  }
                                                  const mediaKind = mediaKindFromUrl(link);
                                                  if (mediaKind === "sticker") {
                                                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: isAnimatedStickerUrl(link) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-background/20 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TgsSticker, { url: link, className: "h-40 w-40" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "button",
                                                      {
                                                        type: "button",
                                                        onClick: (e) => {
                                                          if (selectionMode) {
                                                            e.preventDefault();
                                                            selectMessage(m.id);
                                                            return;
                                                          }
                                                          openMediaViewer(link, "sticker");
                                                        },
                                                        className: "block",
                                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "img",
                                                          {
                                                            src: link,
                                                            alt: "Sticker",
                                                            className: "max-h-64 w-auto rounded-lg object-contain",
                                                            onError: (e) => {
                                                              const el = e.currentTarget;
                                                              el.style.display = "none";
                                                            }
                                                          }
                                                        )
                                                      }
                                                    ) }, link);
                                                  }
                                                  if (mediaKind === "image") {
                                                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "button",
                                                      {
                                                        type: "button",
                                                        onClick: (e) => {
                                                          if (selectionMode) {
                                                            e.preventDefault();
                                                            selectMessage(m.id);
                                                            return;
                                                          }
                                                          openMediaViewer(link, "image");
                                                        },
                                                        className: "block",
                                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "img",
                                                          {
                                                            src: link,
                                                            alt: "Shared media",
                                                            className: "max-h-80 w-full rounded-lg object-cover"
                                                          }
                                                        )
                                                      }
                                                    ) }, link);
                                                  }
                                                  if (mediaKind === "video") {
                                                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "button",
                                                      {
                                                        type: "button",
                                                        onClick: (e) => {
                                                          if (selectionMode) {
                                                            e.preventDefault();
                                                            selectMessage(m.id);
                                                            return;
                                                          }
                                                          openMediaViewer(link, "video");
                                                        },
                                                        className: "block w-full",
                                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "video",
                                                          {
                                                            src: link,
                                                            muted: true,
                                                            playsInline: true,
                                                            className: "max-h-80 w-full rounded-lg"
                                                          }
                                                        )
                                                      }
                                                    ) }, link);
                                                  }
                                                  if (mediaKind === "audio") {
                                                    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: link, controls: true, className: "w-full" }) }, link);
                                                  }
                                                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "a",
                                                      {
                                                        href: link,
                                                        target: "_blank",
                                                        rel: "noreferrer",
                                                        className: `break-all text-xs underline ${m.from === "me" ? "text-white/90" : "text-primary"}`,
                                                        onClick: (e) => {
                                                          if (selectionMode) {
                                                            e.preventDefault();
                                                            selectMessage(m.id);
                                                          }
                                                        },
                                                        children: "Download file"
                                                      }
                                                    )
                                                  ] }, link);
                                                }),
                                                hasCaption && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 pb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: textWithoutUrls }) })
                                              ] });
                                            }
                                            if (kind === "emoji")
                                              return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl leading-8", children: m.text });
                                            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                                              repliedMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "div",
                                                {
                                                  className: `rounded-md border-l-2 px-2 py-1 text-xs ${m.from === "me" ? "border-white/70 bg-white/15 text-white/90" : "border-primary/70 bg-primary/10 text-foreground"}`,
                                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-2", children: repliedMessage.text || "(original message)" })
                                                }
                                              ),
                                              kind === "sticker" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Sticker, { className: "h-4 w-4" }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sticker" })
                                              ] }) : kind === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4" }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Photo" })
                                              ] }) : kind === "video" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-4 w-4" }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.text })
                                              ] }) : kind === "audio" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "h-4 w-4" }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.text })
                                              ] }) : kind === "file" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.text })
                                              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: m.text })
                                            ] });
                                          })(),
                                          m.createdAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className: `${isMediaBubble && (primaryMediaKind === "image" || primaryMediaKind === "video") ? "absolute bottom-2 right-2 rounded-md bg-black/45 px-1.5 py-0.5" : "mt-1 flex items-center justify-end"} flex items-center gap-1 text-[11px] ${m.from === "me" ? "text-white/85" : "text-muted-foreground"}`,
                                              children: [
                                                m.editedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "(edited)" }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: jstTime(m.createdAt) }),
                                                m.from === "me" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center", children: m.peerRead ? /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) })
                                              ]
                                            }
                                          )
                                        ]
                                      }
                                    )
                                  ]
                                }
                              ) })
                            ] }, m.id);
                          });
                        })()
                      ] })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-border bg-background p-3", children: [
                    replyToMessage && !editingMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between rounded-md border border-border/70 bg-muted/40 px-3 py-1.5 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                        "Replying to: ",
                        replyToMessage.text.slice(0, 120)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setReplyToMessage(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
                    ] }),
                    editingMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between rounded-md border border-border/70 bg-muted/40 px-3 py-1.5 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Editing message" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            setEditingMessage(null);
                            setDraft("");
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                        }
                      )
                    ] }),
                    selectionMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between rounded-md border border-border/70 bg-muted/40 px-3 py-1.5 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        selectedMessageIds.length,
                        " selected"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "text-muted-foreground",
                            onClick: () => setSelectedMessageIds([]),
                            children: "Cancel"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "text-destructive",
                            onClick: async () => {
                              const targets = selectedMessages.filter(
                                (m) => selectedMessageIds.includes(m.id)
                              );
                              for (const msg of targets) {
                                await deleteMessage(msg, true);
                              }
                              setSelectedMessageIds([]);
                            },
                            children: "Delete selected"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "form",
                      {
                        onSubmit: async (e) => {
                          e.preventDefault();
                          if (!selectedThread || !canSend || sending) return;
                          if (!draft.trim() && !selectedFile) return;
                          const text = draft.trim();
                          if (editingMessage) {
                            if (!editingMessage.externalMessageId) {
                              toast.error("Message cannot be edited");
                              return;
                            }
                            setSending(true);
                            try {
                              await api("/telegram/messages/edit", {
                                method: "POST",
                                body: JSON.stringify({
                                  account_id: selectedThread.accountId,
                                  chat_id: selectedThreadChatId,
                                  peer: selectedThread.personName,
                                  message_id: editingMessage.externalMessageId,
                                  message_text: text
                                })
                              });
                              setNotifications(
                                (prev) => prev.map(
                                  (n) => Number(n.id) === editingMessage.notificationId ? {
                                    ...n,
                                    message: text,
                                    message_text: text,
                                    edited_at: (/* @__PURE__ */ new Date()).toISOString()
                                  } : n
                                )
                              );
                              setDraft("");
                              setEditingMessage(null);
                              toast.success("Message edited");
                            } catch (err) {
                              toast.error(errorMessage(err, "Failed to edit message"));
                            } finally {
                              setSending(false);
                            }
                            return;
                          }
                          const tempId = `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
                          setSending(true);
                          const sendText = text;
                          if (!selectedFile && text) {
                            setOutgoing((prev) => [
                              ...prev,
                              {
                                id: tempId,
                                threadId: selectedThread.id,
                                personName: selectedThread.personName,
                                chatName: selectedThread.chatName,
                                text,
                                createdAt: (/* @__PURE__ */ new Date()).toISOString()
                              }
                            ]);
                          }
                          setDraft("");
                          try {
                            if (selectedFile) {
                              const fd = new FormData();
                              fd.append("account_id", String(selectedThread.accountId));
                              if (selectedThreadChatId != null) fd.append("chat_id", String(selectedThreadChatId));
                              fd.append("peer", selectedThread.personName);
                              if (text) fd.append("caption", text);
                              fd.append("media", selectedFile);
                              await api("/telegram/messages/send-media", {
                                method: "POST",
                                body: fd
                              });
                            } else {
                              await api("/telegram/messages/send", {
                                method: "POST",
                                body: JSON.stringify({
                                  account_id: selectedThread.accountId,
                                  chat_id: selectedThreadChatId,
                                  peer: selectedThread.personName,
                                  message_text: sendText,
                                  reply_to_message_id: replyToMessage?.externalMessageId ?? null
                                })
                              });
                            }
                            setOutgoing((prev) => prev.filter((m) => m.id !== tempId));
                            setReplyToMessage(null);
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                            const data = await api(
                              "/notifications?page=1&page_size=250&include_outgoing=true&for_chat=true"
                            );
                            setNotifications(data.items || []);
                          } catch (e2) {
                            setOutgoing((prev) => prev.filter((m) => m.id !== tempId));
                            toast.error(errorMessage(e2, "Failed to send message"));
                          } finally {
                            setSending(false);
                          }
                        },
                        className: "flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              ref: fileInputRef,
                              type: "file",
                              className: "hidden",
                              onChange: (e) => setSelectedFile(e.target.files?.[0] || null)
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              type: "button",
                              variant: "ghost",
                              size: "icon",
                              onClick: () => fileInputRef.current?.click(),
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4" })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              ref: draftInputRef,
                              value: draft,
                              onChange: (e) => setDraft(e.target.value),
                              placeholder: canSend ? `Message ${selectedThread.personName}...` : "Reconnect this account to send messages",
                              className: "rounded-full",
                              disabled: !canSend || sending
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              type: "submit",
                              disabled: !draft.trim() && !selectedFile || !canSend || sending,
                              className: "rounded-full",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { className: "h-4 w-4" })
                            }
                          )
                        ]
                      }
                    ),
                    selectedFile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between rounded-md border border-border/70 bg-muted/30 px-3 py-1.5 text-xs", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                        "Attached: ",
                        selectedFile.name
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "text-muted-foreground hover:text-foreground",
                          onClick: () => {
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          },
                          children: "Remove"
                        }
                      )
                    ] })
                  ] })
                ] })
              ]
            }
          )
        ] }),
        contextMenu && typeof document !== "undefined" && reactDomExports.createPortal(
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "fixed z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-sm shadow-lg",
              style: { left: contextMenu.x, top: contextMenu.y },
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      setReplyToMessage(contextMenu.message);
                      setEditingMessage(null);
                      setContextMenu(null);
                      window.setTimeout(() => draftInputRef.current?.focus(), 0);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-4 w-4" }),
                      " Reply"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      void copyMessage(contextMenu.message);
                      setContextMenu(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }),
                      " Copy"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      void pinMessage(contextMenu.message);
                      setContextMenu(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-4 w-4" }),
                      " Pin"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      downloadMessage(contextMenu.message);
                      setContextMenu(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
                      " Download"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      selectMessage(contextMenu.message.id);
                      setContextMenu(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4" }),
                      " Select"
                    ]
                  }
                ),
                contextMenu.message.from === "me" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      beginEditMessage(contextMenu.message);
                      setContextMenu(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }),
                      " Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-destructive hover:bg-accent",
                    onClick: () => {
                      setDeleteDialog({
                        message: contextMenu.message,
                        alsoDeleteForPeer: true
                      });
                      setContextMenu(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                      " Delete"
                    ]
                  }
                )
              ]
            }
          ),
          document.body
        ),
        threadListMenu && typeof document !== "undefined" && reactDomExports.createPortal(
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "fixed z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-sm shadow-lg",
              style: { left: threadListMenu.x, top: threadListMenu.y },
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      const t = threadListMenu.thread;
                      setThreadListMenu(null);
                      toggleMuteThread(t);
                    },
                    children: mutedThreadIds.includes(threadListMenu.thread.id) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4" }),
                      " Unmute"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4" }),
                      " Mute"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-accent",
                    onClick: () => {
                      const t = threadListMenu.thread;
                      setThreadListMenu(null);
                      if (pinnedThreadOrder.includes(t.id)) unpinThreadFromTop(t);
                      else pinThreadToTop(t);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-4 w-4" }),
                      " ",
                      pinnedThreadOrder.includes(threadListMenu.thread.id) ? "Unpin from top" : "Pin to top"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-destructive hover:bg-accent",
                    onClick: () => {
                      const t = threadListMenu.thread;
                      setThreadListMenu(null);
                      deleteChatThread(t);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                      " Delete chat"
                    ]
                  }
                )
              ]
            }
          ),
          document.body
        ),
        deleteDialog && typeof document !== "undefined" && reactDomExports.createPortal(
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium", children: "Do you want to delete this message?" }),
            sender?.type === "telegram" && deleteDialog.message.externalMessageId != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mt-4 flex cursor-pointer items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: deleteDialog.alsoDeleteForPeer,
                  onChange: (e) => setDeleteDialog(
                    (prev) => prev ? { ...prev, alsoDeleteForPeer: e.target.checked } : prev
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Also delete for ",
                selectedThread?.personName || "recipient",
                "?"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center justify-end gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "text-muted-foreground",
                  onClick: () => setDeleteDialog(null),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "font-semibold text-cyan-600",
                  onClick: async () => {
                    const pending = deleteDialog;
                    setDeleteDialog(null);
                    await deleteMessage(
                      pending.message,
                      sender?.type === "telegram" && pending.message.externalMessageId != null ? pending.alsoDeleteForPeer : true
                    );
                  },
                  children: "Delete"
                }
              )
            ] })
          ] }) }),
          document.body
        )
      ]
    }
  );
}
const Dialog = Root;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const Route$2 = createFileRoute("/dashboard/account/")({
  head: () => ({
    meta: [
      { title: "Accounts — Alert Hub" },
      { name: "description", content: "Manage your connected message accounts." }
    ]
  }),
  component: AccountsPage
});
function accountDisplayName(a) {
  return a.display_name || a.label || a.username || "Unnamed account";
}
function StatusDot({ status }) {
  const map = {
    active: "bg-emerald-500 text-emerald-500 status-blink",
    disconnected: "bg-muted-foreground/40 text-muted-foreground/40",
    muted: "bg-amber-400 text-amber-400"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block h-2.5 w-2.5 rounded-full ${map[status]}`, "aria-label": status });
}
function statusLabel(s) {
  return s === "active" ? "Active" : s === "muted" ? "Notifications muted" : "Disconnected";
}
function AccountsPage() {
  const [accounts, setAccounts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [pickerOpen, setPickerOpen] = reactExports.useState(false);
  const navigate = useNavigate();
  const load = async () => {
    setLoading(true);
    try {
      const data = await api("/accounts");
      setAccounts(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const action = async (a, op, msg) => {
    try {
      await api(`/accounts/${a.id}/${op}`, { method: "POST" });
      toast.success(msg);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const remove = async (a) => {
    if (!confirm(`Remove "${accountDisplayName(a)}" permanently?`)) return;
    try {
      await api(`/accounts/${a.id}`, { method: "DELETE" });
      toast.success("Account removed");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };
  const pick = (type, available) => {
    setPickerOpen(false);
    if (!available) {
      toast("Coming Soon", { description: `${type} support is on the way.` });
      return;
    }
    if (type === "telegram") navigate({ to: "/account/connect/telegram" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Connected accounts" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage which message sources feed your Alert Hub." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setPickerOpen(true), className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add account"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-2", children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-sm text-muted-foreground", children: "Loading…" }),
        !loading && accounts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: [
          "No accounts yet. Click",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Add account" }),
          " to connect one."
        ] }),
        accounts.map((a) => {
          const ch = channelFor(a.type);
          const Icon = ch.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "group flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md animate-fade-in",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50 ${ch.color}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: accountDisplayName(a) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "· ",
                      ch.label
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { status: a.status }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: statusLabel(a.status) }),
                    a.phone_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "· ",
                      a.phone_number
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
                  a.status === "active" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        onClick: () => action(a, "mute", "Notifications muted"),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-4 w-4" }),
                          " Mute"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        onClick: () => action(a, "disconnect", "Account disconnected"),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-4 w-4" }),
                          " Disconnect"
                        ]
                      }
                    )
                  ] }),
                  a.status === "muted" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: () => action(a, "unmute", "Notifications enabled"),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
                        " Unmute"
                      ]
                    }
                  ),
                  a.status === "disconnected" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: () => action(a, "reconnect", "Reconnected"),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }),
                        " Reconnect"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "text-destructive hover:text-destructive",
                      onClick: () => remove(a),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                    }
                  )
                ] })
              ]
            },
            a.id
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: pickerOpen, onOpenChange: setPickerOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Connect a new account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Pick the channel you want to add." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3", children: CHANNELS.map((c) => {
        const Icon = c.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => pick(c.type, c.available),
            className: "group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/60 hover-lift",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50 ${c.color} transition-transform group-hover:scale-110`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: c.label }),
              !c.available && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground", children: "Coming Soon" })
            ]
          },
          c.type
        );
      }) })
    ] }) })
  ] });
}
const $$splitComponentImporter$1 = () => import("./account.connect.telegram-BQ9i3M-R.mjs");
const Route$1 = createFileRoute("/account/connect/telegram")({
  head: () => ({
    meta: [{
      title: "Connect Telegram — Alert Hub"
    }, {
      name: "description",
      content: "Connect a Telegram account to Alert Hub."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard.account.connect.telegram-BQ9i3M-R.mjs");
const Route = createFileRoute("/dashboard/account/connect/telegram")({
  head: () => ({
    meta: [{
      title: "Connect Telegram — Alert Hub"
    }, {
      name: "description",
      content: "Connect a Telegram account to Alert Hub."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SettingsRoute = Route$d.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$e
});
const NotificationsRoute = Route$c.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$e
});
const LoginRoute = Route$b.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$e
});
const DashboardRoute = Route$a.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$e
});
const ChatRoute = Route$9.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => Route$e
});
const AccountRoute = Route$8.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$e
});
const IndexRoute = Route$7.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$e
});
const DashboardIndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => DashboardRoute
});
const AccountIndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => AccountRoute
});
const DashboardSettingsRoute = Route$4.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => DashboardRoute
});
const DashboardChatRoute = Route$3.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => DashboardRoute
});
const DashboardAccountIndexRoute = Route$2.update({
  id: "/account/",
  path: "/account/",
  getParentRoute: () => DashboardRoute
});
const AccountConnectTelegramRoute = Route$1.update({
  id: "/connect/telegram",
  path: "/connect/telegram",
  getParentRoute: () => AccountRoute
});
const DashboardAccountConnectTelegramRoute = Route.update({
  id: "/account/connect/telegram",
  path: "/account/connect/telegram",
  getParentRoute: () => DashboardRoute
});
const AccountRouteChildren = {
  AccountIndexRoute,
  AccountConnectTelegramRoute
};
const AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
const DashboardRouteChildren = {
  DashboardChatRoute,
  DashboardSettingsRoute,
  DashboardIndexRoute,
  DashboardAccountIndexRoute,
  DashboardAccountConnectTelegramRoute
};
const DashboardRouteWithChildren = DashboardRoute._addFileChildren(
  DashboardRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AccountRoute: AccountRouteWithChildren,
  ChatRoute,
  DashboardRoute: DashboardRouteWithChildren,
  LoginRoute,
  NotificationsRoute,
  SettingsRoute
};
const routeTree = Route$e._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AccountsPage as A,
  Button as B,
  ChatPage as C,
  Input as I,
  Label as L,
  SettingsPage as S,
  api as a,
  buttonVariants as b,
  cn as c,
  channelFor as d,
  ConnectedAccountAvatar as e,
  router as r,
  telegramStyleInitials as t,
  useAuth as u
};
