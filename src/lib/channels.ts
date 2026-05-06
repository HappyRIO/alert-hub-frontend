import { Send, MessageCircle, Mail, Linkedin, Hash } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ChannelType = "telegram" | "whatsapp" | "gmail" | "linkedin" | "discord";

export interface ChannelDef {
  type: ChannelType;
  label: string;
  icon: LucideIcon;
  color: string; // tailwind text color
  available: boolean;
  description: string;
}

export const CHANNELS: ChannelDef[] = [
  { type: "telegram", label: "Telegram", icon: Send, color: "text-sky-400", available: true, description: "Connect a Telegram account to ingest messages." },
  { type: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-emerald-400", available: false, description: "Sync your WhatsApp conversations." },
  { type: "gmail", label: "Gmail", icon: Mail, color: "text-rose-400", available: false, description: "Get notified about important inbox messages." },
  { type: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-400", available: false, description: "Stay on top of LinkedIn DMs and mentions." },
  { type: "discord", label: "Discord", icon: Hash, color: "text-indigo-400", available: false, description: "Forward Discord pings and DMs." },
];

export function channelFor(type: string) {
  return CHANNELS.find((c) => c.type === type) ?? CHANNELS[0];
}
