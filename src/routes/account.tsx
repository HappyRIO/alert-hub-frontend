import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Accounts — Alert Hub" },
      { name: "description", content: "Manage your connected message accounts." },
    ],
  }),
  component: () => (
    <AppLayout title="Accounts">
      <Outlet />
    </AppLayout>
  ),
});
