import { createFileRoute } from "@tanstack/react-router";
import { TelegramAccountsCard } from "@/components/TelegramAccountsCard";

export const Route = createFileRoute("/dashboard/telegram")({
  head: () => ({
    meta: [
      { title: "Telegram — Alert Hub" },
      { name: "description", content: "Connect and manage Telegram accounts for notification ingestion." },
    ],
  }),
  component: () => <TelegramAccountsCard />,
});
