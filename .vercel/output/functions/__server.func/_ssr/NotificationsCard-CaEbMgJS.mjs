import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { l as lottie } from "../_libs/lottie-web.mjs";
import { u as ungzip_1 } from "../_libs/pako.mjs";
import { a as api, I as Input, B as Button, d as channelFor, e as ConnectedAccountAvatar, c as cn } from "./router-BjMiERqV.mjs";
import { R as Root2, V as Value, T as Trigger, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label, f as Separator } from "../_libs/radix-ui__react-select.mjs";
import { f as Search, N as RefreshCw, T as Trash2, O as ListChecks, r as SquareCheckBig, X, n as CheckCheck, Q as ChevronsLeft, W as ChevronLeft, w as ChevronRight, Y as ChevronsRight, Z as Inbox, o as Check, _ as ChevronDown, $ as ChevronUp } from "../_libs/lucide-react.mjs";
const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
const PAGE_SIZE = 20;
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
  if (text.toLowerCase().includes("gif") && /\.(mp4|webm|mov|m4v)$/.test(clean)) return true;
  return false;
}
function isAnimatedStickerUrl(url) {
  return /\.tgs(\?|$)/i.test(url);
}
function TgsSticker({ url, className }) {
  const [failed, setFailed] = reactExports.useState(false);
  const [container, setContainer] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let active = true;
    let animation = null;
    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load sticker");
        const buf = await res.arrayBuffer();
        const jsonText = ungzip_1(new Uint8Array(buf), { to: "string" });
        const data = JSON.parse(jsonText);
        if (!active || !container) return;
        animation = lottie.loadAnimation({
          container,
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
  }, [container, url]);
  if (failed) return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Sticker" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: setContainer, className: className || "h-24 w-24" });
}
function NotificationsCard() {
  const [items, setItems] = reactExports.useState([]);
  const [total, setTotal] = reactExports.useState(0);
  const [page, setPage] = reactExports.useState(1);
  const [q, setQ] = reactExports.useState("");
  const [qDraft, setQDraft] = reactExports.useState("");
  const [readFilter, setReadFilter] = reactExports.useState("all");
  const [readDraft, setReadDraft] = reactExports.useState("all");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [accountLabels, setAccountLabels] = reactExports.useState({});
  const [linkedAccounts, setLinkedAccounts] = reactExports.useState([]);
  const [selectedIds, setSelectedIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const [selectMode, setSelectMode] = reactExports.useState(false);
  const load = reactExports.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (q) params.set("q", q);
      if (readFilter !== "all") params.set("is_read", readFilter === "read" ? "true" : "false");
      const data = await api(`/notifications?${params.toString()}`);
      const nextItems = data.items || [];
      setItems(nextItems);
      setTotal(data.total || 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, q, readFilter]);
  reactExports.useEffect(() => {
    load();
    const id = setInterval(load, 5e3);
    return () => clearInterval(id);
  }, [load]);
  reactExports.useEffect(() => {
    api("/accounts").then((accounts) => {
      setLinkedAccounts(accounts);
      const labels = {};
      accounts.forEach((a) => {
        labels[a.id] = a.display_name || a.label || a.username || `Account #${a.id}`;
      });
      setAccountLabels(labels);
    }).catch(() => {
    });
  }, []);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visiblePages = (() => {
    const windowSize = 3;
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();
  const markRead = async (id) => {
    try {
      await api(`/notifications/${id}/read`, { method: "POST" });
      setItems((xs) => xs.map((x) => x.id === id ? { ...x, is_read: true } : x));
    } catch (e) {
      setError(e.message);
    }
  };
  const apply = () => {
    setQ(qDraft);
    setReadFilter(readDraft);
    setPage(1);
  };
  const markAllRead = async () => {
    try {
      await api("/notifications/read-all", { method: "POST" });
      setItems((xs) => xs.map((x) => ({ ...x, is_read: true })));
    } catch (e) {
      setError(e.message);
    }
  };
  const toggleSelected = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectedCount = selectedIds.size;
  const allOnPageSelected = items.length > 0 && items.every((n) => selectedIds.has(n.id));
  const hasUnread = items.some((n) => !n.is_read);
  const selectAllMessages = async () => {
    try {
      const ids = /* @__PURE__ */ new Set();
      let nextPage = 1;
      let totalItems = 0;
      do {
        const params = new URLSearchParams({ page: String(nextPage), page_size: "100" });
        if (q) params.set("q", q);
        if (readFilter !== "all") params.set("is_read", readFilter === "read" ? "true" : "false");
        const data = await api(`/notifications?${params.toString()}`);
        (data.items || []).forEach((item) => ids.add(item.id));
        totalItems = data.total || 0;
        nextPage += 1;
      } while (ids.size < totalItems);
      setSelectedIds(ids);
    } catch (e) {
      setError(e.message);
    }
  };
  const toggleSelectAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        items.forEach((n) => next.delete(n.id));
      } else {
        items.forEach((n) => next.add(n.id));
      }
      return next;
    });
  };
  const deleteSelected = async () => {
    if (selectedCount === 0) return;
    const confirmed = window.confirm(`Remove ${selectedCount} selected message(s)?`);
    if (!confirmed) return;
    try {
      await api("/notifications/delete-selected", {
        method: "POST",
        body: JSON.stringify({ ids: Array.from(selectedIds).map((id) => Number(id)) })
      });
      setItems((xs) => xs.filter((x) => !selectedIds.has(x.id)));
      setTotal((x) => Math.max(0, x - selectedCount));
      setSelectedIds(/* @__PURE__ */ new Set());
      if (items.length === selectedCount && page > 1) setPage((p) => p - 1);
      setSelectMode(false);
    } catch (e) {
      setError(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-xl border border-border bg-card p-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search messages or senders...",
            value: qDraft,
            onChange: (e) => setQDraft(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && apply(),
            className: "pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full sm:w-44", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: readDraft, onValueChange: (v) => setReadDraft(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unread", children: "Unread" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "read", children: "Read" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: apply, children: "Apply" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-5 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        !selectMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground", children: "Feed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            loading && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 animate-spin" }),
            total,
            " total"
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          loading && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 animate-spin" }),
          total,
          " total"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          !selectMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "destructive",
              onClick: () => setSelectMode(true),
              disabled: items.length === 0,
              "aria-label": "Delete",
              title: "Delete",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "outline",
                className: "h-8 w-8",
                onClick: selectAllMessages,
                disabled: total === 0,
                "aria-label": "Select all messages",
                title: "Select all messages",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "outline",
                className: "h-8 w-8",
                onClick: toggleSelectAllOnPage,
                disabled: items.length === 0,
                "aria-label": allOnPageSelected ? "Unselect page" : "Select page",
                title: allOnPageSelected ? "Unselect page" : "Select page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "icon",
                variant: "destructive",
                className: "relative h-8 w-8",
                onClick: deleteSelected,
                disabled: selectedCount === 0,
                "aria-label": `Delete selected (${selectedCount})`,
                title: `Delete selected (${selectedCount})`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                  selectedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1 -top-1 min-w-4 rounded-full bg-background px-1 text-[10px] font-semibold text-foreground ring-1 ring-border", children: selectedCount })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "outline",
                className: "h-8 w-8",
                onClick: () => {
                  setSelectMode(false);
                  setSelectedIds(/* @__PURE__ */ new Set());
                },
                "aria-label": "Cancel selection",
                title: "Cancel selection",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          !selectMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: markAllRead,
              disabled: !hasUnread,
              "aria-label": "Mark all as read",
              title: "Mark all as read",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-4 w-4" })
            }
          ),
          total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-1 flex items-center gap-0.5 rounded-full border border-border/70 bg-background/80 p-1 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-6 w-6 rounded-full",
                disabled: page <= 1,
                onClick: () => setPage(1),
                "aria-label": "First page",
                title: "First page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsLeft, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-6 w-6 rounded-full",
                disabled: page <= 1,
                onClick: () => setPage((p) => p - 1),
                "aria-label": "Previous page",
                title: "Previous page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" })
              }
            ),
            visiblePages.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: p === page ? "secondary" : "ghost",
                className: "h-6 min-w-6 rounded-full px-1.5 text-[11px] font-medium",
                onClick: () => setPage(p),
                "aria-label": `Go to page ${p}`,
                title: `Go to page ${p}`,
                children: p
              },
              p
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-6 w-6 rounded-full",
                disabled: page >= totalPages,
                onClick: () => setPage((p) => p + 1),
                "aria-label": "Next page",
                title: "Next page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "icon",
                variant: "ghost",
                className: "h-6 w-6 rounded-full",
                disabled: page >= totalPages,
                onClick: () => setPage(totalPages),
                "aria-label": "Last page",
                title: "Last page",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsRight, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-destructive", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2", children: [
        items.length === 0 && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "mx-auto mb-2 h-8 w-8 opacity-50" }),
          "No notifications yet"
        ] }),
        items.map((n) => {
          const ch = channelFor(n.source || "telegram");
          const ts = n.message_time || n.message_at || n.created_at;
          const accountId = n.account_id ?? n.telegram_account_id;
          const linked = accountId != null ? linkedAccounts.find((a) => a.id === accountId) : void 0;
          const accountLabel = accountId != null ? accountLabels[accountId] || `Account #${accountId}` : "Unknown";
          const sender = n.sender || n.sender_name;
          const rawText = n.message || n.message_text || "(no content)";
          const links = extractUrls(rawText);
          const textWithoutUrls = rawText.replace(/https?:\/\/[^\s]+/gi, "").trim();
          const isGenericMediaLabel = /^(photo|image|video file|video note|audio file|voice message|file|media message|sticker|gif)$/i.test(
            textWithoutUrls
          );
          const hasCaption = textWithoutUrls.length > 0 && !isGenericMediaLabel;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "li",
            {
              className: `group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md animate-fade-in ${!n.is_read ? "border-l-4 border-l-primary" : ""}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                selectMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: selectedIds.has(n.id),
                    onChange: () => toggleSelected(n.id),
                    className: "mt-1 h-4 w-4 cursor-pointer rounded border-border",
                    "aria-label": `Select notification ${n.id}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-20 shrink-0 flex-col items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ConnectedAccountAvatar,
                    {
                      avatarUrl: linked?.avatar_url,
                      displayName: accountLabel,
                      muted: linked?.status === "muted",
                      sizeClassName: "h-9 w-9",
                      textClassName: "text-[11px]",
                      className: "mt-0.5 ring-2 ring-background"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex max-w-full items-center truncate rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20", children: accountLabel })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: sender || "Unknown sender" }),
                    ts && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(ts).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    ch.label,
                    n.chat_name ? ` · ${n.chat_name}` : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
                    links.map((link) => {
                      const gifLike = isGifLikeMedia(link, rawText);
                      if (gifLike) {
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "video",
                          {
                            src: link,
                            autoPlay: true,
                            loop: true,
                            muted: true,
                            playsInline: true,
                            controls: true,
                            className: "max-h-72 w-full max-w-md rounded-lg"
                          },
                          link
                        );
                      }
                      const mediaKind = mediaKindFromUrl(link);
                      if (mediaKind === "sticker") {
                        return isAnimatedStickerUrl(link) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-fit rounded-lg border border-border/70 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TgsSticker, { url: link, className: "h-24 w-24" }) }, link) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: link,
                            alt: "Sticker",
                            className: "max-h-28 w-auto rounded-lg object-contain"
                          },
                          link
                        );
                      }
                      if (mediaKind === "image") {
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: link,
                            alt: "Shared media",
                            className: "max-h-72 w-full max-w-md rounded-lg object-cover"
                          },
                          link
                        );
                      }
                      if (mediaKind === "video") {
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "video",
                          {
                            src: link,
                            controls: true,
                            className: "max-h-72 w-full max-w-md rounded-lg"
                          },
                          link
                        );
                      }
                      if (mediaKind === "audio") {
                        return /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { src: link, controls: true, className: "w-full max-w-md" }, link);
                      }
                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "a",
                        {
                          href: link,
                          target: "_blank",
                          rel: "noreferrer",
                          className: "inline-block break-all text-xs text-primary underline",
                          children: "Download file"
                        },
                        link
                      );
                    }),
                    (hasCaption || links.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap break-words text-sm text-foreground", children: textWithoutUrls || rawText })
                  ] })
                ] }),
                !n.is_read && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    onClick: () => markRead(n.id),
                    className: "opacity-0 group-hover:opacity-100 transition-opacity",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
                      " Read"
                    ]
                  }
                )
              ] })
            },
            n.id
          );
        })
      ] })
    ] })
  ] });
}
export {
  NotificationsCard as N
};
