import { useTranslations } from "@bgord/ui";
import { Info } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import { Spacing } from "./spacing";

export function ActionHint(props: ActionState & React.JSX.IntrinsicElements["div"]) {
  const { hints, ...rest } = props;
  const t = useTranslations();
  const hint = hints[0];

  if (!hint) return null;

  return (
    <div
      data-color="neutral-400"
      data-cross="center"
      data-fs="xs"
      data-stack="x"
      data-wrap="nowrap"
      key={hint}
      {...Spacing.icon}
      {...rest}
    >
      <Info data-shrink="0" data-size="sm" />
      {t(hint)}
    </div>
  );
}
