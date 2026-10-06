import * as bg from "@bgord/ui";
import type { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { ProgressionMethodIcon } from "./progression-method-icon";

export function ProgressionMethodBadge(
  props: React.JSX.IntrinsicElements["span"] & { method: ProgressionMethodOptions },
) {
  const t = bg.useTranslations();
  const { method, ...span } = props;

  const label = t(`progression.method.${method}`);

  return (
    <span
      aria-label={label}
      className="c-badge"
      data-tone="soft"
      data-variant="outline"
      role="note"
      {...span}
    >
      <ProgressionMethodIcon method={method} size="xs" />
      {label}
    </span>
  );
}
