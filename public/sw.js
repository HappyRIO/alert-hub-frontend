self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Alert Hub", body: "", url: "/chat" };
  }
  const title = data.title || "Alert Hub";
  const url = data.url || "/chat";
  const options = {
    body: data.body || "",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: data.tag || `alerthub-${Date.now()}`,
    renotify: Boolean(data.tag),
    data: { url },
    actions: [{ action: "reply", title: "Reply" }],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const base = (event.notification.data && event.notification.data.url) || "/chat";
  let path = base;
  if (event.action === "reply") {
    try {
      const u = new URL(base, self.location.origin);
      u.searchParams.set("reply", "1");
      path = u.pathname + u.search + u.hash;
    } catch {
      path = base;
    }
  }
  const absUrl = new URL(path, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(absUrl);
    }),
  );
});
