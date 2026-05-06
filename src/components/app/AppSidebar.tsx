import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, UserCog, Settings, LogOut, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuItem, SidebarMenuButton,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

const items = [
  { to: "/dashboard", label: "Notifications", icon: Bell, exact: true, key: "notifications" as const },
  { to: "/dashboard/account", label: "Accounts", icon: UserCog, key: "account" as const },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, key: "settings" as const },
];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

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
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1.5 group/logo">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 transition-transform group-hover/logo:scale-110 group-hover/logo:rotate-3">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout" onClick={() => { logout(); navigate({ to: "/login" }); }}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
