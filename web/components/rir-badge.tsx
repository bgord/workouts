import { useTranslations } from "@bgord/ui";
import { RirColor } from "./rir-color";

const dot = { width: 6, height: 6 };

export function RirBadge(props: { rir: number }) {
  const t = useTranslations();

  return (
    <span
      data-color={RirColor(props.rir)}
      data-cross="center"
      data-fs="xs"
      data-fw="medium"
      data-gap="1-5"
      data-stack="x"
      data-transform="font-variant-numeric"
      data-wrap="nowrap"
      title={t("workout.set.rir.title")}
    >
      <span data-bg={RirColor(props.rir)} data-br="circle" style={dot} />
      {t("workout.set.rir.label")} {props.rir}
    </span>
  );
}
