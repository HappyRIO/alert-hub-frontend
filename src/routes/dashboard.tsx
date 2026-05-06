import { createFileRoute, useNavigate, Outlet, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Alert Hub" },
      { name: "description", content: "Your unified Alert Hub notification feed." },
    ],
  }),
  component: DashboardLayout,
});

const navItems: { to: "/dashboard" | "/dashboard/telegram" | "/dashboard/push"; label: string; exact?: boolean }[] = [
  { to: "/dashboard", label: "Notifications", exact: true },
  { to: "/dashboard/telegram", label: "Telegram" },
  { to: "/dashboard/push", label: "Push" },
];

function DashboardLayout() {
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
        <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Alert Hub</h1>
            <p className="text-xs text-muted-foreground">More channels (WhatsApp, Gmail) coming soon</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { logout(); navigate({ to: "/login" }); }}>
            Logout
          </Button>
        </div>
        <nav className="mx-auto max-w-[1000px] px-4">
          <ul className="flex gap-1 border-t border-border/60 -mb-px">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.exact ?? false }}
                  className="inline-block px-3 py-2.5 text-sm text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors data-[status=active]:text-foreground data-[status=active]:border-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-[1000px] space-y-5 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}