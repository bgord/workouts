import * as bg from "@bgord/ui";
import { FlipHorizontal2 } from "lucide-react";
import { Gap } from "./gap";

export function UnilateralBadge(props: React.JSX.IntrinsicElements["span"]) {
  const t = bg.useTranslations();

  return (
    <span data-stack="x" {...Gap.inline} {...props}>
      <FlipHorizontal2 data-size="xs" />
      {t("exercise.laterality.unilateral")}
    </span>
  );
}

export function UnilateralGlyph(props: React.JSX.IntrinsicElements["svg"]) {
  return <FlipHorizontal2 aria-hidden data-color="neutral-500" data-shrink="0" data-size="sm" {...props} />;
}

export function UnilateralMarker(props: React.JSX.IntrinsicElements["span"]) {
  const t = bg.useTranslations();

  return (
    <span
      aria-label={t("exercise.laterality.unilateral")}
      data-bg="neutral-900"
      data-br="circle"
      data-color="neutral-100"
      data-disp="flex"
      data-p="1"
      role="img"
      title={t("exercise.laterality.unilateral")}
      {...props}
    >
      <FlipHorizontal2 data-size="sm" />
    </span>
  );
}
