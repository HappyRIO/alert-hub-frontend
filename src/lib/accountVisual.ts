/** Telegram-style: first + last initial, or first two letters of a single name. */
export function telegramStyleInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    const w = parts[0];
    if (w.length >= 2) return `${w[0]}${w[1]}`.toUpperCase();
    return w[0].toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function avatarTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  return `hsl(${hash} 65% 45%)`;
}

export function accountDisplayName(a: {
  display_name?: string;
  label?: string;
  username?: string;
}): string {
  return a.display_name || a.label || a.username || "Unnamed account";
}
