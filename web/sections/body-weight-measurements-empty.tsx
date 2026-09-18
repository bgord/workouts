import * as bg from "@bgord/ui";
import { Scale } from "lucide-react";
import * as ui from "../components";
import { measurementsRoute } from "../router";

export function BodyWeightMeasurementsEmpty() {
  const t = bg.useTranslations();
  const { measurements } = measurementsRoute.useLoaderData();

  if (measurements.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Scale} />

      <ui.EmptyStateMessage>{t("measurements.body_weight.empty")}</ui.EmptyStateMessage>

      <ui.Meta>{t("measurements.body_weight.empty.hint")}</ui.Meta>
    </ui.EmptyState>
  );
}
