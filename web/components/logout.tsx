import { LogOut } from "lucide-react";
import { IconButton } from "./icon-button";

export function Logout(props: React.JSX.IntrinsicElements["button"]) {
  return (
    <IconButton
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" });
        location.replace("/public/login.html");
      }}
      {...props}
    >
      <LogOut data-size="sm" />
    </IconButton>
  );
}
