import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { SettingsPage } from "./dashboard.settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Alert Hub" },
      { name: "description", content: "Manage push notifications and your account credentials." },
    ],
  }),
  component: () => (
    <AppLayout title="Settings">
      <SettingsPage />
    </AppLayout>
  ),
});
