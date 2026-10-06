import * as bg from "@bgord/ui";
import { Ellipsis } from "lucide-react";

export function MenuTrigger(props: React.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();
  const { "aria-label": label = t("app.menu"), children, ...rest } = props;

  return (
    <bg.MenuTrigger aria-label={label} className="c-button" data-variant="icon" {...rest}>
      {children ?? <Ellipsis data-size="sm" />}
    </bg.MenuTrigger>
  );
}
