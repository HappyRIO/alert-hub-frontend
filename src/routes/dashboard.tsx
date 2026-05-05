import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PushCard } from "@/components/PushCard";
import { TelegramAccountsCard } from "@/components/TelegramAccountsCard";
import { NotificationsCard } from "@/components/NotificationsCard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Alert Hub" },
      { name: "description", content: "Your unified Alert Hub notification feed." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Alert Hub</h1>
            <p className="text-xs text-muted-foreground">More channels (WhatsApp, Gmail) coming soon</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate({ to: "/login" }); }}>
            Logout
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-[900px] space-y-5 px-4 py-6">
        <PushCard />
        <TelegramAccountsCard />
        <NotificationsCard />
      </main>
    </div>
  );
}