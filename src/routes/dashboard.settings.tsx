import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Eye, EyeOff, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { api, tokens } from "@/lib/api";
import { disableWebPush, enableWebPush, webPushSupported } from "@/lib/webPush";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Alert Hub" },
      { name: "description", content: "Manage push notifications and your account credentials." },
    ],
  }),
  component: SettingsPage,
});

function PwInput({ id, value, onChange, autoComplete }: { id: string; value: string; onChange: (v: string) => void; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} className="pr-10" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function SettingsPage() {
  const [pushOn, setPushOn] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);

  const [me, setMe] = useState<string>("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPw, setEmailPw] = useState("");
  const [busyEmail, setBusyEmail] = useState(false);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [busyPw, setBusyPw] = useState(false);

  useEffect(() => {
    api<{ enabled: boolean }>("/push/state").then((d) => setPushOn(d.enabled)).catch(() => {});
    api<{ email: string }>("/me").then((d) => { setMe(d.email); setNewEmail(d.email); }).catch(() => {});
  }, []);

  const togglePush = async (v: boolean) => {
    setPushBusy(true);
    try {
      if (v) {
        if (!webPushSupported()) {
          toast.error("This browser does not support web push.");
          return;
        }
        await enableWebPush();
        try {
          await api("/push/state", { method: "PUT", body: JSON.stringify({ enabled: true }) });
        } catch (e) {
          await disableWebPush();
          throw e;
        }
        setPushOn(true);
        toast.success("Push notifications enabled");
      } else {
        await disableWebPush();
        await api("/push/state", { method: "PUT", body: JSON.stringify({ enabled: false }) });
        setPushOn(false);
        toast.success("Push notifications disabled");
      }
    } catch (e: any) {
      toast.error(e?.message || "Push setup failed");
    } finally {
      setPushBusy(false);
    }
  };

  const updateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyEmail(true);
    try {
      const data = await api<{ access_token?: string; refresh_token?: string }>("/me/email", {
        method: "PUT",
        body: JSON.stringify({ new_email: newEmail, password: emailPw }),
      });
      if (data.access_token && data.refresh_token) {
        tokens.set(data.access_token, data.refresh_token);
      }
      toast.success("Email updated");
      setMe(newEmail); setEmailPw("");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusyEmail(false); }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== newPw2) { toast.error("Passwords don't match"); return; }
    setBusyPw(true);
    try {
      await api("/me/password", { method: "PUT", body: JSON.stringify({ current_password: curPw, new_password: newPw }) });
      toast.success("Password updated");
      setCurPw(""); setNewPw(""); setNewPw2("");
    } catch (e: any) { toast.error(e.message); }
    finally { setBusyPw(false); }
  };

  return (
    <>
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold">Browser push notifications</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Get real-time alerts in your browser when new messages arrive.
            </p>
          </div>
          <Switch checked={pushOn} disabled={pushBusy} onCheckedChange={togglePush} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-foreground">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Change login email</h2>
            <p className="text-xs text-muted-foreground">Current: {me}</p>
          </div>
        </div>
        <form onSubmit={updateEmail} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="new-email">New email</Label>
            <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="email-pw">Confirm password</Label>
            <PwInput id="email-pw" value={emailPw} onChange={setEmailPw} autoComplete="current-password" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busyEmail}>{busyEmail ? "Saving…" : "Update email"}</Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-foreground">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Change password</h2>
            <p className="text-xs text-muted-foreground">Use at least 6 characters.</p>
          </div>
        </div>
        <form onSubmit={updatePassword} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="cur-pw">Current password</Label>
            <PwInput id="cur-pw" value={curPw} onChange={setCurPw} autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="new-pw">New password</Label>
            <PwInput id="new-pw" value={newPw} onChange={setNewPw} autoComplete="new-password" />
          </div>
          <div>
            <Label htmlFor="new-pw2">Confirm new password</Label>
            <PwInput id="new-pw2" value={newPw2} onChange={setNewPw2} autoComplete="new-password" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busyPw}>{busyPw ? "Saving…" : "Update password"}</Button>
          </div>
        </form>
      </section>
    </>
  );
}
