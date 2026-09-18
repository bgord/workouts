import * as bg from "@bgord/ui";
import { Spacing } from "./spacing";

export function OnlineStatusBar() {
  const t = bg.useTranslations();
  const status = bg.useOnlineStatus();

  if (status === bg.OnlineStatus.online) return null;

  return (
    <div
      data-bg="neutral-700"
      data-bottom="0"
      data-fs="sm"
      data-left="0"
      data-position="fixed"
      {...Spacing.surfaceCompact}
    >
      {t("app.offline")}
    </div>
  );
}
