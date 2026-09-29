import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import * as ui from "../components";

export function BodyPartMeasurementExport() {
  const t = bg.useTranslations();

  return (
    <ui.IconButton
      aria-label={t("measurements.body_parts.export.cta")}
      disabled
      title={t("measurements.body_parts.export.cta")}
    >
      <Download data-size="sm" />
    </ui.IconButton>
  );
}
