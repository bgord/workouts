import * as bg from "@bgord/ui";
import { LengthFormat } from "../services/length-format";

export function LengthValue(props: { millimeters: number }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return t("measurements.body_parts.value", {
    value: LengthFormat.centimeters(props.millimeters).toLocaleString(language, { minimumFractionDigits: 1 }),
  });
}
