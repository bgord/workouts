import * as bg from "@bgord/ui";
import { PersonStanding } from "lucide-react";
import { Gap } from "./gap";

export function BodyweightBadge() {
  const t = bg.useTranslations();

  return (
    <span data-stack="x" {...Gap.inline}>
      <PersonStanding data-size="xs" />
      {t("exercise.resistance.bodyweight")}
    </span>
  );
}

export function BodyweightMarker() {
  const t = bg.useTranslations();

  return (
    <span
      aria-label={t("exercise.resistance.bodyweight")}
      data-bg="neutral-900"
      data-br="circle"
      data-color="neutral-100"
      data-disp="flex"
      data-left="4"
      data-p="1"
      data-position="absolute"
      data-top="4"
      role="img"
      title={t("exercise.resistance.bodyweight")}
    >
      <PersonStanding data-size="sm" />
    </span>
  );
}
