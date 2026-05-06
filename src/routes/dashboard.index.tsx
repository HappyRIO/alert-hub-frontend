import { createFileRoute } from "@tanstack/react-router";
import { NotificationsCard } from "@/components/NotificationsCard";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Notifications — Alert Hub" },
      { name: "description", content: "Browse, search, and manage your notification feed." },
    ],
  }),
  component: () => <NotificationsCard />,
});
