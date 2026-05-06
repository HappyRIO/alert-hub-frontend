import { createFileRoute } from "@tanstack/react-router";
import { PushCard } from "@/components/PushCard";

export const Route = createFileRoute("/dashboard/push")({
  head: () => ({
    meta: [
      { title: "Browser Push — Alert Hub" },
      { name: "description", content: "Enable browser push notifications for real-time alerts." },
    ],
  }),
  component: () => <PushCard />,
});
