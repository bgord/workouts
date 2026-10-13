import * as bg from "@bgord/ui";
import { Footprints } from "lucide-react";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

export function DailyStepsEmpty() {
  const t = bg.useTranslations();
  const { dailySteps } = dailyStepsRoute.useLoaderData();

  if (dailySteps.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Footprints} />

      <ui.EmptyStateMessage>{t("measurements.daily_steps.empty")}</ui.EmptyStateMessage>

      <small>{t("measurements.daily_steps.empty.hint")}</small>
    </ui.EmptyState>
  );
}
