import * as bg from "@bgord/ui";
import { LengthFormat } from "../services/length-format";

export function useLengthValue() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();

  return (millimeters: number) =>
    t("measurements.body_parts.value", {
      value: LengthFormat.centimeters(millimeters).toLocaleString(language, { minimumFractionDigits: 1 }),
    });
}
