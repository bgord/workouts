import * as bg from "@bgord/ui";
import { Gap } from "./gap";
import { RirColor } from "./rir-color";

export function RirBadge(props: React.JSX.IntrinsicElements["span"] & { rir: number }) {
  const t = bg.useTranslations();
  const { rir, ...span } = props;

  return (
    <span
      data-color={RirColor(rir)}
      data-cross="baseline"
      data-fs="xs"
      data-fw="medium"
      data-stack="x"
      data-transform="font-variant-numeric"
      title={t("workout.set.rir.title")}
      {...Gap.inline}
      {...span}
    >
      <span
        data-bg={RirColor(rir)}
        data-br="circle"
        data-self="center"
        style={{ width: 6, height: 6 }}
      />
      {t("workout.set.rir.label")} {rir}
    </span>
  );
}
