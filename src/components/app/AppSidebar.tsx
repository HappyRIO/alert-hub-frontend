import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, UserCog, Settings, LogOut, Sparkles, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { telegramStyleInitials } from "@/lib/accountVisual";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const items = [
  { to: "/notifications", label: "Notifications", icon: Bell, exact: true, key: "notifications" as const },
  { to: "/chat", label: "Chat", icon: MessageSquare, key: "chat" as const },
  { to: "/account", label: "Accounts", icon: UserCog, key: "account" as const },
  { to: "/settings", label: "Settings", icon: Settings, key: "settings" as const },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const d = await api<{ count: number }>("/notifications/unread-count");
        if (alive) setUnread(d.count || 0);
      } catch {}
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => { alive = false; clearInterval(id); };
  }, [path]);

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/notifications" className="flex items-center gap-2 px-2 py-1.5 group/logo">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 transition-transform group-hover/logo:scale-110 group-hover/logo:rotate-3">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold leading-tight">Alert Hub</span>
            <span className="text-[10px] text-muted-foreground">Unified notifications</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.to, item.exact);
                const showBadge = item.key === "notifications" && unread > 0;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to} className="relative flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.label}</span>
                        {showBadge && (
                          <span className="absolute -right-0 -top-0 group-data-[collapsible=icon]:right-1 group-data-[collapsible=icon]:top-1 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground shadow-md ring-2 ring-sidebar animate-pulse">
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="mb-2 flex items-center gap-2 rounded-lg border border-border/70 p-2 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || undefined} alt={user?.name || user?.email || "User"} />
            <AvatarFallback className="text-xs font-semibold">
              {telegramStyleInitials(user?.name || user?.email || "User")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={() => setConfirmLogout(true)}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout now?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to continue using Alert Hub.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
