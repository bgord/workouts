import * as bg from "@bgord/ui";

export function NoLoadBadge() {
  const t = bg.useTranslations();

  return (
    <span className="c-badge" data-tone="soft" data-variant="outline">
      {t("exercise.loading.none")}
    </span>
  );
}
