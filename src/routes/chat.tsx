import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";
import { ChatPage } from "./dashboard.chat";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Alert Hub" },
      { name: "description", content: "Chat with connected accounts in channel-specific layouts." },
    ],
  }),
  component: () => (
    <AppLayout
      title="Chat"
      contentClassName="flex h-[calc(100vh-3.5rem)] min-h-0 flex-1 overflow-hidden p-0"
      containerClassName="flex h-full min-h-0 flex-1 max-w-none overflow-hidden space-y-0 animate-fade-in"
    >
      <ChatPage />
    </AppLayout>
  ),
});
