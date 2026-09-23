import * as bg from "@bgord/ui";
import { Gap } from "./gap";
import { RirColor } from "./rir-color";

export function RirBadge(props: { rir: number }) {
  const t = bg.useTranslations();

  return (
    <span
      data-color={RirColor(props.rir)}
      data-fs="xs"
      data-fw="medium"
      data-stack="x"
      data-transform="font-variant-numeric"
      title={t("workout.set.rir.title")}
      {...Gap.inline}
    >
      <span data-bg={RirColor(props.rir)} data-br="circle" style={{ width: 6, height: 6 }} />
      {t("workout.set.rir.label")} {props.rir}
    </span>
  );
}
