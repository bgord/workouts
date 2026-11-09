import * as bg from "@bgord/ui";
import * as ui from "../components";
import { Scale } from "../icons";
import { bodyWeightRoute } from "../router";

export function BodyWeightMeasurementsEmpty() {
  const t = bg.useTranslations();
  const { bodyWeightStats } = bodyWeightRoute.useLoaderData();

  if (bodyWeightStats) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Scale} />

      <ui.EmptyStateMessage>{t("measurements.body_weight.empty")}</ui.EmptyStateMessage>

      <small>{t("measurements.body_weight.empty.hint")}</small>
    </ui.EmptyState>
  );
}
