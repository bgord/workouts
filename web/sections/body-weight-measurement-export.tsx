import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import { measurementsRoute } from "../router";

export function BodyWeightMeasurementExport() {
  const t = bg.useTranslations();
  const { bodyWeightStats } = measurementsRoute.useLoaderData();

  if (!bodyWeightStats) return null;

  return (
    <a
      aria-label={t("measurements.body_weight.export.cta")}
      className="c-button"
      data-color="neutral-400"
      data-hover-color="neutral-0"
      data-px="0"
      data-variant="ghost"
      download
      href="/api/measurements/body-weight/export"
      rel="noopener"
      target="_blank"
      title={t("measurements.body_weight.export.cta")}
      {...bg.Rhythm().times(3).style.width}
    >
      <Download data-size="sm" />
    </a>
  );
}
