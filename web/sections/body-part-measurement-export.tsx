import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import { bodyPartsRoute } from "../router";

export function BodyPartMeasurementExport() {
  const t = bg.useTranslations();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  if (!bodyParts.data.some((bodyPart) => bodyPart.measurements.length > 0)) return null;

  return (
    <a
      aria-label={t("measurements.body_parts.export.cta")}
      className="c-button"
      data-variant="icon"
      download
      href="/api/measurements/body-part/export"
      rel="noopener"
      target="_blank"
      title={t("measurements.body_parts.export.cta")}
    >
      <Download data-size="sm" />
    </a>
  );
}
