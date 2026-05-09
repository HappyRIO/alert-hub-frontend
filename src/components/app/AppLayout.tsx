import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app/AppSidebar";
import { useAuth } from "@/lib/auth";

export function AppLayout({
  title,
  children,
  contentClassName,
  containerClassName,
}: {
  title: string;
  children: ReactNode;
  contentClassName?: string;
  containerClassName?: string;
}) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-svh w-full overflow-hidden bg-background">
        <AppSidebar />
        <SidebarInset className="min-h-0 overflow-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div>
              <h1 className="text-sm font-semibold text-foreground">{title}</h1>
            </div>
          </header>
          <main
            className={
              contentClassName ||
              "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
            }
          >
            <div className={containerClassName || "mx-auto max-w-5xl space-y-5 animate-fade-in"}>
              {children}
            </div>
          </main>
        </SidebarInset>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
