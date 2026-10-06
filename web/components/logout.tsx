import * as bg from "@bgord/ui";
import { LogOut } from "lucide-react";
import { IconButton } from "./icon-button";

export function Logout(props: React.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  return (
    <IconButton
      aria-label={t("auth.logout.cta")}
      onClick={async () => {
        /* v8 ignore next 2 */
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      title={t("auth.logout.cta")}
      {...props}
    >
      <LogOut data-size="sm" />
    </IconButton>
  );
}
