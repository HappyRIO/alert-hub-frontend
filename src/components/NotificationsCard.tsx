import { useEffect, useState, useCallback } from "react";
import lottie from "lottie-web";
import { ungzip } from "pako";
import {
  Search,
  Check,
  CheckCheck,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckSquare,
  ListChecks,
  X,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/api";
import type { AccountRec } from "@/lib/mockApi";
import { ConnectedAccountAvatar } from "@/components/AccountAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { channelFor } from "@/lib/channels";

interface Notification {
  id: string | number;
  account_id?: number;
  telegram_account_id?: number;
  sender?: string | null;
  sender_name?: string | null;
  source?: string | null;
  chat_name?: string | null;
  message?: string | null;
  message_text?: string | null;
  is_read: boolean;
  message_time?: string | null;
  message_at?: string | null;
  created_at?: string | null;
}

interface ListResp {
  items: Notification[];
  total: number;
  page: number;
  page_size: number;
}
const PAGE_SIZE = 20;

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+/gi);
  if (!matches) return [];
  return Array.from(new Set(matches));
}

function mediaKindFromUrl(url: string): "sticker" | "image" | "video" | "audio" | "file" {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(webp|tgs)$/.test(clean)) return "sticker";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(clean)) return "image";
  if (/\.(mp4|webm|mov|m4v)$/.test(clean)) return "video";
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(clean)) return "audio";
  return "file";
}

function isGifLikeMedia(url: string, text?: string): boolean {
  const clean = url.split("?")[0].toLowerCase();
  if (/\.gif$/.test(clean)) return true;
  if (/\.(mp4|webm|mov|m4v)$/.test(clean) && /gif/.test(clean)) return true;
  if ((text || "").toLowerCase().includes("gif") && /\.(mp4|webm|mov|m4v)$/.test(clean)) return true;
  return false;
}

function isAnimatedStickerUrl(url: string): boolean {
  return /\.tgs(\?|$)/i.test(url);
}

function TgsSticker({ url, className }: { url: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    let animation: ReturnType<typeof lottie.loadAnimation> | null = null;
    const load = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load sticker");
        const buf = await res.arrayBuffer();
        const jsonText = ungzip(new Uint8Array(buf), { to: "string" }) as string;
        const data = JSON.parse(jsonText);
        if (!active || !container) return;
        animation = lottie.loadAnimation({
          container,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data,
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

  if (failed) return <span className="text-xs text-muted-foreground">Sticker</span>;
  return <div ref={setContainer} className={className || "h-24 w-24"} />;
}

export function NotificationsCard() {
  const [items, setItems] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [qDraft, setQDraft] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [readDraft, setReadDraft] = useState<"all" | "read" | "unread">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountLabels, setAccountLabels] = useState<Record<number, string>>({});
  const [linkedAccounts, setLinkedAccounts] = useState<AccountRec[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (q) params.set("q", q);
      if (readFilter !== "all") params.set("is_read", readFilter === "read" ? "true" : "false");
      const data = await api<ListResp>(`/notifications?${params.toString()}`);
      const nextItems = data.items || [];
      setItems(nextItems);
      setTotal(data.total || 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, q, readFilter]);

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [load]);
  useEffect(() => {
    api<AccountRec[]>("/accounts")
      .then((accounts) => {
        setLinkedAccounts(accounts);
        const labels: Record<number, string> = {};
        accounts.forEach((a) => {
          labels[a.id] = a.display_name || a.label || a.username || `Account #${a.id}`;
        });
        setAccountLabels(labels);
      })
      .catch(() => {});
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visiblePages = (() => {
    const windowSize = 3;
    let start = Math.max(1, page - 1);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  const markRead = async (id: string | number) => {
    try {
      await api(`/notifications/${id}/read`, { method: "POST" });
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, is_read: true } : x)));
    } catch (e: any) {
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
    } catch (e: any) {
      setError(e.message);
    }
  };
  const toggleSelected = (id: string | number) => {
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
      const ids = new Set<string | number>();
      let nextPage = 1;
      let totalItems = 0;
      do {
        const params = new URLSearchParams({ page: String(nextPage), page_size: "100" });
        if (q) params.set("q", q);
        if (readFilter !== "all") params.set("is_read", readFilter === "read" ? "true" : "false");
        const data = await api<ListResp>(`/notifications?${params.toString()}`);
        (data.items || []).forEach((item) => ids.add(item.id));
        totalItems = data.total || 0;
        nextPage += 1;
      } while (ids.size < totalItems);
      setSelectedIds(ids);
    } catch (e: any) {
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
        body: JSON.stringify({ ids: Array.from(selectedIds).map((id) => Number(id)) }),
      });
      setItems((xs) => xs.filter((x) => !selectedIds.has(x.id)));
      setTotal((x) => Math.max(0, x - selectedCount));
      setSelectedIds(new Set());
      if (items.length === selectedCount && page > 1) setPage((p) => p - 1);
      setSelectMode(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages or senders..."
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-44">
            <Select value={readDraft} onValueChange={(v) => setReadDraft(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={apply}>Apply</Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          {!selectMode ? (
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">Feed</h2>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
                {total} total
              </span>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
              {total} total
            </span>
          )}
          <div className="flex items-center gap-2">
            {!selectMode ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setSelectMode(true)}
                disabled={items.length === 0}
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={selectAllMessages}
                  disabled={total === 0}
                  aria-label="Select all messages"
                  title="Select all messages"
                >
                  <ListChecks className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={toggleSelectAllOnPage}
                  disabled={items.length === 0}
                  aria-label={allOnPageSelected ? "Unselect page" : "Select page"}
                  title={allOnPageSelected ? "Unselect page" : "Select page"}
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="relative h-8 w-8"
                  onClick={deleteSelected}
                  disabled={selectedCount === 0}
                  aria-label={`Delete selected (${selectedCount})`}
                  title={`Delete selected (${selectedCount})`}
                >
                  <Trash2 className="h-4 w-4" />
                  {selectedCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-background px-1 text-[10px] font-semibold text-foreground ring-1 ring-border">
                      {selectedCount}
                    </span>
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => {
                    setSelectMode(false);
                    setSelectedIds(new Set());
                  }}
                  aria-label="Cancel selection"
                  title="Cancel selection"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
            {!selectMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAllRead}
                disabled={!hasUnread}
                aria-label="Mark all as read"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
            {total > 0 && (
              <div className="ml-1 flex items-center gap-0.5 rounded-full border border-border/70 bg-background/80 p-1 shadow-sm">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full"
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                  aria-label="First page"
                  title="First page"
                >
                  <ChevronsLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {visiblePages.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === page ? "secondary" : "ghost"}
                    className="h-6 min-w-6 rounded-full px-1.5 text-[11px] font-medium"
                    onClick={() => setPage(p)}
                    aria-label={`Go to page ${p}`}
                    title={`Go to page ${p}`}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  aria-label="Next page"
                  title="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full"
                  disabled={page >= totalPages}
                  onClick={() => setPage(totalPages)}
                  aria-label="Last page"
                  title="Last page"
                >
                  <ChevronsRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <ul className="mt-4 space-y-2">
          {items.length === 0 && !loading && (
            <li className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              <Inbox className="mx-auto mb-2 h-8 w-8 opacity-50" />
              No notifications yet
            </li>
          )}
          {items.map((n) => {
            const ch = channelFor(n.source || "telegram");
            const ts = n.message_time || n.message_at || n.created_at;
            const accountId = n.account_id ?? n.telegram_account_id;
            const linked = accountId != null ? linkedAccounts.find((a) => a.id === accountId) : undefined;
            const accountLabel =
              accountId != null ? accountLabels[accountId] || `Account #${accountId}` : "Unknown";
            const sender = n.sender || n.sender_name;
            const rawText = n.message || n.message_text || "(no content)";
            const links = extractUrls(rawText);
            const textWithoutUrls = rawText.replace(/https?:\/\/[^\s]+/gi, "").trim();
            const isGenericMediaLabel = /^(photo|image|video file|video note|audio file|voice message|file|media message|sticker|gif)$/i.test(
              textWithoutUrls,
            );
            const hasCaption = textWithoutUrls.length > 0 && !isGenericMediaLabel;
            return (
              <li
                key={n.id}
                className={`group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md animate-fade-in ${
                  !n.is_read ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(n.id)}
                      onChange={() => toggleSelected(n.id)}
                      className="mt-1 h-4 w-4 cursor-pointer rounded border-border"
                      aria-label={`Select notification ${n.id}`}
                    />
                  )}
                  <div className="flex w-20 shrink-0 flex-col items-center gap-1">
                    <ConnectedAccountAvatar
                      avatarUrl={linked?.avatar_url}
                      displayName={accountLabel}
                      muted={linked?.status === "muted"}
                      sizeClassName="h-9 w-9"
                      textClassName="text-[11px]"
                      className="mt-0.5 ring-2 ring-background"
                    />
                    <span className="inline-flex max-w-full items-center truncate rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary ring-1 ring-primary/20">
                      {accountLabel}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium text-foreground">
                        {sender || "Unknown sender"}
                      </span>
                      {ts && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(ts).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {ch.label}
                      {n.chat_name ? ` · ${n.chat_name}` : ""}
                    </p>
                    <div className="mt-2 space-y-2">
                      {links.map((link) => {
                        const gifLike = isGifLikeMedia(link, rawText);
                        if (gifLike) {
                          return (
                            <video
                              key={link}
                              src={link}
                              autoPlay
                              loop
                              muted
                              playsInline
                              controls
                              className="max-h-72 w-full max-w-md rounded-lg"
                            />
                          );
                        }
                        const mediaKind = mediaKindFromUrl(link);
                        if (mediaKind === "sticker") {
                          return isAnimatedStickerUrl(link) ? (
                            <div key={link} className="w-fit rounded-lg border border-border/70 p-1">
                              <TgsSticker url={link} className="h-24 w-24" />
                            </div>
                          ) : (
                            <img
                              key={link}
                              src={link}
                              alt="Sticker"
                              className="max-h-28 w-auto rounded-lg object-contain"
                            />
                          );
                        }
                        if (mediaKind === "image") {
                          return (
                            <img
                              key={link}
                              src={link}
                              alt="Shared media"
                              className="max-h-72 w-full max-w-md rounded-lg object-cover"
                            />
                          );
                        }
                        if (mediaKind === "video") {
                          return (
                            <video
                              key={link}
                              src={link}
                              controls
                              className="max-h-72 w-full max-w-md rounded-lg"
                            />
                          );
                        }
                        if (mediaKind === "audio") {
                          return <audio key={link} src={link} controls className="w-full max-w-md" />;
                        }
                        return (
                          <a
                            key={link}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block break-all text-xs text-primary underline"
                          >
                            Download file
                          </a>
                        );
                      })}
                      {(hasCaption || links.length === 0) && (
                        <p className="whitespace-pre-wrap break-words text-sm text-foreground">
                          {textWithoutUrls || rawText}
                        </p>
                      )}
                    </div>
                  </div>
                  {!n.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markRead(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Check className="h-4 w-4" /> Read
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
