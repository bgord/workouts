import { OnlineStatus, useOnlineStatus, useTranslations } from "@bgord/ui";
import { Spacing } from "./spacing";

export function OnlineStatusBar() {
  const t = useTranslations();
  const status = useOnlineStatus();

  if (status === OnlineStatus.online) return null;

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
