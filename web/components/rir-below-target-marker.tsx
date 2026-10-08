import * as bg from "@bgord/ui";
import { ArrowDown } from "lucide-react";

export function RirBelowTargetMarker(props: React.JSX.IntrinsicElements["span"] & { target?: number }) {
  const t = bg.useTranslations();
  const { target, ...span } = props;

  const label = t("workout.set.rir.below_target", { rir: target ?? "" });

  return (
    <span aria-label={label} data-color="danger-400" data-self="center" role="img" title={label} {...span}>
      <ArrowDown data-size="xs" />
    </span>
  );
}
