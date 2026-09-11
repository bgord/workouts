import { useTranslations } from "@bgord/ui";
import { Info } from "lucide-react";
import type { ActionState } from "../../modules/action-state";

export function ActionHint(props: { action: ActionState }) {
  const t = useTranslations();
  const hint = props.action.hints[0];

  if (!hint) return null;

  return (
    <div
      data-color="neutral-400"
      data-cross="center"
      data-fs="sm"
      data-gap="1"
      data-stack="x"
      data-wrap="nowrap"
      key={hint}
    >
      <Info data-shrink="0" data-size="sm" />
      {t(hint)}
    </div>
  );
}
