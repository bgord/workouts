import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import { bodyWeightRoute } from "../router";

export function BodyWeightMeasurementExport() {
  const t = bg.useTranslations();
  const { bodyWeightStats } = bodyWeightRoute.useLoaderData();

  if (!bodyWeightStats) return null;

  return (
    <a
      aria-label={t("measurements.body_weight.export.cta")}
      className="c-button"
      data-variant="icon"
      download
      href="/api/measurements/body-weight/export"
      rel="noopener"
      target="_blank"
      title={t("measurements.body_weight.export.cta")}
    >
      <Download data-size="sm" />
    </a>
  );
}
