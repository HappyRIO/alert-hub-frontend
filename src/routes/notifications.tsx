import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { NotificationsCard } from "@/components/NotificationsCard";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Alert Hub" },
      { name: "description", content: "Browse, search, and manage your notification feed." },
    ],
  }),
  component: () => (
    <AppLayout title="Notifications">
      <NotificationsCard />
    </AppLayout>
  ),
});
