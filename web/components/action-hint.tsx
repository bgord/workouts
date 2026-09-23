import type { ActionState } from "@bgord/bun";
import * as bg from "@bgord/ui";
import { Info } from "lucide-react";
import { Gap } from "./gap";

export function ActionHint(props: ActionState & React.JSX.IntrinsicElements["small"]) {
  const { hints, ...rest } = props;
  const t = bg.useTranslations();
  const hint = hints[0];

  if (!hint) return null;

  return (
    <small data-stack="x" {...Gap.cluster} {...rest}>
      <Info data-shrink="0" data-size="sm" />
      {t(hint)}
    </small>
  );
}
