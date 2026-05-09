import { createFileRoute } from "@tanstack/react-router";
import { ConnectTelegramPage } from "@/components/app/ConnectTelegramPage";

export const Route = createFileRoute("/account/connect/telegram")({
  head: () => ({
    meta: [
      { title: "Connect Telegram — Alert Hub" },
      { name: "description", content: "Connect a Telegram account to Alert Hub." },
    ],
  }),
  component: ConnectTelegramPage,
});
