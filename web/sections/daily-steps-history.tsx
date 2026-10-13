import * as bg from "@bgord/ui";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";
import { DailyStepsList } from "./daily-steps-list";

export function DailyStepsHistory() {
  const t = bg.useTranslations();
  const { dailySteps } = dailyStepsRoute.useLoaderData();

  if (dailySteps.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.related}>
      <h2>{t("measurements.daily_steps.history")}</h2>

      <DailyStepsList />
    </div>
  );
}
