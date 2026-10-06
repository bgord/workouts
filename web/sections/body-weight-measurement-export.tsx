import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import { bodyWeightRoute } from "../router";

export function BodyWeightMeasurementExport() {
  const t = bg.useTranslations();
  const { bodyWeightStats } = bodyWeightRoute.useLoaderData();

  if (!bodyWeightStats) return null;

  return (
    <bg.MenuLink download href="/api/measurements/body-weight/export" rel="noopener" target="_blank">
      <Download data-size="sm" />
      {t("measurements.body_weight.export.cta")}
    </bg.MenuLink>
  );
}
