import * as bg from "@bgord/ui";
import { X } from "lucide-react";

export function ButtonClose(props: React.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  return (
    <button
      aria-label={t("app.close")}
      className="c-button"
      data-interaction="subtle-scale"
      data-variant="icon"
      title={t("app.close")}
      type="button"
      {...props}
    >
      <X data-size="md" />
    </button>
  );
}
