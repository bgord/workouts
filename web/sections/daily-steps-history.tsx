import * as bg from "@bgord/ui";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";
import { DailyStepsFilters } from "./daily-steps-filters";
import { DailyStepsGoal } from "./daily-steps-goal";
import { DailyStepsList } from "./daily-steps-list";
import { DailyStepsProgressChart } from "./daily-steps-progress-chart";
import { DailyStepsStats } from "./daily-steps-stats";

export function DailyStepsHistory() {
  const t = bg.useTranslations();
  const { dailyStepsStats } = dailyStepsRoute.useLoaderData();

  if (!dailyStepsStats) return null;

  return (
    <div data-stack="y" {...ui.Gap.section}>
      <div data-stack="y" {...ui.Gap.related}>
        <DailyStepsStats {...dailyStepsStats} />

        <DailyStepsGoal />
      </div>

      <DailyStepsProgressChart />

      <div data-stack="y" {...ui.Gap.related}>
        <h2>{t("measurements.daily_steps.history")}</h2>

        <DailyStepsFilters />

        <DailyStepsList />
      </div>
    </div>
  );
}
