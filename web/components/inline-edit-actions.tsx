import * as bg from "@bgord/ui";
import { Check, X } from "lucide-react";
import { Gap } from "./gap";
import { IconButton } from "./icon-button";

export function InlineEditActions(
  props: React.JSX.IntrinsicElements["div"] & { disabled?: boolean; onCancel: () => void },
) {
  const t = bg.useTranslations();
  const { disabled, onCancel, ...rest } = props;

  return (
    <div data-stack="x" {...Gap.inline} {...rest}>
      <IconButton
        aria-label={t("app.save")}
        disabled={disabled}
        title={t("app.save")}
        tone="positive"
        type="submit"
      >
        <Check data-size="sm" />
      </IconButton>

      <IconButton aria-label={t("app.cancel")} onClick={onCancel} title={t("app.cancel")}>
        <X data-size="sm" />
      </IconButton>
    </div>
  );
}
