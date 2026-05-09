import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as Label, I as Input, B as Button, a as api } from "./router-DlpwBVgH.mjs";
import { A as ArrowLeft, S as Send, a0 as ShieldCheck } from "../_libs/lucide-react.mjs";
function ConnectTelegramPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [sessionName, setSessionName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [step, setStep] = reactExports.useState(1);
  const [busy, setBusy] = reactExports.useState(false);
  const sendCode = async () => {
    if (!displayName || !sessionName || !phone) {
      toast.error("Fill display name, session name, and phone.");
      return;
    }
    setBusy(true);
    try {
      await api("/telegram/connect/send-code", {
        method: "POST",
        body: JSON.stringify({
          display_name: displayName,
          session_name: sessionName,
          phone_number: phone
        })
      });
      setStep(2);
      toast.success("Code sent. Check Telegram.");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  const verify = async () => {
    setBusy(true);
    try {
      await api("/telegram/connect/verify", {
        method: "POST",
        body: JSON.stringify({
          display_name: displayName,
          session_name: sessionName,
          phone_number: phone,
          code,
          password: password || void 0
        })
      });
      toast.success("Telegram connected!");
      navigate({ to: "/account/" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-xl border border-border bg-card p-6 shadow-sm animate-scale-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/account/",
        className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          " Back to accounts"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: "Connect Telegram" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Step ",
          step,
          " of 2"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tg-display-name", children: "Display name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tg-display-name",
            value: displayName,
            onChange: (e) => setDisplayName(e.target.value),
            placeholder: "Personal",
            disabled: step === 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tg-session", children: "Session name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tg-session",
            value: sessionName,
            onChange: (e) => setSessionName(e.target.value),
            placeholder: "my-session",
            disabled: step === 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tg-phone", children: "Phone number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tg-phone",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            placeholder: "+15551234567",
            disabled: step === 2
          }
        )
      ] })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tg-code", children: "Telegram code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tg-code",
            value: code,
            onChange: (e) => setCode(e.target.value),
            placeholder: "12345"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "tg-2fa", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
          " 2FA password (optional)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "tg-2fa",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex items-center gap-3", children: step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: sendCode, disabled: busy, children: busy ? "Sending..." : "Send code" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: verify, disabled: busy, children: busy ? "Verifying..." : "Verify and connect" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setStep(1), children: "Back" })
    ] }) })
  ] });
}
export {
  ConnectTelegramPage as C
};
