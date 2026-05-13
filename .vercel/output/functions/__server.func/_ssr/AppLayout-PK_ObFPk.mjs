import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, T as Toaster } from "./AppSidebar-DfbcW86j.mjs";
import { u as useAuth } from "./router-DsAEw-wD.mjs";
function AppLayout({
  title,
  children,
  contentClassName,
  containerClassName
}) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);
  if (loading || !isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground animate-pulse", children: "Loading…" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-svh w-full overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarInset, { className: "min-h-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-semibold text-foreground", children: title }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "main",
        {
          className: contentClassName || "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: containerClassName || "mx-auto max-w-5xl space-y-5 animate-fade-in", children })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) });
}
export {
  AppLayout as A
};
