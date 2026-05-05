import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Account {
  id?: string | number;
  label: string;
  session_name: string;
  phone_number?: string;
}

export function TelegramAccountsCard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [label, setLabel] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);

  const load = async () => {
    try {
      const data = await api<Account[] | { items: Account[] }>("/telegram/accounts");
      setAccounts(Array.isArray(data) ? data : data.items || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendCode = async () => {
    if (!label || !sessionName || !phone) {
      setStatus({ kind: "err", text: "Fill label, session name, phone." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await api("/telegram/connect/send-code", {
        method: "POST",
        body: JSON.stringify({ label, session_name: sessionName, phone_number: phone }),
      });
      setStep(2);
      setStatus({ kind: "info", text: "Code sent. Check Telegram." });
    } catch (e: any) {
      setStatus({ kind: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setStatus(null);
    try {
      await api("/telegram/connect/verify", {
        method: "POST",
        body: JSON.stringify({
          label,
          session_name: sessionName,
          phone_number: phone,
          code,
          password: password || undefined,
        }),
      });
      setStatus({ kind: "ok", text: "Account connected." });
      setLabel(""); setSessionName(""); setPhone(""); setCode(""); setPassword("");
      setStep(1);
      load();
    } catch (e: any) {
      setStatus({ kind: "err", text: e.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Telegram Accounts</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect a Telegram account to ingest its messages. More channels coming soon.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="tg-label">Label</Label>
          <Input id="tg-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Personal" disabled={step === 2} />
        </div>
        <div>
          <Label htmlFor="tg-session">Session name</Label>
          <Input id="tg-session" value={sessionName} onChange={(e) => setSessionName(e.target.value)} placeholder="my-session" disabled={step === 2} />
        </div>
        <div>
          <Label htmlFor="tg-phone">Phone number</Label>
          <Input id="tg-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+15551234567" disabled={step === 2} />
        </div>
      </div>

      {step === 2 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="tg-code">Telegram code</Label>
            <Input id="tg-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="12345" />
          </div>
          <div>
            <Label htmlFor="tg-2fa">2FA password (optional)</Label>
            <Input id="tg-2fa" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        {step === 1 ? (
          <Button onClick={sendCode} disabled={busy}>{busy ? "Sending..." : "Send code"}</Button>
        ) : (
          <>
            <Button onClick={verify} disabled={busy}>{busy ? "Verifying..." : "Verify and connect"}</Button>
            <Button variant="outline" onClick={() => { setStep(1); setStatus(null); }}>Cancel</Button>
          </>
        )}
        {status && (
          <span className={`text-sm ${status.kind === "err" ? "text-destructive" : status.kind === "ok" ? "text-foreground" : "text-muted-foreground"}`}>
            {status.text}
          </span>
        )}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground">Connected accounts</h3>
        {accounts.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No accounts connected yet.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {accounts.map((a, i) => (
              <li key={a.id ?? i} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
                <span className="font-medium text-foreground">{a.label} <span className="text-muted-foreground font-normal">({a.session_name})</span></span>
                <span className="text-muted-foreground">{a.phone_number || ""}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}