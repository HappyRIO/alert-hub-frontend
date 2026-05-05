import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushCard() {
  const [supported, setSupported] = useState(false);
  const [active, setActive] = useState(false);
  const [vapidMissing, setVapidMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
    setSupported(ok);
    if (ok) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.pushManager.getSubscription().then((s) => setActive(!!s));
      });
    }
  }, []);

  const enable = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const { public_key } = await api<{ public_key: string }>("/push/public-key", { auth: false });
      if (!public_key) {
        setVapidMissing(true);
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setMsg("Permission denied");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key),
      });
      await api("/push/subscribe", { method: "POST", body: JSON.stringify(sub) });
      setActive(true);
      setMsg("Push active");
    } catch (e: any) {
      setMsg(e.message || "Failed to enable push");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Browser Push</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {!supported
              ? "Not supported in this browser"
              : vapidMissing
                ? "Missing VAPID key on server"
                : active
                  ? "Push active"
                  : "Enable browser notifications to be alerted in real time."}
          </p>
          {msg && <p className="mt-2 text-sm text-muted-foreground">{msg}</p>}
        </div>
        <Button onClick={enable} disabled={!supported || active || busy}>
          {active ? "Enabled" : busy ? "..." : "Enable Push"}
        </Button>
      </div>
    </section>
  );
}