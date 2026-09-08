import { useTranslations } from "@bgord/ui";
import type { ActionState } from "../../modules/action-state";

export function ActionHints(props: { action: ActionState }) {
  const t = useTranslations();

  return props.action.hints.map((hint) => (
    <div data-color="neutral-400" data-fs="sm" key={hint}>
      {t(hint)}
    </div>
  ));
}
