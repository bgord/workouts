import { useTranslations } from "@bgord/ui";
import { RirColor } from "./rir-color";
import { Spacing } from "./spacing";

export function RirBadge(props: { rir: number }) {
  const t = useTranslations();

  return (
    <span
      data-color={RirColor(props.rir)}
      data-cross="center"
      data-fs="xs"
      data-fw="medium"
      data-stack="x"
      data-transform="font-variant-numeric"
      data-wrap="nowrap"
      title={t("workout.set.rir.title")}
      {...Spacing.inline}
    >
      <span data-bg={RirColor(props.rir)} data-br="circle" style={{ width: 6, height: 6 }} />
      {t("workout.set.rir.label")} {props.rir}
    </span>
  );
}
