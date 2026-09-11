import { useTranslations } from "@bgord/ui";
import { Info } from "lucide-react";
import type { ActionState } from "../../modules/action-state";

export function ActionHint(props: { action: ActionState } & React.JSX.IntrinsicElements["div"]) {
  const { action, ...rest } = props;
  const t = useTranslations();
  const hint = action.hints[0];

  if (!hint) return null;

  return (
    <div
      data-color="neutral-400"
      data-cross="center"
      data-fs="xs"
      data-gap="1-5"
      data-stack="x"
      data-wrap="nowrap"
      key={hint}
      {...rest}
    >
      <Info data-shrink="0" data-size="sm" />
      {t(hint)}
    </div>
  );
}
