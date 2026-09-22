import * as bg from "@bgord/ui";
import type { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { Gap } from "./gap";
import { ProgressionMethodIcon } from "./progression-method-icon";

export function ProgressionMethodBadge(props: { method: ProgressionMethodOptions }) {
  const t = bg.useTranslations();

  return (
    <span className="c-badge" data-cross="center" data-tone="soft" data-variant="outline" {...Gap.inline}>
      <ProgressionMethodIcon method={props.method} size="xs" />
      {t(`progression.method.${props.method}`)}
    </span>
  );
}
