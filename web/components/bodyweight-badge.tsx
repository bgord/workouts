import * as bg from "@bgord/ui";
import { PersonStanding } from "lucide-react";
import { Gap } from "./gap";

export function BodyweightBadge(props: React.JSX.IntrinsicElements["span"]) {
  const t = bg.useTranslations();

  return (
    <span data-stack="x" {...Gap.inline} {...props}>
      <PersonStanding data-size="xs" />
      {t("exercise.resistance.bodyweight")}
    </span>
  );
}

export function BodyweightGlyph(props: React.JSX.IntrinsicElements["svg"]) {
  return <PersonStanding aria-hidden data-color="neutral-500" data-shrink="0" data-size="sm" {...props} />;
}

export function BodyweightMarker(props: React.JSX.IntrinsicElements["span"]) {
  const t = bg.useTranslations();

  return (
    <span
      aria-label={t("exercise.resistance.bodyweight")}
      data-bg="neutral-900"
      data-br="circle"
      data-color="neutral-100"
      data-disp="flex"
      data-p="1"
      role="img"
      title={t("exercise.resistance.bodyweight")}
      {...props}
    >
      <PersonStanding data-size="sm" />
    </span>
  );
}
