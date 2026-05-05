import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Notification {
  id: string | number;
  sender?: string | null;
  source?: string | null;
  chat?: string | null;
  chat_name?: string | null;
  message?: string | null;
  text?: string | null;
  preview?: string | null;
  is_read: boolean;
  message_time?: string | null;
  created_at?: string | null;
}

interface ListResp {
  items: Notification[];
  total: number;
  page: number;
  page_size: number;
}

const PAGE_SIZE = 20;

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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (q) params.set("q", q);
      if (readFilter !== "all") params.set("is_read", readFilter === "read" ? "true" : "false");
      const data = await api<ListResp>(`/notifications?${params.toString()}`);
      setItems(data.items || []);
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

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Filters</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              placeholder="Search messages / senders"
              value={qDraft}
              onChange={(e) => setQDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
            />
          </div>
          <div className="w-full sm:w-44">
            <Select value={readDraft} onValueChange={(v) => setReadDraft(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Notifications</h2>
          <span className="text-xs text-muted-foreground">{loading ? "Refreshing..." : `${total} total`}</span>
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <ul className="mt-4 space-y-2">
          {items.length === 0 && !loading && (
            <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </li>
          )}
          {items.map((n) => {
            const body = n.message || n.text || n.preview || "(no content)";
            const ts = n.message_time || n.created_at;
            return (
              <li
                key={n.id}
                className={`rounded-lg border border-border bg-card p-4 ${
                  !n.is_read ? "border-l-4 border-l-[var(--unread)]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-medium text-foreground">{n.sender || "Unknown sender"}</span>
                      {ts && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(ts).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {n.source || "telegram"}
                      {n.chat_name || n.chat ? ` · ${n.chat_name || n.chat}` : ""}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">{body}</p>
                  </div>
                  {!n.is_read && (
                    <Button size="sm" variant="outline" onClick={() => markRead(n.id)}>
                      Mark as read
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {total > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Page {page} / {totalPages} ({total} items)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}