import { api } from "@/lib/api";

export function webPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/** VAPID public key from the server is URL-safe base64 without padding. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

/**
 * Register `sw.js`, obtain permission, subscribe with the server VAPID key, and POST `/push/subscribe`.
 * Caller should persist preference with `PUT /push/state` after this succeeds.
 */
export async function enableWebPush(): Promise<void> {
  if (!webPushSupported()) {
    throw new Error("This browser does not support web push (service worker / Push API).");
  }

  const { public_key: publicKey } = await api<{ public_key: string }>("/push/public-key", { auth: false });
  if (!publicKey?.trim()) {
    throw new Error("Push is not configured on the server (missing VAPID keys).");
  }

  const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  await registration.ready;

  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    throw new Error(
      perm === "denied" ? "Notification permission was denied." : "Notification permission was not granted.",
    );
  }

  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey.trim()),
  });

  const json = sub.toJSON() as { endpoint?: string; keys?: { p256dh: string; auth: string } };
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Could not create a push subscription.");
  }

  await api("/push/subscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
  });
}

/** Unsubscribe this device and remove the row on the server. Safe to call when already off. */
export async function disableWebPush(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return;

  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;

  const endpoint = sub.endpoint;
  try {
    await sub.unsubscribe();
  } catch {
    // still try to drop server-side row
  }
  try {
    await api("/push/unsubscribe", { method: "POST", body: JSON.stringify({ endpoint }) });
  } catch {
    // best effort
  }
}
