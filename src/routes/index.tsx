import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alert Hub" },
      { name: "description", content: "Unified notification dashboard for Telegram and beyond." },
    ],
  }),
  component: Index,
});

function Index() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    navigate({ to: isAuthenticated ? "/dashboard" : "/login" });
  }, [isAuthenticated, loading, navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}
