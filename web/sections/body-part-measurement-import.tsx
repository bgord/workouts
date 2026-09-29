import * as bg from "@bgord/ui";
import { Upload } from "lucide-react";
import * as ui from "../components";

export function BodyPartMeasurementImport() {
  const t = bg.useTranslations();

  return (
    <ui.IconButton
      aria-label={t("measurements.body_parts.import.cta")}
      disabled
      title={t("measurements.body_parts.import.cta")}
    >
      <Upload data-size="sm" />
    </ui.IconButton>
  );
}
