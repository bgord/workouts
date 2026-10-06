import * as bg from "@bgord/ui";
import type { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { ProgressionMethodIcon } from "./progression-method-icon";

export function ProgressionMethodBadge(props: { method: ProgressionMethodOptions }) {
  const t = bg.useTranslations();

  const label = t(`progression.method.${props.method}`);

  return (
    <span aria-label={label} className="c-badge" data-tone="soft" data-variant="outline" role="note">
      <ProgressionMethodIcon method={props.method} size="xs" />
      {label}
    </span>
  );
}
