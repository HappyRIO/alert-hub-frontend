import { useEffect, useState } from "react";
import { VolumeX } from "lucide-react";
import type { AccountRec } from "@/lib/mockApi";
import { resolveBackendMediaUrl } from "@/lib/api";
import { accountDisplayName, avatarTone, telegramStyleInitials } from "@/lib/accountVisual";

/** Connected Telegram account: real photo from API only; initials if missing or broken. */
export function AccountAvatar({
  account,
  className = "",
  sizeClassName = "h-7 w-7",
  textClassName = "text-[10px]",
  muted: mutedProp,
}: {
  account: AccountRec;
  className?: string;
  sizeClassName?: string;
  textClassName?: string;
  /** When set, overrides account.status for the mute badge */
  muted?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const url = resolveBackendMediaUrl(account.avatar_url);
  const name = accountDisplayName(account);
  const initials = telegramStyleInitials(name);
  const showImg = Boolean(url) && !failed;
  const muted = mutedProp ?? account.status === "muted";

  useEffect(() => {
    setFailed(false);
  }, [url]);

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${textClassName} ${sizeClassName} ${className}`}
      style={{ backgroundColor: avatarTone(name) }}
      title={muted ? `${name} · Notifications muted` : name}
    >
      {showImg ? (
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
      {muted && (
        <span
          className="pointer-events-none absolute -left-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-1 ring-border/60"
          title="Notifications muted"
        >
          <VolumeX className="h-2 w-2 text-amber-600" aria-hidden />
        </span>
      )}
    </span>
  );
}

export function ConnectedAccountAvatar({
  avatarUrl,
  displayName,
  muted = false,
  className = "",
  sizeClassName = "h-9 w-9",
  textClassName = "text-[11px]",
}: {
  avatarUrl?: string | null;
  displayName: string;
  muted?: boolean;
  className?: string;
  sizeClassName?: string;
  textClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = resolveBackendMediaUrl(avatarUrl);
  const initials = telegramStyleInitials(displayName);
  const showImg = Boolean(url) && !failed;

  useEffect(() => {
    setFailed(false);
  }, [url]);

  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ${textClassName} ${sizeClassName} ${className}`}
      style={{ backgroundColor: avatarTone(displayName) }}
      title={muted ? `${displayName} · Notifications muted` : displayName}
    >
      {showImg ? (
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
      {muted && (
        <span
          className="pointer-events-none absolute -left-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background ring-1 ring-border/60"
          title="Notifications muted"
        >
          <VolumeX className="h-2 w-2 text-amber-600" aria-hidden />
        </span>
      )}
    </span>
  );
}
