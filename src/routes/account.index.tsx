import { createFileRoute } from "@tanstack/react-router";
import { AccountsPage } from "./dashboard.account.index";

export const Route = createFileRoute("/account/")({
  component: AccountsPage,
});
