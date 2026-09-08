import { useTranslations } from "@bgord/ui";
import type { ActionState } from "../../modules/action-state";

export function ActionHint(props: { action: ActionState }) {
  const t = useTranslations();
  const hint = props.action.hints[0];

  if (!hint) return null;

  return (
    <div data-color="neutral-400" data-fs="sm" key={hint}>
      {t(hint)}
    </div>
  );
}
