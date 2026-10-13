import * as bg from "@bgord/ui";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";
import { DailyStepsList } from "./daily-steps-list";
import { DailyStepsStats } from "./daily-steps-stats";

export function DailyStepsHistory() {
  const t = bg.useTranslations();
  const { dailyStepsStats } = dailyStepsRoute.useLoaderData();

  if (!dailyStepsStats) return null;

  return (
    <div data-stack="y" {...ui.Gap.section}>
      <DailyStepsStats {...dailyStepsStats} />

      <div data-stack="y" {...ui.Gap.related}>
        <h2>{t("measurements.daily_steps.history")}</h2>

        <DailyStepsList />
      </div>
    </div>
  );
}
